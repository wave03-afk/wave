const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema;
const Orders = new OrderSchema({
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: String,
    required: true,
  },
  itemReturnTimePeriod: {
    type: Number,
    required: true,
  },
  itemReturnAmount: {
    type: Number,
    required: true,
  },
  itemBoughtDate: {
    type: String,
    required: true,
  },
  itemReturnTimesPaid:{
    type: Number,
    required: true,
  },
  itemReturnStatus:{
    type: String,
    required: true,
  },
  userId:{
    type: String,
    required: true
  }
});

const UserOrders = mongoose.model("order", Orders);
module.exports = UserOrders;
