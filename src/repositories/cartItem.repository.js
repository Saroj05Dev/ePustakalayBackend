const CartItem  = require("../schemas/cartItem");

exports.createItem =async(data)=>{
    return await CartItem.create(data);
};

exports.findItem = async(cartId,bookId)=>{
    return await CartItem.findOne({cartId,bookId});
};


exports.findById = async(cartItemId)=>{
    return await CartItem.findById(
        cartItemId
    );
};

exports.getCartItems = async(cartId)=>{
    return await CartItem.find({cartId}).populate("bookId");
};

exports.updateQuantity = async(cartItemId,quantity)=>{
    return await CartItem.findByIdAndUpdate(
        cartItemId,
        {quantity},
        {returnDocument: "after", runValidators: true}
    );
};

exports.deleteItem =async(cartItemId)=>{
    return await CartItem.findByIdAndDelete(cartItemId);
};

exports.deleteByCartId = async(cartId) => {
    return await CartItem.deleteMany({ cartId });
};