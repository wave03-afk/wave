const express = require("express");
const paymentRouter = express.Router();
//database
//user database
const userData = require("../modules/user_data");
//user transaction database
const userTransactions = require("../modules/user_transactions_data");
//admin deposit database
const depositTransaction = require("../modules/admin/deposit_payment");

//middleware
const validateUserId = async (req, res, next) => {
  const body = req.body;
  const userId = body.userId;
  const user = await userData.findById({ _id: userId });
  if (!user)
    return res
      .status(404)
      .json({ massage: "cant make payment as no user was found" });
  res.name = user.name;
  next();
};

//make payment
paymentRouter.post("/m/p", validateUserId, async (req, res) => {
  if (!req.body.verified)
    return res
      .status(403)
      .json({ massage: "invalid payment requst verification required" });
  if (req.body.verified === "true") {
    const name= res.name;
    const body = req.body;
    const amount = body.amount;
    const transactionType = body.type;
    const userId = body.userId;
    try {
      transactionId(userId).then((e) => {
        const date = getDate();
        const data = new userTransactions({
          userId: userId,
          transactionId: e,
          transactionData: {
            amount: balanceUi(amount),
            status: "pending",
            type: transactionType,
            date: date,
          },
        });
        const adminData = new depositTransaction({
          userId: userId,
          name: name,
          transactionId: e,
          amount: amount,
          date: date,
          status: "pending",
        });
        const respond = new Promise((resolve, reject) => {
          resolve(data.save(), adminData.save());
          reject(error);
        })
          .then(() => {
            res.render('../views/pending');
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const name= res.name;
    const body = await req.body;
    const amount = body.amount;
    const transactionType = body.type;
    const userId = body.userId;
    try {
      transactionId(userId).then((e) => {
        const date = getDate();
        const data = new userTransactions({
          userId: userId,
          transactionId: e,
          transactionData: {
            amount: balanceUi(String(amount)),
            status: "rejected",
            type: transactionType,
            date: date,
          },
        });
        const adminData = new depositTransaction({
          userId: userId,
          name: name,
          transactionId: e,
          amount: amount,
          date: date,
          status: "rejected",
        });
        const respond = new Promise((resolve, reject) => {
          resolve(data.save(), adminData.save());
          reject(error);
        })
          .then(() => {
            res.render('../views/rejected');
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
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

module.exports = paymentRouter;
