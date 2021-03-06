const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const validate = require('../validation');


router.post('/', async (req, res) => {

  const { email, name, password } = req.body;

  
  //Credantials Validation
  try {
     await validate(req.body);
  } catch (error) {
    return res.status(400).json(error.details[0].message)
  }



  //Hash Passwords 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  //Insert Values to db
  try {
    await db.transaction(async trx => {
      const [{login_id}] = await trx.insert({
        login_hash: hashedPassword,
        login_email: email,
      }, ['login_id']).into('login')

     await trx.insert({
        user_name: name,
        user_joined: new Date(),
        user_faces: 0,
        user_used: 0,
        ['login_id']: login_id
      }).into('users')

     return res.status(200).json('You have successfully registered.');
    });
  } catch (error) {
    res.status(400).json(error);
  }
})


module.exports = router;