const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'f049e39d52684c93829212ded26b1ca0'
});

const handleApiCall = (req, res, db) => {

  let clarifaiResponse = null;
  let facesAnalyzed = null;
  let dataExist = null;
  let stats = null;
  let userRank = null;


  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
    .then(response => {
   
      clarifaiResponse = response;

      dataExist = clarifaiResponse.outputs[0];

      if(Object.keys(dataExist.data).length === 0) {
        facesAnalyzed = 0;
      } else {
        facesAnalyzed = dataExist.data.regions.length;
      }
    })
    .then(()=>{
       return db.from('users').where('login_id', '=', 10)
      .increment({
        user_used:1,
        user_faces:facesAnalyzed
      })
      .returning(['user_faces','user_used'])
      .then(stats => {
        res.json({'stats': stats , 'clarifai':clarifaiResponse});
      })
      .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
}



    // .then(() => {  // get rank of spesific id
    //   return db.select('rank')
    //     .from(db.select(db.raw('*,rank() over(order by user_faces desc) as rank from users')).as('temp'))
    //     .where({ login_id: '6' })
    //     .returning()
    //     .then(userRank => {
    //       rank = userRank
    //     })
    // })
    // .then(()=>{ // return as response  the stats and the clarifai response to user
    //   return res.json({ 'stats': stats, 'clarifai': clarifaiResponse, 'rank': rank });
    // })
    // .catch (err => {
    //   console.error(err);
    //   res.status(400).json(err)
    // });
}


module.exports = {
  handleApiCall
}
