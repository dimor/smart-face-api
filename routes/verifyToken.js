const jwt = require('jsonwebtoken');


module.exports = auth=async(req,res,next)=>{

    const token = req.header('auth-token');

    if(!token) return res.status(401).send('Access Denied');

    try{
        await jwt.verify(token,'secret', (err,token)=>{
                console.log(token);
                next();
        })
    }catch(err){
        res.status(400).send('Invalid Token');
    }


}

