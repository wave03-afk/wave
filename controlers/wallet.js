const express= require('express');
const walletRouter= express.Router();
//database
const userData= require('../modules/user_data');
//middleware
const authorization= require('../middwares/api_acces_public');


//veiw wallet page
walletRouter.get('/' ,(req, res)=>{
    res.render('../views/wallet');
})
//get user wallet details
walletRouter.get('/:id/u/a/d', async(req, res)=>{
    const userId=req.params.id
    if(!userId) return res.status(403).json({status: 403, massage: 'user id is required'});
    try{
        const data= await userData.findById({_id: userId});
        if(!data) return res.status(404).json({status: 404, massage: 'user not found'});
        const walletDetails={
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            bankName: data.bankName
        };
        res.status(200).json({status: 200, wallet : walletDetails});
    }catch(error){
        console.log(error);
    }
})
//update user wallet
walletRouter.patch('/up/d', authorization, async(req, res)=>{
    const body=req.body
    const userId=body.userId;
    const accountName= body.accountName;
    const accountNumber= body.accountNumber;
    const bankName= body.bankName;
    try{
        const data= await userData.updateOne({_id: userId},
            {$set:{
                bankName: bankName,
                accountName: accountName,
                accountNumber: accountNumber
            }});
        if(!data.acknowledged) return res.status(500).json({status: 500, massage: 'server error'})
            return res.status(200).json({status: 200, massage: 'Succesfully added wallet'})
    }catch(error){

    }
})

module.exports= walletRouter;