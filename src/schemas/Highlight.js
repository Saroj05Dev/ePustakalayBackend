const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const highlightSchema = new mongoose.Schema({

    _id: {
        type: String,
    },

    user: {
        type: String,
        ref: 'User',
        required: [true, 'User is required']
    },

    book: {
        type: String,
        ref: 'Book',
        required: [true, 'Book is required']
    },

    chapter: {
        type: String,
        ref: 'Chapter',
        required: [true, 'Chapter is required']
    },

    text: {
        type: String,
        required: [true, 'Selected text is required'],
        trim: true,
        minlength: [1, 'Selected text must be at least 1 character'],
        maxlength: [1000, 'Selected text cannot exceed 1000 characters']
    },

    color: {
        type: String,
        enum: ['yellow', 'pink', 'green', 'blue'],
        default: 'yellow'
    },

    pageNumber: {
        type: Number,
        min: [1, 'Page number must be at least 1']
    }
}, {
    timestamps: true
});

highlightSchema.pre('save', async function () {
    if (this.isNew) {
        this._id = await generateCustomId(
            'highlight_sequence_id',
            'HL',
            '',
            3
        );
    }
});

const Highlight = mongoose.model('Highlight', highlightSchema);
module.exports = Highlight;