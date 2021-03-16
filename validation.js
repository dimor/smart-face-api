const Joi = require('joi');


//Validation Schema 


const schema = Joi.object({

    password: Joi.string().required(),

    email: Joi.string()
        .email({ minDomainSegments: 2 }).required(),

    name: Joi.string().allow('')
});


const validate = (formData) => {
        return schema.validateAsync(formData);
}


module.exports = validate;