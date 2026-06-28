const userService = require("../services/user.service");

exports.registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            error: {}
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "User with this email already exists",
            data: {},
            error: {
                statusCode: error.statusCode || 409,
                isOperational: true
            }
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const data = await userService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successfully",
            token: data.token,
            user: {
                id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                status: data.user.status,
            },
            data: {
                id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                status: data.user.status,
                token: data.token,
            },
            error: {}
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Invalid email or password",
            data: {},
            error: {
                statusCode: error.statusCode || 409,
                isOperational: true
            }
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await userService.getMe(req.user.id);

        res.status(200).json({
            success: true,
            message: "user data fetched successfully",
            data: user,
            error: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "user not found",
            data: {},
            error: {
                statusCode: error.statusCode || 404,
                isOperational: true
            }
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
            error: {}
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch users",
            data: [],
            error: {
                statusCode: error.statusCode || 500,
                isOperational: true
            }
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await userService.updateUser(userId, req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
            error: {}
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update user",
            data: {},
            error: {
                statusCode: error.statusCode || 500,
                isOperational: true
            }
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await userService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: {},
            error: {}
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to delete user",
            data: {},
            error: {
                statusCode: error.statusCode || 500,
                isOperational: true
            }
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        await userService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: {},
            error: {}
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to change password",
            data: {},
            error: {
                statusCode: error.statusCode || 500,
                isOperational: true
            }
        });
    }
};