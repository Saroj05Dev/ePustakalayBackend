const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const orderSchema = new mongoose.Schema({
    _id:{
        type:String
    },
    userId:{
        type:String,
        ref:"User",
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["PENDING","CONFIRMED","CANCELLED","DELIVERED"],
        default:"PENDING"
    },
    shippingAddress:{
        fullName:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required: [true, "Phone number is required"],
            match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"]
        },
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        }

    },
    isRated:{
        type:Boolean,
        default:false
    }

},{timestamps:true}
);

orderSchema.pre("save",async function(){
    if(this.isNew){
        let statusCode="PD";

        if(this.status === "CONFIRMED") statusCode = "CF";
        if(this.status === "DELIVERED") statusCode = "DL";
        if(this.status === "CANCELLED") statusCode = "CN";

        this._id = await generateCustomId(
            "order_sequence_id",
            "ORD",
            statusCode,
            3
        );

    }
});

const Order = mongoose.model("Order",orderSchema);

module.exports=Order;