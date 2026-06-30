const express = require("express");
const router =  express.Router();
const orderController = require("../controllers/order.controller");
const {auth,authorizeRole} = require("../middlewares/auth.middleware");

router.post("/",auth,orderController.createOrder);
router.get("/",auth,orderController.getMyOrders);
router.get("/all",auth,authorizeRole(["admin"]),orderController.getAllOrders);
router.get("/:orderId",auth,orderController.getOrderById);
router.put("/:orderId/status",auth,authorizeRole(["admin","seller"]),orderController.updateStatus);
router.put("/:orderId/cancel",auth,orderController.cancelOrder);
router.put("/:orderId/rate",auth,orderController.markOrderAsRated);
router.delete("/:orderId",auth,authorizeRole(["admin"]),orderController.deleteOrder);

module.exports = router;