const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title is required'
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Description is required'
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Location is required'
    }),
    country: Joi.string().required().messages({
      'string.empty': 'Country is required'
    }),
    price: Joi.number().required().min(0).messages({
      'number.base': 'Price must be a number',
      'any.required': 'Price is required',
      'number.min': 'Price cannot be negative'
    }),

    // ✅ This part accepts BOTH string (create) and object (edit)
    image: Joi.alternatives().try(
      Joi.string().uri().allow('', null),
      Joi.object({
        url: Joi.string().uri().allow('', null),
        filename: Joi.string().allow('', null)
      })
    ).default('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop')

  }).required()
});

module.exports = { listingSchema };



module.exports.reviewSchema=Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
  }).required()
})