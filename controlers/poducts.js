const express = require("express");
const productsRouter = express.Router();
//database
//user data database
const userData = require("../modules/user_data");
//user transaction database
const userTransactions = require("../modules/user_transactions_data");
//user order database
const UserOrders = require("../modules/orders");

const validateOrderRequst = async(req, res, next) => {
  const body = req.body;
  if (
    !body.itemName ||
    !body.itemPrice ||
    !body.itemReturnAmount ||
    !body.itemReturnTimePeriod ||
    !body.userId 
  )
    return res.status(403).json({ status: 403, massage: "Invalide order requst" });
  const user= await userData.findById({_id: body.userId})
  if(!user.name) return res.status(404).json({status: 404, massage: 'Cant make order as no user was found'})
  next();
};

//render list of products
productsRouter.get("/", (req, res) => {
  res.render("../views/products");
});
//make product order
productsRouter.post("/p/o/", validateOrderRequst, async (req, res) => {
  const validationNumberValue = 0;
  const data = req.body;
  const userId = data.userId;
  const itemPrice = Number(data.itemPrice);
  try {
    const userDetails = await userData.findById({ _id: userId });
    const userBalance = userDetails.balance;
    const orderCount= userDetails.orderCount;
    const newOrderCount= orderCount + 1;
    const userBalanceLeft = userBalance - itemPrice;
    if (userBalanceLeft < validationNumberValue)
      return res.render('../views/order_rejected');
    const updateUserBalance = await userData.updateOne(
      { _id: userId },
      { $set: { balance: userBalanceLeft, orderCount: newOrderCount } }
    );
    if (!updateUserBalance.acknowledged)
      return res
        .status(500)
        .json({ status: 500, massage: "server error when updating balance" });
    const date = getDate();
    const order = new UserOrders({
      itemName: data.itemName,
      itemPrice: data.itemPrice,
      itemReturnTimePeriod: data.itemReturnTimePeriod,
      itemReturnAmount: data.itemReturnAmount,
      itemBoughtDate: date,
      itemReturnTimesPaid: 0,
      itemReturnStatus: "Pending",
      userId: userId
    });
    const responds = order.save();
    responds.then((e) => {
      transactionId(userId).then((e) => {
        const data = new userTransactions({
          userId: userId,
          transactionId: e,
          transactionData: {
            amount: balanceUi(String(itemPrice)),
            status: "succesful",
            type: "product order",
            date: date,
          },
        });
        const respond = new Promise((resolve, reject) => {
          resolve(data.save());
          reject(error);
        })
          .then(() => {
            res.render('../views/order_succesful');
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  } catch (error) {
    res.status(500).json({ status: 500, massage: "server error" });
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

//test space
productsRouter.get("/test", async (req, res) => {
  const orders = await UserOrders.find();
  res.json({ orders });
});

module.exports = productsRouter;
