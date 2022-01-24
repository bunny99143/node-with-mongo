const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  url: {
    type: String,
  } ,
  is_sold: {
    type: Boolean,
    required: true,
    default:false
  },
  addresses: [{
      type: ObjectId,
      ref: 'Address'
  }],
  created_date:{
    type: Date,
    default: Date.now
},
  
});



userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {

    const options = {
        errors: {
          wrap: {
            label: ''
          }
        }
      };

  const schema = Joi.object({ 
        name: Joi.string() .min(6) .required(),
        email: Joi.string() .min(6) .required() .email(),
        password: Joi.string() .min(6) .required() 
    });
    
    return schema.validate(user,options);
}

function validateLoginUser(user) {

    const options = {
        errors: {
          wrap: {
            label: ''
          }
        }
      };

  const schema = Joi.object({ 
        email: Joi.string() .min(6) .required() .email(),
        password: Joi.string() .min(6) .required() 
    });
    
    return schema.validate(user,options);
}


function validateURL(user) {

  const options = {
      errors: {
        wrap: {
          label: ''
        }
      }
    };

const schema = Joi.object({ 
  url: Joi.string().required(),
  record_count: Joi.string().required()
  });
  
  return schema.validate(user,options);
}



exports.User = User; 
exports.validate = validateUser;
exports.validateLoginUser = validateLoginUser;
exports.validateURL = validateURL;