"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user to the request
        next(); // Proceed to the next route or middleware
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};
exports.default = authMiddleware;
