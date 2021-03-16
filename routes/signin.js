const router = require('express').Router();
const db = require('../db');
const validate = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.post('/', async (req, res) => {

  const { email, password } = req.body;



  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).json(error.details[0].message)
  }

  
  try {    
    const userData = await db.select('login_email', 'login_hash').from('login').where('login_email', '=', email);
      await bcrypt.compare(password, userData[0].login_hash, async (err, response) => {
        if (response) {
          const selectedUser = await db.select()
            .from('login')
            .join('users', 'login.login_id', '=', 'users.login_id')
            .select()
            .where('login_email', '=', email)


          //Create and Assign a Token 
          const token = jwt.sign({'id':selectedUser[0].login_id},'secret',{ expiresIn: '1h' });

          return res.header('auth-token',token).send(token);


        } else {
          return res.status(400).json('Wrong credentials');
        }
      });
  } catch (error) {
    return res.status(400).json('Something went wrong, Please try again later.');
  }

});


module.exports = router;
