const express=require('express');
const rechargeRouter=express.Router();


rechargeRouter.get('/', (req, res)=>{
    res.render('../views/recharge')
});
//paymet
rechargeRouter.get('/:id/payment', (req, res)=>{
    const amount=req.params.id;
    res.render('../views/payment',{amount : amount})
})
module.exports=rechargeRouter;