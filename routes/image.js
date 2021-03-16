const router = require('express').Router();
const Clarifai = require('clarifai');
const db = require('../db');
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
});

const verify = require('../routes/verifyToken')


router.post('/',verify,async (req, res) => {

  console.log(req.user);

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
    const userStats = await db.from('users').where('login_id', '=', 10)
      .increment({
        user_used: 1,
        user_faces: facesAnalyzed
      })
      .returning(['user_faces', 'user_used'])

    stats = userStats;

    // get rank of spesific id
    const userRank = await db.select('rank')
      .from(db.select(db.raw('*,rank() over(order by user_faces desc) as rank from users')).as('temp'))
      .where({ login_id: '10' })
      .returning()

    rank = userRank;

    //reponse data back to user
    return res.json({ 'rank': rank, 'stats': stats, 'clarifai': clarifaiResponse })

  } catch (error) {
    return res.status(400).json(error);
  }

})

module.exports = router;



