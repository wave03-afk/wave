const express = require("express");
const withdrawalRouter = express.Router();
//database
//user database
const userData = require("../modules/user_data");
//user transaction database
const userTransactions = require("../modules/user_transactions_data");
//admin deposit database
const withdrawalTransaction = require("../modules/admin/withdrawal_payment");

//middleware
const validateUserId = async (req, res, next) => {
  const body = req.body;
  const userId = body.userId;
  const withdrawAmount = body.amount;
  const user = await userData.findById({ _id: userId });
  if (!user)
    return res
      .status(404)
      .json({ massage: "cant make withdrawal as no user was found" });
  res.name = user.name;
  const userMainBalance = user.balance;
  const userBalance = userMainBalance - withdrawAmount;
  if (userBalance < 0)
    return res
      .status(403)
      .json({ massage: "withdrawal amount is above user balance" });
  const userUpdated = await userData.updateOne(
    { _id: userId },
    { $set: { balance: userBalance } }
  );
  next();
};

//make withdrawal
withdrawalRouter.post("/m/w", validateUserId, async (req, res) => {
  const name= res.name;
  const body = await req.body;
  const amount = body.amount;
  const transactionType = body.type;
  const userId = body.userId;
  const accountName = body.accountName;
  const accountNumber = body.accountNumber;
  const bankName = body.bankName;
  try {
    transactionId(userId).then((e) => {
      const date = getDate();
      const data = new userTransactions({
        userId: userId,
        transactionId: e,
        transactionData: {
          amount: balanceUi(String(amount)),
          status: "pending",
          type: transactionType,
          date: date,
        },
      });
      const adminData = new withdrawalTransaction({
        userId: userId,
        name: name,
        transactionId: e,
        amount: amount,
        date: date,
        status: "pending",
        accountName: accountName,
        accountNumber: accountNumber,
        bankName: bankName,
      });
      const respond = new Promise((resolve, reject) => {
        resolve(data.save(), adminData.save());
        reject(error);
      })
        .then(() => {
          res.render('../views/withdrawal_pending');
        })
        .catch((error) => {
          console.log(error);
        });
    });
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
// validate id to avoid repitation
const transactionId = async function (id) {
  try {
    const transactions = await userTransactions.find({ userId: id });
    if (transactions.length !== 0) {
      const transactionId = [];
      if (transactions.length === 1) {
        transactionId.push(transactions[0].transactionId);
      } else {
        transactions.forEach((e) => transactionId.push(e.transactionId));
      }
      let newTransactionId = null;
      do {
        const generatedTransactionId = getID();
        newTransactionId = generatedTransactionId;
      } while (transactionId.includes(newTransactionId));
      return newTransactionId;
    } else {
      const generatedTransactionId = getID();
      return generatedTransactionId;
    }
  } catch (error) {
    console.log("error:" + error);
  }
};
//get date
const getDate = () => {
  const date = new Date();
  const fullDate = `${
    date.getDate() >= 10 ? date.getDate() : "0" + date.getDate()
  }/${
    ((month = date.getMonth() + 1), month >= 10 ? month : "0" + month)
  }/${date.getFullYear()}`;
  const time = `${date.getHours()}:${
    date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()
  }`;
  const dateAndTime = `${fullDate} ${time}`;
  return dateAndTime;
};
//get id
const getID = () => {
  const id = Math.random().toString(36).slice(2, 11);
  return id;
};

module.exports = withdrawalRouter;
