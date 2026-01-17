const express=require('express');
const adminUsersRouter=express.Router();
//database 
//user database
const userData = require("../modules/user_data");


//get all users admin
adminUsersRouter.get('/g/a/u/c', async(req, res)=>{
    try{
        const users= await userData.find();
        if(users.length===0) return res.status(404).json({massage: 'no user was found', totalusers: users.length})
        res.status(200).json({massage: 'total users found', totalusers: users.length})
    }catch(error){
        console.log(error);
    }
})
module.exports= adminUsersRouter;