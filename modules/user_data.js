const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Data= new Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    accountName : {
        type: String,
        required: true
    },
    accountNumber : {
        type: String,
        required: true
    },
    bankName : {
        type: String,
        required: true
    },
    orderCount : {
        type: Number,
        required: true
    }
})
const userData= mongoose.model('userData', Data);
module.exports=userData;