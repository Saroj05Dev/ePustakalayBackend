
const express = require("express");

const router = express.Router();

const {
    createReadingProgress,
    getBookProgress, 
    updateReadingProgress,
    getAllUserProgress
} = require("../controllers/progress.controller");

const {
    auth,
    authorizeRole,
} = require("../middlewares/auth.middleware");

router.post(
    "/",
    auth,
    authorizeRole(["user"]),
    createReadingProgress
);

router.get(
    "/user/all",
    auth,
    authorizeRole(["user"]),
    getAllUserProgress
);

router.get(
    "/:bookId",
    auth,
    authorizeRole(["user"]),
    getBookProgress
);

router.put(
    "/:progressId",
    auth,
    authorizeRole(["user"]),
    updateReadingProgress
);

module.exports = router;