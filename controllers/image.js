const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'f049e39d52684c93829212ded26b1ca0'
});

const handleApiCall = (req, res, db) => {



  const clarifaiResponse= null;
  let facesAnalyzed = null;
  const dataExist = null;

  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
    .then(response => {
      clarifaiResponse = response;
      dataExist = response.data.outputs[0].data;
      if (dataExist) {
        facesAnalyzed = dataExist.regions.length;
      } else {
        facesAnalyzed = 0;
      }



    })




    .catch(err => res.status(400).json('unable to work with API'));

}


const handleImage = (req, res, db) => {

  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
};

module.exports = {

  handleImage,
  handleApiCall
}
