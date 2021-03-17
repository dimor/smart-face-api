const router = require('express').Router();
const Clarifai = require('clarifai');
const db = require('../db');
const app = new Clarifai.App({
  apiKey: 'f049e39d52684c93829212ded26b1ca0'
});

const verify = require('../routes/verifyToken')
const profile = require('./profile');

router.post('/',verify,async (req, res) => {

  console.log(req.user);


  const id = req.user;
  let clarifaiResponse = null;
  let facesAnalyzed = null;
  let dataExist = null;
  let stats = null;
  let rank = null;


  try {
    const response = await app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input);

    clarifaiResponse = response;

    dataExist = clarifaiResponse.outputs[0];

    if (Object.keys(dataExist.data).length === 0) {
      facesAnalyzed = 0;
    } else {
      facesAnalyzed = dataExist.data.regions.length;
    }

    // increment user stats and return the result
    const [{ user_faces, user_used }] = await db.from('users').where('login_id', '=', id)
      .increment({
        user_used: 1,
        user_faces: facesAnalyzed
      })
      .returning(['user_faces', 'user_used'])

    // get rank of spesific id
    const [{rank}] = await profile.getProfileRank(id);

    //reponse data back to user
    return res.json({ 'user':{user_faces,user_used,rank}, 'clarifai': clarifaiResponse })

  } catch (error) {
    return res.status(400).json(error);
  }

})

module.exports = router;



