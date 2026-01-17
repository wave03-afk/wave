const express = require("express");
const couponRoute = express.Router();
//database
//users database
const userData = require("../modules/user_data");
//user Transaction
const userTransactions = require("../modules/user_transactions_data");
//coupon database
const Coupon = require("../modules/admin/coupon");

//middle ware
const validateCouponRequst = async (req, res, next) => {
  const body = req.body;
  if (!body.couponCode || !body.userId)
    return res
      .status(403)
      .json({ massage: "invalid requst body one or more fileds are empty" });
  const userId = body.userId;
  const couponCode = body.couponCode;
  try {
    const validateCoupon = await Coupon.find({ couponCode: couponCode });
    if (validateCoupon.length === 0)
      return res.status(404).json({status: 404, massage: "invalide coupon code" });
    const date = validateCoupon[0].couponActiveDate;
    const eachDate = date.split("/");
    const dateDay = Number(eachDate[0]);
    const dateMonth = Number(eachDate[1]);
    const newDate = new Date();
    const newDateDay = newDate.getDate();
    const newDateMonth = newDate.getMonth() + 1;
    if (dateDay !== newDateDay)
      return res.status(403).json({ status: 403, massage: "coupon code has expired" });
    if (dateMonth !== newDateMonth)
      return res.status(403).json({ status: 403, massage: "coupon code has expired" });
    const userTransaction = await userTransactions.find({ userId: userId, transactionId: couponCode });
    if(userTransaction.length!==0) return res.status(200).json({status: 200, massage: 'Coupon has already been used by you'})
    const user = await userData.findById({ _id: userId });
    if (!user) return res.status(403).json({ status: 403, massage: "no user found " });
    const userBalance = user.balance;
    res.userBalance = userBalance;
    next();
  } catch (error) {
    console.log(error);
  }
};

//validate coupon code
couponRoute.post("/", validateCouponRequst, async (req, res) => {
  const userBalance = res.userBalance;
  const data = req.body;
  const couponCode = data.couponCode;
  const userId = data.userId;
  const randomNumber = Math.floor(Math.random() * 3);
  try {
    const findCoupon = await Coupon.find({ couponCode: couponCode });
    const couponAmount = findCoupon[0].couponAmount.split(" ");
    const userLuckyAmount = Number(couponAmount[randomNumber]);
    const userUpdatedBalance = userBalance + userLuckyAmount;
    const user = await userData.updateOne(
      { _id: userId },
      { $set: { balance: userUpdatedBalance } }
    );
    if (!user.acknowledged)
      return res.status(500).json({status: 500, massage: "server error" });
    const date = getDate();
    const data = await new userTransactions({
      userId: userId,
      transactionId: couponCode,
      transactionData: {
        amount: `${userLuckyAmount}`,
        status: "succesful",
        type: "coupon bonus",
        date: date,
      },
    });
    if (!data) return res.status(500).json({ massage: "server error" });
    const responds = await data.save();
    if (!responds) return res.status(500).json({ massage: "server error" });
    res.status(200).json({status: 200, massage: "coupon successfully applied" });
  } catch (error) {
    console.log(error);
  }
});
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
module.exports = couponRoute;
