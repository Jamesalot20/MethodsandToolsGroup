const Shipping = require('../models/Shipping');

exports.createShipping = async (req, res) => {
  try {
    const { user, fullName, addressLine1, city, state, postalCode, country } = req.body;

    const newShipping = new Shipping({
      user,
      fullName,
      addressLine1,
      city,
      state,
      postalCode,
      country,
    });

    await newShipping.save();
    res.status(201).json({ message: 'Shipping address created successfully.', newShipping });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getShippingByUser = async (req, res) => {
  try {
    const shippingAddresses = await Shipping.find({ user: req.user._id });

    if (!shippingAddresses) {
      res.status(404).json({ message: 'No shipping addresses found for this user.' });
    } else {
      res.status(200).json(shippingAddresses);
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateShipping = async (req, res) => {
  try {
    const { address, city, state, zip } = req.body;
    const shippingId = req.params.shippingId;

    const updatedShipping = await Shipping.findOneAndUpdate(
      { _id: shippingId, user: req.user._id },
      { address, city, state, zip },
      { new: true }
    );

    if (!updatedShipping) {
      res.status(404).json({ message: 'Shipping address not found or not owned by the user.' });
    } else {
      res.status(200).json({ message: 'Shipping address updated successfully.', updatedShipping });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteShipping = async (req, res) => {
  try {
    const shippingId = req.params.shippingId;

    const deletedShipping = await Shipping.findOneAndDelete({ _id: shippingId, user: req.user._id });

    if (!deletedShipping) {
      res.status(404).json({ message: 'Shipping address not found or not owned by the user.' });
    } else {
      res.status(200).json({ message: 'Shipping address deleted successfully.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
