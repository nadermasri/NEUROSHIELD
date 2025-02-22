// Function to properly compare versions
exports.compareVersions = (userVersion, affectedVersion) => {
    if (!userVersion || !affectedVersion) {
        console.error("Invalid version detected:", { userVersion, affectedVersion });
        return false;
    }

    const userParts = userVersion.split('.').map(Number);
    const affectedParts = affectedVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(userParts.length, affectedParts.length); i++) {
        const userPart = userParts[i] || 0;
        const affectedPart = affectedParts[i] || 0;
        if (userPart < affectedPart) return true;
        if (userPart > affectedPart) return false;
    }
    return false; // If versions are equal, return false (not vulnerable)
};

// Function to ensure versions are correctly formatted
exports.sanitizeVersion = (version) => {
    if (typeof version === 'number') {
        return version.toFixed(3).replace(/\.0+$/, ''); // Convert number to string and remove trailing zeros
    }
    return String(version).trim();
};
