const Joi = require('joi');


  //Validation Schema 


  const schema = Joi.object({

    password: Joi.string().required(),

    email: Joi.string()
      .email({ minDomainSegments: 2 }).required(),

    name: Joi.string().required()
  });


  const valitate = async (formData)=>{

      return await schema.validateAsync(formData);

  }


  module.exports.validate = validate;