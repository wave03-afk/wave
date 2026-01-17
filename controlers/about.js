const express= require('express');
const aboutRouter= express.Router();

//about wave
aboutRouter.get('/company', (req, res)=>{
    res.render('../views/about');
});
// FQA
aboutRouter.get('/fqa', (req, res)=>{
    res.render('../views/fqa');
});
// how to invest
aboutRouter.get('/how/invest', (req, res)=>{
    res.render('../views/invest_how');
});
//terms of use
aboutRouter.get('/terms' ,(req, res)=>{
    res.render('../views/term_use');
});


module.exports= aboutRouter;