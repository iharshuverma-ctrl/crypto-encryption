const crypto = require("node:crypto");

const algorithm = "aes-256-gcm";

// 32-byte secret key
const key = crypto.randomBytes(32);

function encrypt(text) {
    // Fresh IV for every encryption
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
        encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex")
    };
}

function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(encryptedData.iv, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(encryptedData.authTag, "hex")
    );

    let decrypted = decipher.update(
        encryptedData.encrypted,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
}


// Original message
const message = "Harsh Verma - MCA Student";

// Encrypt
const encryptedData = encrypt(message);

console.log("===== ENCRYPTION =====");
console.log("Original:", message);
console.log("Encrypted:", encryptedData.encrypted);
console.log("IV:", encryptedData.iv);
console.log("Auth Tag:", encryptedData.authTag);


// Decrypt
const decryptedMessage = decrypt(encryptedData);

console.log("\n===== DECRYPTION =====");
console.log("Decrypted:", decryptedMessage);

console.log("\nModel training complete 🚀");
