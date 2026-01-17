const express= require('express');
const teamRouter= express.Router();

//get team view

teamRouter.get('/', (req, res)=>{
    res.render('../views/team');
})

module.exports= teamRouter;