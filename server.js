require('dotenv').config();
const express=require('express');
const app=express();
app.use(express.json());
//vies engine
app.set('view engine', 'ejs');
const path=require('path');
//static files
app.use(express.static('public'));
//mongose
const { default: mongoose } = require('mongoose');
//body paser
const bodyPaser=require('body-parser');
app.use(bodyPaser.urlencoded({ extended: false}));
//connect to a database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("connected to a data base");
    app.listen(5000);
  })
  .catch((error) => {
    console.log("error:" + error);
  });
//middwares
const authorization=require('./middwares/api_acces_public');
const privateAuthorise=require('./middwares/api_acces_private');
//all routers
//home
const homeRouter=require('./controlers/home');
//products
const productsRouter=require('./controlers/poducts');
//user
const userRouter=require('./controlers/user');
//transactions
const transactionRouter=require('./controlers/transactions');
//withdrawal
const withdrawRouter=require('./controlers/withdraw');
//wallet
const walletRouter= require('./controlers/wallet');
//recharge
const rechargeRouter=require('./controlers/recharge');
//team
const teamRouter= require('./controlers/team');
//login
const loginRouter=require('./controlers/login');
//register
const registerRouter=require('./controlers/register');
//payment
const paymentRouter = require('./payments&withdraw/payment_api');
//withdrawal
const withdrawalRouter=require('./payments&withdraw/withdraw_api');
//coupon
const couponRouter= require('./controlers/coupon');
//invite
const inviteRouter = require('./controlers/invite');
//about
const aboutRouter= require('./controlers/about');
//admin routers
// payment validation
const paymentValidation=require('./controlers/validate_payment');
// withdraw validation
const withdrawValidation=require('./controlers/validate_withdrawal');
//daily return
const dailyReturnRouter=require('./dailyReturn/dailyReturn');
//admin user 
const adminUsersRouter=require('./controlers/admin_users');
//admin coupon
const adminCouponRouter=require('./controlers/admin_coupon');


//login & signup
app.use('/', loginRouter);
//register
app.use('/register', registerRouter);
//home 
app.use('/home', homeRouter);
//products 
app.use('/products',  productsRouter);
//user
app.use('/user',  userRouter);
//transaction
app.use('/transaction',  transactionRouter);
//team
app.use('/team', teamRouter);
//invite
app.use('/invite', inviteRouter)
//withdrawal
app.use('/withdraw',  withdrawRouter);
//recharge 
app.use('/recharge',  rechargeRouter);
//wallet
app.use('/wallet', walletRouter);
//about
app.use('/about', aboutRouter);
//payment 
app.use('/payment', authorization, paymentRouter);
//withdrawal 
app.use('/withdrawal', authorization, withdrawalRouter);
// coupon
app.use('/coupon/validate', authorization, couponRouter);
//admin payment validation
app.use('/admin/p', privateAuthorise, paymentValidation);
//admin withdrawal validation
app.use('/admin/w', privateAuthorise, withdrawValidation);
//admin coupon
app.use('/admin/cupn/up', privateAuthorise, adminCouponRouter);
//daily return 
app.use('/pnl', dailyReturnRouter);
//admin user
app.use('/admin/user', privateAuthorise, adminUsersRouter);
//root 
//keep awake
app.get('/keep/awake', (req, res)=>{
    res.status(200).json({massage: 'server up and running'});
})



