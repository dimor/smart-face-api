const router = require('express').Router();
const db = require('../db');
const validate = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const profile = require('./profile');


router.post('/', async (req, res) => {

  const { email, password } = req.body;



  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).json(error.details[0].message)
  }


  try {
    // compare hashes
    const userData = await db.select('login_email', 'login_hash').from('login').where('login_email', '=', email);
    const match = await bcrypt.compare(password, userData[0].login_hash);

    if (match) {
      //if user credencials right - select user
      const selectedUser = await db.select()
        .from('login')
        .join('users', 'login.login_id', '=', 'users.login_id')
        .select()
        .where('login_email', '=', email)

      const id = selectedUser[0].login_id;

      //Get user stats 
      const [{ user_faces, user_used }] = await profile.getProfileStats(id);
      const [{ rank }] = await profile.getProfileRank(id);

      const user = {
        user_faces,
        user_used,
        rank
      }

      //Create and Assign a Token 
      jwt.sign({ 'id': id }, 'secret', { expiresIn: '1h' }, async (err, token) => {
        // if(err) return res.status(400).json('Something went wrong, Please try again later.');
        console.log(token);
        return res.header('auth-token', token).json({user});
      });

  } else {
    return res.status(400).json('Wrong credentials');
  }

} catch (error) {
  return res.status(400).json('Something went wrong, Please try again later.');
}

});


module.exports = router;
