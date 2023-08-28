const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, config.secretKey, { expiresIn: "233h" });
}

module.exports.extractTokenFromRequest = (req) => {
    const token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        return token.slice(7);
    }
    return null;
};

module.exports.verifyToken = (token) => {
    if (token == null) return null;
    return jwt.verify(token, config.secretKey);
};