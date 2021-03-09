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
      console.log(response);
      clarifaiResponse = response;
      dataExist = response.data.outputs[0].data;
      console.log(dataExist);
      if (dataExist) {
        facesAnalyzed = dataExist.regions.length;
      } else {
        facesAnalyzed = 0;
      }
    }).then(()=>{
       return db.from('users').where('id', '=', 10)
      .increment({
        user_used:1,
        user_faces:facesAnalyzed
      })
      .returning(['user_faces','user_used'])
      .then(result => {
        console.log(result,clarifaiResponse);
        res.json({result,clarifaiResponse});
      })
      .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
}


module.exports = {
  handleApiCall
}
