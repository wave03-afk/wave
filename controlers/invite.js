const express= require('express');
const inviteRouter= express.Router();

//get invite view
inviteRouter.get('/', (req, res)=>{
    res.render('../views/invite');
})


module.exports= inviteRouter;