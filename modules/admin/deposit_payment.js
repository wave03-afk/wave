const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema;
const depositShema = new transactionSchema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
const depositTransaction = mongoose.model("depositTransaction", depositShema);
module.exports = depositTransaction;
