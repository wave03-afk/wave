const express = require("express");
const adminCouponRouter = express.Router();
//database
//coupon database
const Coupon = require("../modules/admin/coupon");
//middleware
const validateRequst=  async(req, res, next)=>{
    const body=req.body;
    if(!body.couponCode || !body.couponActiveDate || !body.couponAmount) return res.status(403).json({massage: 'invalid requst body one or more fileds are empty'});
    const validateNewCoupon= await Coupon.find({couponCode: body.couponCode});
    if(validateNewCoupon.length!==0) return res.status(403).json({massage: 'Coupon code already exist'})
    next();
}

// add coupon code
adminCouponRouter.post("/", validateRequst, async(req, res) => {
  const data = req.body;
  const couponCode = data.couponCode;
  const couponActiveDate = data.couponActiveDate;
  const couponAmount = data.couponAmount;
  try {
    const newCoupon = await new Coupon({
      couponCode: couponCode,
      couponActiveDate: couponActiveDate,
      couponAmount: couponAmount,
    });
    const responds = await newCoupon.save();
    if (!responds) return res.status(500).json({ massage: "server error" });
    res.status(200).json({ massage: "succcesfully added coupon" });
  } catch (error) {
    console.log(error);
  }
});

//get all coupons code 
adminCouponRouter.get('/g/c', async(req, res)=>{
    try{
      const data= await Coupon.find();
      if(data.length === 0) return res.status(404).json({massage : 'no coupon was found'});
      res.status(200).json({status: 200, data: data })
    }catch(error){
      console.log(error);
    }
})
module.exports = adminCouponRouter;
