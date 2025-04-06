from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from art.attacks.evasion import FastGradientMethod, ProjectedGradientDescent, CarliniL2Method
from art.estimators.classification import PyTorchClassifier, TensorFlowV2Classifier
from torchvision import models, transforms
import torch
import torch.nn as nn
import tensorflow as tf
from PIL import Image
import base64
import zipfile
from io import BytesIO
import os
from fpdf import FPDF
import numpy as np

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

LAST_BATCH_REPORT = []

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# Load ImageNet class labels
with open("imagenet_classes.txt", "r") as f:
    IMAGENET_CLASSES = [line.strip() for line in f.readlines()]

def decode_base64_image(base64_string):
    return Image.open(BytesIO(base64.b64decode(base64_string)))

def wrap_model(framework, model_architecture, model_path, input_shape, num_classes):
    if framework == "pytorch":
        loaded = torch.load(model_path, map_location="cpu")

        def get_arch_instance(arch):
            if arch == "resnet18":
                return models.resnet18(weights=None)
            elif arch == "vgg16":
                return models.vgg16(weights=None)
            elif arch == "mobilenet_v2":
                return models.mobilenet_v2(weights=None)
            else:
                raise ValueError("Unsupported or missing architecture for state_dict.")

        if hasattr(loaded, 'eval'):
            model = loaded
        elif isinstance(loaded, dict):
            model = get_arch_instance(model_architecture)
            model.load_state_dict(loaded)
        else:
            raise ValueError("Unknown model format. Please upload a full model or state_dict.")

        model.eval()

        classifier = PyTorchClassifier(
            model=model,
            loss=nn.CrossEntropyLoss(),
            optimizer=torch.optim.Adam(model.parameters()),
            input_shape=input_shape,
            nb_classes=num_classes
        )

    else:
        model = tf.keras.models.load_model(model_path)
        classifier = TensorFlowV2Classifier(
            model=model,
            nb_classes=num_classes,
            input_shape=input_shape,
            loss_object=tf.keras.losses.CategoricalCrossentropy(),
            clip_values=(0.0, 1.0)
        )

    return classifier


