const express=require('express');
const registerRouter=express.Router();
//database
//user
const userData = require("../modules/user_data");
//transactions
const userTransactions = require("../modules/user_transactions_data");

//middware
const validateRequst=(req, res, next)=>{
    const body=req.body;
    if(!body.name || !body.phone || !body.password) return res.status(403).json({massage:'Invalid body requst'});
    next();
}
const validateUser= async(req, res, next)=>{
  const body=req.body;
  const phone=body.phone;
  const password=body.password;
  const responds= await userData.find({phone: phone, password: password});
  if(responds.length!==0) return res.status(403).json({massage:'user already exsit, pls login'});
  const respondsPhonecheck= await userData.find({phone: phone});
  if(respondsPhonecheck.length!==0) return res.status(403).json({ status: 403, massage: 'phone number has already been registered'});
  next()
}

//get registration page
registerRouter.get('/', (req, res)=>{
  res.render('../views/register')
})
//register user
registerRouter.post('/user', validateRequst, validateUser, async(req, res)=>{
    const userReq=req.body;
    const amount=300;
    try{
        const data= new userData({
            name: userReq.name,
            phone: userReq.phone,
            balance: amount,
            password: userReq.password,
            accountName : "empty",
            accountNumber : "empty",
            bankName : "empty",
            orderCount :  0
        })
        const responds= await data.save();
        const userId=responds._id;
        const id=userId.toString(userId)
        if(id){
            transactionId(id).then((e) => {
                  const date=getDate()
                  const transactionData = new userTransactions({
                    userId: id,
                    transactionId: e,
                    transactionData: {
                      amount: amount,
                      status: "Successful",
                      type: "Welcome Bonus",
                      date: date,
                    },
                  });
            const responds=new Promise((resolve, reject)=>{
                resolve(transactionData.save());
                reject(error);
            }).then((e)=>{
                if(e) return res.status(201).json({status: 201, massage: 'Registration succesful, pls login'})
            }).catch((error)=>{
                console.log(error)
            }) 
           
        })
    }
    }catch(error){
        console.log('error:'+error);
    }
})
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


module.exports=registerRouter;

