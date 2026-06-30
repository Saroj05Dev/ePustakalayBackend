const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
                data: null,
                error: null,
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token format is invalid",
                data: null,
                error: null,
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
            data: null,
            error: error,
        });
    }
};

exports.optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next();
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

        req.user = decoded;
        next();

    } catch (error) {
        next();
    }
};

exports.authorizeRole = (allowedRole) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                    data: null,
                    error: null,
                });
            }

            if (!allowedRole.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You do not have permission to perform this action",
                    data: null,
                    error: null,
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
                error: error,
            });
        }
    };
};

exports.validateRegister = (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null,
                error: null,
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
            error: error,
        });
    }
};