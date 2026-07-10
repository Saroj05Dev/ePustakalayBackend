const User = require("../schemas/User");

exports.createUser = async (data) => {
    return await User.create(data);
};

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
};

exports.getMe = async (userId) => {
    return await User.findById(userId).select("-password");
};

exports.getAllUsers = async () => {
    return await User.find({}).select("-password");
};

exports.updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after' }).select("-password");
};

exports.deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

exports.findUserByIdWithPassword = async (userId) => {
    return await User.findById(userId).select("+password");
};