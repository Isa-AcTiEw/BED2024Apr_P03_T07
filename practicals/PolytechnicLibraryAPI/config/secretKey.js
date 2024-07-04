require('dotenv').config();
function generateSecretKey(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let secretKey = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        secretKey += charset[randomIndex];
    }
    return secretKey;
}

const secretKey = process.env.SECRET_KEY || generateSecretKey(10);

module.exports = {
    secretKey: secretKey
};
