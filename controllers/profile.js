const handleProfile =(req,res,db)=>{

  const id = req.params.id;

  db.select('*').from('users').where({id}).then(user=>{
    user.length?res.json(user[0]):res.json('user not found')})
    .catch(err=> res.status(400).json('error getting user'));
  };

  module.exports = {
    handleProfile
  }
