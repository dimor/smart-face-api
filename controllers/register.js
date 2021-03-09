const handleRegister = (req, res, db, bcrypt) => {

  const { email, name, password } = req.body;


  console.log(req.body);


  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  } else {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      return res.status(400).json('Enter valid email')
    } else {


      bcrypt.hash(password, 10, function (err, hash) {

        db.transaction(trx => {

          return trx.insert({
            login_hash: hash,
            login_email: email,
          },['login_id']).into('login')
            .then((id) => {
              return trx.insert({
                user_name: name,
                user_joined: new Date(),
                user_faces:0,
                user_used:0,
                login_id:id
              }).into('users')
            })
        })
          .then(response => res.json(response))
          .catch(error =>res.status(400).json(error))
      })
    };
  }
}










module.exports = {

  handleRegister: handleRegister

};