const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'f049e39d52684c93829212ded26b1ca0'
});

const handleApiCall = (req, res, db) => {

  let clarifaiResponse= null;
  let facesAnalyzed = null;
  let dataExist = null;

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


module.exports = {
  handleApiCall
}
