
const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const chapterSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },

        book: {
            type: String,
            ref: "Book",
            required: [true, "Book id is required"],
        },

        chapter_title: {
            type: String,
            required: [true, "Chapter title is required"],
            trim: true,
            minlength: [2, "Chapter title must be at least 2 characters"],
            maxlength: [100, "Chapter title cannot exceed 100 characters"],
        },

        chapter_number: {
            type: Number,
            required: [true, "Chapter number is required"],
            min: [1, "Chapter number must be greater than 0"],
        },

        // Brief description/summary of the chapter (optional)
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        // Page range in the PDF where this chapter starts
        start_page: {
            type: Number,
            required: [true, "Start page is required"],
            min: [1, "Start page must be greater than 0"],
        },

        // Page range in the PDF where this chapter ends
        end_page: {
            type: Number,
            required: [true, "End page is required"],
            min: [1, "End page must be greater than 0"],
            validate: {
                validator: function(value) {
                    return value >= this.start_page;
                },
                message: "End page must be greater than or equal to start page"
            }
        },

        // Duration estimate in minutes (optional - calculated from page count)
        duration_minutes: {
            type: Number,
            min: [1, "Duration must be greater than 0"],
        },
    },
    {
        timestamps: true,
    }
);

chapterSchema.pre("save", async function () {

    if (this.isNew) {

        this._id = await generateCustomId(
            "chapter_sequence_id",
            "CH",
            "",
            3
        );
    }
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;