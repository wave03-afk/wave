const express=require('express');
const userRouter=express.Router();
//database
//user
const userData = require("../modules/user_data");


userRouter.get('/', (req, res)=>{
    res.render('../views/user')
})
//get user details
userRouter.get('/:id/g/u/d',  async(req, res)=>{
    const id=req.params.id
    try{
        const data= await userData.findById({_id: id});
        if(!data) return res.status(404).json({massage: 'no user found'})
        res.json({responds: data})
    }catch(error){
        console.log('error:'+error)
    }
});
module.exports=userRouter;