const { Address, validateAddress } = require('../models/address');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const { responseModel } = require('../successError');
const auth = require('../middleware/auth');



router.get('/', auth, async (req, res) => {

  var addresses = await Address.findOne({
    user_id: req.user._id
  }).select('-user_id');

  if (!addresses) return res.status(200).json(responseModel('1', "Addresses not found!", {}));
  res.send(responseModel('1', 'Addresses fetch successfully', addresses));

});


router.post('/add_edit_address', auth, async (req, res) => {
  const { error } = validateAddress(req.body);
  if (error) return res.status(400).json(responseModel('1', error.details[0].message, {}));

  let form_arr = {
    user_id: req.user._id,
    no: req.body.no,
    street: req.body.street,
    address_2: req.body.address_2,
    city: req.body.city,
    pin_code: req.body.pin_code,
  }

  if (req.body.address_id) {
    try {
      let address = await Address.findByIdAndUpdate(req.body.address_id, form_arr, {
        new: true
      });

      res.send(responseModel('1', 'Address updated successfully.', address));
    } catch (error) {
      if (error) return res.status(500).json(responseModel('1', error.message, {}));
    }

  } else {

    let address = new Address(form_arr);
    try {
      await address.save();

      const addressID = address.getAddressId();

      await User.findByIdAndUpdate(req.user._id,
        { $push: { "addresses": addressID } },
        {
          new: true
        });

    } catch (error) {
      if (error) return res.status(500).json(responseModel('1', error.message, {}));
    }

    res.send(responseModel('1', 'Address added successfully.', address));

  }

});

router.delete('/:id', auth, async (req, res) => {
  const address = await Address.findByIdAndRemove(req.params.id);

  if (!address) return res.status(404).json(responseModel('1', 'Address with the given ID was not found.', {}));

  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { "addresses": req.params.id } }, {
      new: true
    });
  } catch (error) {
    if (error) return res.status(500).json(responseModel('1', error.message, {}));
  }


  res.send(responseModel('1', 'Address delete successfully.',));
});



module.exports = router; 
