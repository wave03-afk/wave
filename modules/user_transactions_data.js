const mongoose = require("mongoose");
const TransactionSchema = mongoose.Schema;
const userTransactions = new TransactionSchema({
  userId: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  transactionData: {
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    type: Object,
    required: true,
  },
});
const transactions = mongoose.model("userTransactions", userTransactions);
module.exports = transactions;
