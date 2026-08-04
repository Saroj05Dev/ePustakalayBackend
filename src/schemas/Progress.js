
const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const readingProgressSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },

        user: {
            type: String,
            ref: "User",
            required: [true, "User id is required"],
            trim: true,
        },

        book: {
            type: String,
            ref: "Book",
            required: [true, "Book id is required"],
            trim: true,
        },

        chapter: {
            type: String,
            ref: "Chapter",
            required: [true, "Chapter id is required"],
            trim: true,
        },

        progress: {
            type: Number,
            default: 0,
            min: [0, "Progress cannot be less than 0"],
            max: [100, "Progress cannot be greater than 100"],
        },

        current_page: {
            type: Number,
            default: 1,
        },

        reading_time: {
            type: Number,
            default: 0,
        },

        is_completed: {
            type: Boolean,
            default: false,
        },

        completed_at: {
            type: Date,
            default: null,
        },

        last_read_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

readingProgressSchema.pre("save", async function () {

    if (this.isNew) {

        this._id = await generateCustomId(
            "reading_progress_sequence_id",
            "RPR",
            null,
            3
        );
    }
});

const ReadingProgress = mongoose.model(
    "ReadingProgress",
    readingProgressSchema
);

module.exports = ReadingProgress;