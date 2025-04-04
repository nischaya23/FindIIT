const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user.isBanned) {
            return res.status(403).json({ message: "Forbidden: User is banned" });
        }

        if (!user) {
            return res.status(403).json({ message: "Forbidden: User no longer exists" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: "Forbidden: User is not admin" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

module.exports = authMiddleware;
