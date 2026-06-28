const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth, authorizeRole } = require("../middlewares/auth.middleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/me", auth, userController.getMe);

router.get("/", auth, authorizeRole(["admin"]), userController.getAllUsers);

const canUpdateUser = (req, res, next) => {
    if (req.user.role === "admin" || req.user.id === req.params.userId) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied. You do not have permission to update this user",
            data: null,
            error: null,
        });
    }
};

router.put("/change-password", auth, userController.changePassword);
router.put("/:userId", auth, canUpdateUser, userController.updateUser);
router.delete("/:userId", auth, authorizeRole(["admin"]), userController.deleteUser);

module.exports = router;
