const { response } = require('express');
const jwt = require('jsonwebtoken');


module.exports = auth=async(req,res,next)=>{

    const token = req.header('Auth-Token');

    console.log(req.header);


    if(!token) return res.status(401).send('Access Denied');

    try{
        await jwt.verify(token,'secret', (err,token)=>{
                console.log('token',token);
                req.user = token;
                next();
        })
    }catch(err){
        res.status(400).send('Invalid Token');
    }


}

