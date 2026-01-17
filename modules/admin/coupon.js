const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const CouponSchema= new Schema({
    couponCode:{
        type: String,
        required: true
    },
    couponActiveDate:{
        type: String,
        required: true
    },
    couponAmount:{
        type: String,
        required: true
    }
})
const Coupon= mongoose.model('coupon', CouponSchema);
module.exports=Coupon;