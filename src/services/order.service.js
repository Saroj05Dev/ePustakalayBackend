const orderRepo = require("../repositories/order.repository");
const orderItemRepo = require("../repositories/orderItem.repository");
const cartRepo =require("../repositories/cart.repository");
const cartItemRepo = require("../repositories/cartItem.repository");

exports.createOrder = async(userId,data)=>{

    if (!data || !data.shippingAddress) {
        const error = new Error("Shipping address is required");
        error.statusCode = 400;
        throw error;
    }

    const cart = await cartRepo.findCartByUser(userId);

     if (!cart) {
        throw new Error("Cart not found for this user");
    }

   const items  = await cartItemRepo.getCartItems(cart._id);

   if(items.length === 0 ){
    throw new Error("Cart is empty");
   }

    let totalAmount = 0; 

    for(const item of items){

        if(!item.bookId){
            throw new Error("Book not found");
        }

    totalAmount += item.bookId.price * item.quantity;

    }

    const order = await orderRepo.createOrder({
        userId,
        totalAmount,
        shippingAddress:data.shippingAddress
    });

    for(const item of items){
        await orderItemRepo.create({
            orderId:order._id,
            bookId:item.bookId._id,
            quantity:item.quantity,
            price:item.bookId.price
        });
    }

    
  await cartItemRepo.deleteByCartId(cart._id);

    return{
        orderId:order._id,
        status:order.status,
        totalAmount:order.totalAmount,
        createdAt:order.createdAt
    };
};


exports.getMyOrders=async(userId)=>{

    if(!userId){
        throw new Error("User not found");
    }

    const orders = await orderRepo.findByUser(userId);
    const ordersWithItems = [];
    for (const order of orders) {
        const items = await orderItemRepo.findByOrder(order._id);
        ordersWithItems.push({
            ...order.toObject(),
            items: items.map(item => ({
                ...item.toObject(),
                book: item.bookId
            }))
        });
    }
    return ordersWithItems;
};

// Add this new service
exports.getAllOrders = async () => {
    const orders = await orderRepo.findAllOrders();
    const ordersWithItems = [];
    for (const order of orders) {
        const items = await orderItemRepo.findByOrder(order._id);
        ordersWithItems.push({
            ...order,
            items: items.map(item => ({
                ...item.toObject(),
                book: item.bookId
            }))
        });
    }
    return ordersWithItems;
};

exports.markOrderAsRated = async (orderId, userId) => {
    const order = await orderRepo.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    if (order.userId !== userId) {
        throw new Error("You can only rate your own order");
    }
    order.isRated = true;
    await order.save();
    return order;
};

exports.getOrderById = async(orderId,userId)=>{

    const order = await orderRepo.findOne({
        _id: orderId,
        userId: userId
    });

    if(!order){
        throw new Error("Order not found");
    }

    const items = await orderItemRepo.findByOrder(orderId);

    return{
        order,
        items
    }
};  

exports.updateStatus = async(orderId,status)=>{

    const normalizedStatus = String(status || "").trim().toUpperCase();

    const validstatus=[
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "DELIVERED"
    ];

    if(!validstatus.includes(normalizedStatus)){
        throw new Error("Invalid status");
    }

    const order = await orderRepo.findById(orderId);

    if(!order){
        throw new Error("Order not found");
    }

    return await orderRepo.updateStatus(orderId,normalizedStatus);

};


exports.cancelOrder = async(orderId,userId)=>{

    const order = await orderRepo.findById(orderId);
    
    if(!order){
        throw new Error("Order not found");
    }

    if(order.userId !== userId){
        throw new Error("You can only cancel your own order");
    }

    if(order.status === "DELIVERED"){
        throw new Error("Delivered orders cannot be cancelled");
    }

    if(order.status === "CANCELLED"){
        throw new Error("Order is already cancelled");
    };

    return await orderRepo.updateStatus(
        orderId,
        "CANCELLED"
    );
};

exports.deleteOrder = async (orderId) => {
    const order = await orderRepo.findById(orderId);
    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }
    return await orderRepo.deleteOrder(orderId);
};
