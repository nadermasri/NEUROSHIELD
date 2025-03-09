# NEUROSHIELD - AI Security Toolkit

NEUROSHIELD is a comprehensive security toolkit that combines artificial intelligence with cybersecurity features to provide enhanced protection and vulnerability assessment capabilities.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nadermasri/NEUROSHIELD.git
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the server directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/ai-security-toolkit
   SECRET_KEY=yourSuperSecretKey
   NODE_ENV=development
   ACCESS_TOKEN_SECRET=your_long_random_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_long_random_refresh_token_secret_here
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

3. **Setup Frontend**

   ```bash
   cd client
   npm install
   ```

4. **Setup MongoDB**
   - Download MongoDB from the community server
   - Download MongoDB shell
   - Open the mongosh.exe
   - Open MongoDB compass
   - Create a connection and paste this as the URI: mongodb://localhost:27017/ai-security-toolkit (if this didn't work change localhost to 127.0.0.1)
   - Inside the connection create a database called: ai-security-toolkit
   - In the ai-security-toolkit database, create 3 collections (assessments, contacts, users)

## 🚀 Running the Application

1. **Start Backend Server**

   ```bash
   cd server
   npm run dev    # for development
   # or
   npm start      # for production
   ```

   Server will run on http://localhost:5000

2. **Start Frontend Application**
   ```bash
   cd client
   npm start
   ```
   Frontend will run on http://localhost:3000

## 📁 Project Structure

NEUROSHIELD/
├── client/ # Frontend React application
│ ├── public/ # Static files
│ └── src/ # Source files
├── server/ # Backend Node.js application
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Custom middleware
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ └── utils/ # Utility functions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - [your-email@example.com]

Project Link: [https://github.com/yourusername/NEUROSHIELD]
