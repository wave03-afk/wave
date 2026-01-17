const express=require('express');
const transactionRouter=express.Router();
//user transaction database
const userTransactions = require("../modules/user_transactions_data");
//middleware
const authorization= require('../middwares/api_acces_public');


transactionRouter.get('/', (req, res)=>[
    res.render('../views/transactions')
])
//get user transactions
transactionRouter.get("/:id/g/u/t", authorization, async (req, res) => {
  if (!req.params.id)
    return res.status(403).json({ massage: "user id is required" });
  const data = req.params.id;
  try {
    const userId = data;
    const transactions = await userTransactions.find({ userId: userId });
    if(transactions.length===0) return res.status(404).json({massage:'no reacords found'})
    res.status(200).json({ transactions });
  } catch (error) {
    console.log(error);
  }
});
module.exports=transactionRouter; 