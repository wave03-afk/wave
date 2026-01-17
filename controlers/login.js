const express=require('express');
const loginRouter=express.Router();
//user database
const userData = require("../modules/user_data");
//

//get login view
loginRouter.get('/', (req, res)=>{
    res.render('../views/login')
})
//admin
const url= process.env.ADMIN_URL;
loginRouter.get(url, (req, res)=>{
    res.render('../views/admin_dashbord')
});


//validate user login
loginRouter.post('/login/validation', async(req, res)=>{
    const data=req.body;
    const phone=data.phone;
    const password=data.password;
    if(phone === process.env.ADDMINE_PHONE  && password === process.env.ADDMINE_PASSWORD){
        const url= process.env.ADMIN_URL;
       return res.status(200).json({ authorization: process.env.PRIVATE_ACCESS_TOKEN, url : url})
    };
    try{
    const responds= await userData.find({phone: phone, password: password});
    if(responds.length===0) return res.status(404).json({ status: 404, massage: 'user does not exist'})
    const userId=responds[0]._id;
    res.status(200).json({userId: userId, authorization: process.env.PUBLIC_ACCESS_TOKEN, url : '/home'})
    }catch(error){
        console.log(error);
    }
})


module.exports=loginRouter;