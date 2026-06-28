const userRepository = require("../repositories/user.repository");
const cartRepository = require("../repositories/cart.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

exports.registerUser = async (data) => {
    const existingUser = await userRepository.findUserByEmail(data.email);

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = await userRepository.createUser(data);
    const cart = await cartRepository.createCart(user._id);

    return user;
};

exports.loginUser = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw createError("Email and password are required", 400);
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw createError("Email does not exist", 401);
    }

    if (user.status && user.status !== "Active") {
        const err = new Error("Your account has been deactivated or suspended");
        err.statusCode = 403;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw createError("Wrong password entered", 401);
    }

    if (!process.env.SECRET_TOKEN) {
        throw createError("Server authentication is not configured", 500);
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.SECRET_TOKEN,
        {
            expiresIn: "24h"
        }
    );

    return {
        user,
        token
    };
};

exports.getMe = async (userId) => {
    const user = await userRepository.getMe(userId);

    if (!user) {
        throw new Error("user not found");
    }

    return user;
};

exports.getAllUsers = async () => {
    return await userRepository.getAllUsers();
};

exports.updateUser = async (userId, updateData) => {
    const user = await userRepository.updateUser(userId, updateData);
    if (!user) {
        throw new Error("User not found or update failed");
    }
    return user;
};

exports.deleteUser = async (userId) => {
    const result = await userRepository.deleteUser(userId);
    if (!result) {
        throw new Error("User not found or deletion failed");
    }
    return result;
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw createError("Current password and new password are required", 400);
    }

    const user = await userRepository.findUserByIdWithPassword(userId);
    if (!user) {
        throw createError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw createError("Incorrect current password", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password updated successfully" };
};
