const express = require("express");
const dailyReturnRouter = express.Router();
//database
//user
const userData = require("../modules/user_data");
// user Transaction database
const userTransactions = require("../modules/user_transactions_data");
//user order database
const UserOrders = require("../modules/orders");
//
let storedDate = null; // date stored hance server is up and running

//middleware
const validateDaliyReturn = (req, res, next) => {
  const newDate = new Date().getDate();
  if (newDate !== storedDate) {
    storedDate = newDate;
    next();
  } else {
    return res
      .status(403)
      .json({ massage: "daily return as already been paid today" });
  }
};

// pay all users
dailyReturnRouter.get("/dailyReturn", validateDaliyReturn, async (req, res) => {
  let count = 0;
  const orders = await UserOrders.find();
  for (const data of orders) {
    const userId = data.userId;
    const orderId = data._id;
    const timesPaid = data.itemReturnTimesPaid;
    const timesToBePaid = data.itemReturnTimePeriod;
    if (timesPaid < timesToBePaid) {
      const updatedTimesPaid = timesPaid + 1;
      const itemReturnStatus =
        updatedTimesPaid === timesToBePaid ? "Paid" : "pending";
      const dailyReturnAmount = data.itemReturnAmount;
      if (!userId)
        return res.status(403).json({ massage: "invalid requst no user id" });
      const userDetails = await userData.findById({ _id: userId });
      const userBalance = userDetails.balance;
      const updateUserBalance = userBalance + dailyReturnAmount;
      const eachUserOrder = await UserOrders.updateOne(
        { userId: userId, _id: orderId },
        {
          $set: {
            itemReturnTimesPaid: updatedTimesPaid,
            itemReturnStatus: itemReturnStatus,
          },
        }
      );
      if (eachUserOrder.acknowledged) {
        const responds = await userData.updateOne(
          { _id: userId },
          {
            $set: {
              balance: updateUserBalance,
            },
          }
        );
        count = count + 1;
        if (responds.acknowledged) {
          transactionId(userId).then((e) => {
            const date = getDate();
            const transactionData = new userTransactions({
              userId: userId,
              transactionId: e,
              transactionData: {
                amount: balanceUi(String(dailyReturnAmount)),
                status: "Successful",
                type: "daily return",
                date: date,
              },
            });
            const responds = new Promise((resolve, reject) => {
              resolve(transactionData.save());
              reject(error);
            }).catch((error) => {
              console.log(error);
            });
          });
        }
      }
    } else if (timesPaid === timesToBePaid) {
      count = count + 1;
    }
  }
  const dailyReturnStatus =
    count === orders.length
      ? "succesfully paid all users"
      : "didnt pay all users";
  res.status(200).json({ massage: dailyReturnStatus });
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

module.exports = dailyReturnRouter;
