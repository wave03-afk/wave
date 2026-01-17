const express=require('express');
//database
const userData = require('../modules/user_data');
//middle ware;
const authorise = require('../middwares/api_acces_public');
const withdrawRouter=express.Router();

//middleware
const validateRequst=(req, res, next)=>{
    const userId=req.body.userId
    if(!userId) return res.status(403).json({status: 403, massage: 'user id is requied'});
    res.userId=userId
    next()
}

withdrawRouter.get('/', (req, res)=>{
    res.render('../views/withdraw');
});
//

withdrawRouter.post('/user', validateRequst, authorise, async(req, res)=>{
    const userId= res.userId;
    try{
    const user= await userData.find({_id: userId})
    if(user.length===0) return res.status(404).json({ status: 404, massage: 'no user found'});
    res.status(200).json({status: 200, data: user[0]});
    }catch(error){
        console.log(error);
    }
})
module.exports=withdrawRouter;