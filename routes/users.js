const { User, validate, validateLoginUser, validateURL } = require('../models/user');
const express = require('express');
const router = express.Router();
const { responseModel } = require('../successError');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).json(responseModel('1', error.details[0].message, {}));

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(responseModel('1', 'User already registered.', {}));

  user = new User(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
  } catch (error) {
    if (error) return res.status(500).json(responseModel('1', error.message, {}));
  }

  const token = user.generateAuthToken();
  res.header('authtoken', token).send(responseModel('1', 'User successfully registered.', user));

});


router.post('/login', async (req, res) => {

  const { error } = validateLoginUser(req.body);
  if (error) return res.status(400).json(responseModel('1', error.details[0].message, {}));

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(responseModel('1', 'User not found.', {}));

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send(responseModel('1', 'Invalid email or password.', {}));

  const token = user.generateAuthToken();
  res.header('authtoken', token).send(responseModel('1', 'Login successfully.', user));

});


router.get('/getUserDetail', auth, async (req, res) => {

  const token = req.token;
  const user = await User.findById(req.user._id).select('-addresses -password');
  res.header('authtoken', token).send(responseModel('1', 'User details fetch successfully', user));

});

router.post('/createUsers/:count', async (req, res) => {  

  for (var i = 1; i <= req.params.count; i++) {
    let userData = {
      'name': `test${i}`,
      'email': `test${i}@gmail.com`,
      'password':'123456',
    };

    let user = new User(userData);
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();
    } catch (error) {
      if (error) return res.status(500).json(responseModel('1', error.message, {}));
    }

  }

  res.send(responseModel('1', 'All users created successfully'));
});


router.post('/createUsers', async (req, res) => {

  const { error } = validateURL(req.body);
  if (error) return res.status(400).json(responseModel('1', error.details[0].message, {}));
  let salt = "";

  for (var i = 1; i <= req.body.record_count; i++) {

    let userData = {
      'name': `test.email${i}`,
      'email': `1test.email${i}@gmail.com`,
      'password':'123456',
      'url': `${req.body.url}/${i}.json`,
    };

    let user = new User(userData);
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();
    } catch (error) {
      if (error) return res.status(500).json(responseModel('1', error.message, {}));
    }
  }
  res.send(responseModel('1', 'All users created successfully'));
});



router.get('/sold/:count', async (req, res) => {

  try {
    const users = await User.find({ is_sold: true })
      .sort({ "created_date": 1 })
      .limit(parseInt(req.params.count));

    if (!users) return res.status(400).json(responseModel('1', "User not found", {}));

    users.map(async function (user) {
      var user = await User.updateOne(
        { _id: user._id },
        { $set: { "is_sold": false } }, {
        new: true
      });
    })
    return res.status(400).json(responseModel('1', "All users sold successfully", users))

  } catch (error) {

    if (error) return res.status(500).json(responseModel('0', error.message, {}));
  }

});



//address add

router.get('/getUserDetailWithAddress', auth, async (req, res) => {

  const token = req.token;
  const user = await User.findById(req.user._id).populate('addresses').select('-password');
  res.header('authtoken', token).send(responseModel('1', 'User details fetch successfully', user));

});


module.exports = router; 