@app.route("/custom-attack", methods=["POST"])
def custom_attack():
    try:
        form = request.form
        files = request.files

        model_arch = form.get("model_architecture", "resnet18")
        attack_type = form.get("attack", "fgsm")
        epsilon = float(form.get("epsilon", 0.01))
        input_shape = eval(form.get("input_shape", "(3, 224, 224)"))
        num_classes = int(form.get("num_classes", 1000))
        use_sample = form.get("use_sample_image", "true").lower() == "true"

        model_file = files["model"]
        model_path = os.path.join("uploads", model_file.filename)
        os.makedirs("uploads", exist_ok=True)
        model_file.save(model_path)

        framework = "pytorch" if model_file.filename.endswith(".pt") else "tensorflow"
        classifier = wrap_model(framework, model_arch, model_path, input_shape, num_classes)

        images = []
        if use_sample:
            sample_path = "sample.jpg"
            image = Image.open(sample_path).convert("RGB")
            images = [("sample.jpg", image)]
        else:
            for file in request.files.getlist("images"):
                image = Image.open(file).convert("RGB")
                images.append((file.filename, image))

        batch_results = []

        for filename, image in images:
            input_tensor = transform(image).unsqueeze(0)
            input_np = input_tensor.numpy()
            orig_pred = classifier.predict(input_np)
            orig_label = np.argmax(orig_pred)
            orig_conf = float(np.max(orig_pred))

            if attack_type == "fgsm":
                attack = FastGradientMethod(estimator=classifier, eps=epsilon)
            elif attack_type == "pgd":
                attack = ProjectedGradientDescent(estimator=classifier, eps=epsilon)
            elif attack_type == "cw":
                attack = CarliniL2Method(classifier=classifier)
            else:
                raise ValueError("Unsupported attack type")

            adv_np = attack.generate(x=input_np)
            adv_pred = classifier.predict(adv_np)
            adv_label = np.argmax(adv_pred)
            adv_conf = float(np.max(adv_pred))

            def np_to_base64(np_img):
                tensor_img = torch.tensor(np_img).squeeze().permute(1, 2, 0).detach().numpy()
                tensor_img = np.clip(tensor_img * 255, 0, 255).astype(np.uint8)
                image = Image.fromarray(tensor_img)
                buffered = BytesIO()
                image.save(buffered, format="PNG")
                return base64.b64encode(buffered.getvalue()).decode()

            original_b64 = np_to_base64(input_np)
            adversarial_b64 = np_to_base64(adv_np)

            heatmap_np = np.abs(input_np - adv_np)
            heatmap_np = (heatmap_np - np.min(heatmap_np)) / (np.ptp(heatmap_np) + 1e-8)
            heatmap_np *= 255
            heatmap_np = np.clip(heatmap_np, 0, 255).astype(np.uint8)
            heatmap_img = Image.fromarray(np.transpose(heatmap_np.squeeze(), (1, 2, 0)))
            buffer = BytesIO()
            heatmap_img.save(buffer, format="PNG")
            heatmap_b64 = base64.b64encode(buffer.getvalue()).decode()

            orig_label_name = IMAGENET_CLASSES[orig_label] if orig_label < len(IMAGENET_CLASSES) else str(orig_label)
            adv_label_name = IMAGENET_CLASSES[adv_label] if adv_label < len(IMAGENET_CLASSES) else str(adv_label)

            batch_results.append({
                "filename": filename,
                "original_label": int(orig_label),
                "original_confidence": round(orig_conf, 4),
                "adversarial_label": int(adv_label),
                "adversarial_confidence": round(adv_conf, 4),
                "original_image_base64": original_b64,
                "adversarial_image_base64": adversarial_b64,
                "heatmap_base64": heatmap_b64,
                "original_label_name": orig_label_name,
                "adversarial_label_name": adv_label_name
            })

        global LAST_BATCH_REPORT
        LAST_BATCH_REPORT = batch_results
        return jsonify({"report": batch_results})

    except Exception as e:
        print("⚠️ Backend error occurred:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/download-pdf", methods=["GET"])
def download_pdf():
    if not LAST_BATCH_REPORT:
        return {"error": "No report available yet"}, 400

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Adversarial Attack Report", ln=True, align="C")

    for item in LAST_BATCH_REPORT:
        pdf.ln(10)
        pdf.cell(0, 10, f"Image: {item['filename']}", ln=True)
        pdf.cell(0, 10, f"Original: {item['original_label_name']} ({item['original_confidence']})", ln=True)
        pdf.cell(0, 10, f"Adversarial: {item['adversarial_label_name']} ({item['adversarial_confidence']})", ln=True)

        for key, label in zip(
            ["original_image_base64", "adversarial_image_base64", "heatmap_base64"],
            ["original", "adversarial", "heatmap"]
        ):
            img_data = base64.b64decode(item[key])
            img = Image.open(BytesIO(img_data))
            temp_path = f"temp_{label}.png"
            img.save(temp_path)
            pdf.image(temp_path, w=60)
            os.remove(temp_path)

    pdf_path = "adversarial_report.pdf"
    pdf.output(pdf_path)
    return send_file(pdf_path, as_attachment=True)


@app.route("/download-zip", methods=["GET"])
def download_zip():
    if not LAST_BATCH_REPORT:
        return {"error": "No images available yet"}, 400

    zip_filename = "adversarial_images.zip"
    with zipfile.ZipFile(zip_filename, "w") as zipf:
        for item in LAST_BATCH_REPORT:
            for key, label in zip(
                ["original_image_base64", "adversarial_image_base64", "heatmap_base64"],
                ["original", "adversarial", "heatmap"]
            ):
                if item.get(key):
                    img_data = base64.b64decode(item[key])
                    img = Image.open(BytesIO(img_data))
                    temp_path = f"{label}_{item['filename']}"
                    img.save(temp_path)
                    zipf.write(temp_path)
                    os.remove(temp_path)
    return send_file(zip_filename, as_attachment=True)


if __name__ == "__main__": 
    app.run(debug=True, port=5001)
