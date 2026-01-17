const express = require("express");
const paymentValidation = express.Router();
//users database
const userData = require("../modules/user_data");
//user Transaction
const userTransactions = require("../modules/user_transactions_data");
// admin database
const depositTransaction = require("../modules/admin/deposit_payment");

//middwarea
const updateUserPayment = async (req, res, next) => {
  const data = req.body;
  const userDetails = await userData.findById({ _id: data.userId });
  if (!userDetails)
    return res.status(404).json({ massage: "no records found" });
  const userBalance = userDetails.balance;
  const userTransaction = await userTransactions.find({
    userId: data.userId,
    transactionId: data.transactionId,
  });
  if (userTransaction.length === 0)
    return res.status(404).json({ massage: "no records found" });
   const transactionType=userTransaction[0].transactionData.type;
  if(transactionType!=='deposit') return res.status(403).json({massage: 'wrong api end point api is only accces on valid deposit'})
  if(userTransaction[0].transactionData.status==="successful") return res.status(403).json({ massage: "Transaction has already been validated" });
  if(userTransaction[0].transactionData.type==="Welcome Bonus") return res.status(403).json({ massage: "Transaction has already been validated" });
  res.userBalance = userBalance;
  next();
};

//get payments
paymentValidation.get("/", async (req, res) => {
  try {
    const datas = await depositTransaction.find();
    if(datas.length===0) return res.status(200).json({massage:'No payment made'});
    res.status(200).json({ datas });
  } catch (error) {
    console.log("error:" + error);
  }
});
//update paymnet
paymentValidation.patch("/up/p", updateUserPayment, async (req, res) => {
  const data = req.body;
  const amount = data.amount;
  const userBalance = res.userBalance + Number(amount);
  try {
    const userTransaction = await userTransactions.updateOne(
      {
        userId: data.userId,
        transactionId: data.transactionId,
      },
      {
        $set: {
          "transactionData.amount": balanceUi(String(amount)),
          "transactionData.status": data.status,
        },
      }
    );
    if (!userTransaction.acknowledged)
      return res.status(403).json({ massage: "update was not successful" });
    const adminData= await depositTransaction.updateOne(
      {
        userId: data.userId,
        transactionId: data.transactionId,
      },
      { $set: { status: "Successful", amount: amount } }
    );
    if (!adminData.acknowledged)
      return res.status(403).json({ massage: "update was not successful" });
    const user = await userData.updateOne(
      { _id: data.userId },
      { $set: { balance: userBalance } }
    );
    if (!user.acknowledged)
      return res.status(403).json({ massage: "update was not successful" });
    res.status(201).json({ massage: "successfully updated data", data: user });
  } catch (error) {
    console.log(error);
  }
});
//
const balanceUi = (e) => {
  const data = e.split("");
  const dataHundredValue = data.length - 3;
  const hundred = [];
  if (dataHundredValue >= 1) {
    for (let i = 0; i < data.length; i++) {
      hundred.push(data[dataHundredValue + i]);
    }
  } else {
    return data.join("");
  }
  const thousand = [];
  const datathousand = dataHundredValue - 3;
  if (datathousand >= 1) {
    for (let i = datathousand; i < dataHundredValue; i++) {
      thousand.push(data[i]);
    }
    const million = [];
    for (let i = 0; i < datathousand; i++) {
      million.push(data[i]);
    }
    const result = `${million.join("")},${thousand.join("")},${hundred.join(
      ""
    )}`;
    return result;
  } else {
    const leftValue = [];
    for (let i = 0; i < dataHundredValue; i++) {
      leftValue.push(data[i]);
    }
    const result = `${leftValue.join("")},${hundred.join("")}`;
    return result;
  }
};
module.exports = paymentValidation;
