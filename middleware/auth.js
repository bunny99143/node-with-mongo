const jwt = require('jsonwebtoken');
const {responseModel} = require('../successError');
const {User} = require('../models/user');

module.exports =async function (req, res, next) {
  const token = req.header('authtoken');
  if (!token) return res.status(401).json(responseModel('1','Access denied. No token provided.',{}));
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    try {
      const user = await User.findById(decoded._id).select('-password');  
      if(user){
        const token = user.generateAuthToken(); 
        req.user = user; 
        req.token = token; 
        next();  
      }else{
        res.status(400).send(responseModel('1','Invalid token.',{}));
      }      
    } catch (error) {
      return res.status(401).json(responseModel('1',error.message,{}));  
    }
  }
  catch (ex) {
    res.status(400).send(responseModel('1','Invalid token.',{}));
  }
}