// utils/crypto.js

require('dotenv').config();
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.CRYPTO_SECRET_KEY;

if (!secretKey) {
    throw new Error('CRYPTO_SECRET_KEY is not defined in environment variables');
}

if (secretKey.length !== 64) { // 32 byte = 64 hex characters
    throw new Error('CRYPTO_SECRET_KEY must be a 32-byte hex string (64 characters)');
}

const key = Buffer.from(secretKey, 'hex');
const iv = Buffer.alloc(16, 0); // Initialization vector

function encrypt(text) {
    if (typeof text !== 'string') {
        throw new TypeError('The "text" argument must be of type string');
    }
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    if (typeof encrypted !== 'string') {
        throw new TypeError('The "encrypted" argument must be of type string');
    }
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {encrypt, decrypt};
