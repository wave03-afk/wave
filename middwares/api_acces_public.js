
//authorization middware public
const authorise=(req, res, next)=>{
if(!req.headers.authorization)return res.status(403).json({message: 'authorization token required'})
const reqToken=req.headers.authorization.split(' ')[1];
const accessToken=[process.env.PUBLIC_ACCESS_TOKEN, reqToken];
if(accessToken[0]!==accessToken[1]) return res.status(403).json({message: 'not authorised'})
next()
};
module.exports=authorise;
