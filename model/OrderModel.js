// models/OrderModel.js
const { model } = require("mongoose");
const { OrderSchema } = require("../schemas/OrderSchema");

// ✅ Correct model for orders
const OrderModel = model("Order", OrderSchema);

module.exports = { OrderModel };
