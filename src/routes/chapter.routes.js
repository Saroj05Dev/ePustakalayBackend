const express = require("express");
const router = express.Router();

const { 
    addChapter, 
    getChapterById, 
    getChaptersByBook, 
    updateChapter,
    bulkImportChapters,
} = require("../controllers/chapter.controller");

const { auth, authorizeRole } = require("../middlewares/auth.middleware");

router.post("/", auth, authorizeRole(["admin"]), addChapter);

// Bulk import chapters (metadata only)
router.post("/bulk-import", auth, authorizeRole(["admin"]), bulkImportChapters);

router.get("/:chapterId", getChapterById);

router.get("/book/:bookId", getChaptersByBook);

router.put("/:chapterId", auth, authorizeRole(["admin"]), updateChapter);

module.exports = router;