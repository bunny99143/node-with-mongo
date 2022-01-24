const Joi = require('joi');
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  no: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  address_2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  pin_code: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },

});


addressSchema.methods.getAddressId = function() { 
  return this._id;
}

const Address = mongoose.model('Address', addressSchema);


function validateAddress(address) {

  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };

  const schema = Joi.object({
    no: Joi.string().required(),
    street: Joi.string().required(),
    address_2: Joi.string(),
    address_id: Joi.string().allow(null).allow(''),
    city: Joi.string().required(),
    pin_code: Joi.string().required(),

  });

  return schema.validate(address, options);
}

exports.Address = Address;
exports.validateAddress = validateAddress;