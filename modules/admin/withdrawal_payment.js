const mongoose = require("mongoose");
const WithdrawPaymentSchema = mongoose.Schema;

const withdrawPaymentSchema = new WithdrawPaymentSchema({
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
  accountName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
});

const withdrawalTransaction = mongoose.model(
  "withdrawalTransaction",
  withdrawPaymentSchema
);
module.exports = withdrawalTransaction;
