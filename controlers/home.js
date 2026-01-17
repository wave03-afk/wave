const express=require("express");
const homeRouter=express.Router();

homeRouter.get('/', (req, res)=>{
    res.render('../views/home')
})



module.exports=homeRouter;