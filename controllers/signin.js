const handleSignIn = (req,res,db,bcrypt)=>{

  const {email,name,password} = req.body;

  if(!email || !password){
    return res.status(400).json('incorrect form submission');
  }else{
    validateEmail(email)?null:res.status(400).json('email invalid');
  }

  function validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }



db.select('email','hash').from('login')
.where('email','=',email)
.then(data=>{
  bcrypt.compare(password, data[0].hash, function(err, response) {

      if(response){
          return db.select('*').from('users').where('email','=',email)
          .then(user=>{
            res.json(user[0])
          })
          .catch(err=>res.status(400).json('unable to get user'))
        }else{
          res.status(400).json('wrong credentials');
        }
  });

}).catch(err=>res.status(400).json('wrong credentials'))

}

module.exports = {

  handleSignIn:handleSignIn

}
