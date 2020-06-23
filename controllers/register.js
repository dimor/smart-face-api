const handleRegister = (req,res,db,bcrypt)=>{

  const {email,name,password} = req.body;

  if(!email || !name || !password){
    return res.status(400).json('incorrect form submission');
  }else{

    validateEmail(email)?null:res.status(400).json('invalid email');
    
  }


  const validateEmail=(email)=> {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  bcrypt.hash(password, null, null, function(err, hash) {

  db.transaction(trx=>{

    trx.insert({
      hash:hash,
      email:email,
    })
    .into('login')
    .returning('email')
    .then(loginEmail=>{
        return db('users')
          .returning('*')
          .insert({
            email:loginEmail[0],
            name:name,
            joined:new Date()
          })
          .then(response=>{
            res.json(response[0]);
          })
          .catch(err=>res.status(400).json('Something went wrong'))
      })
    .then(trx.commit)
    .catch(trx.rollback);
    })
  })
};


module.exports ={

  handleRegister:handleRegister

};
