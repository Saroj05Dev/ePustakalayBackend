const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const ratingSchema = new mongoose.Schema(
    {
        _id:{
            type:String,
        },
        bookId:{
            type:String,
            required:true,
            ref:"Book"
        },
        userId:{
            type:String,
            required:true,
            ref:"User"
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        review:{
            type:String,
            default:""
        },
        orderId:{
            type:String,
            ref:"Order"
        }
},{timestamps:true});


ratingSchema.pre("save", async function () {
    if (this.isNew) {
        this._id = await generateCustomId(
            "rating_sequence_id",
            "RAT",
            null,
            3
        );
    }
});

const rating = mongoose.model("Rating",ratingSchema);

module.exports = rating;