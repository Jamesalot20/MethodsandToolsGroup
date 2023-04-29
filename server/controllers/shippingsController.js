const Shipping = require('../models/Shipping');

exports.createShipping = async (user, shippingData) => {
  try {
    const { fullName, addressLine1, city, state, postalCode, country } = shippingData;

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
    return newShipping;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getShippingByUser = async (user) => {
  try {
    const shippingAddresses = await Shipping.find({ user: user._id });

    if (!shippingAddresses) {
      return null;
    } else {
      return shippingAddresses;
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateShipping = async (user, shippingId, shippingData) => {
  try {
    const { address, city, state, zip } = shippingData;

    const updatedShipping = await Shipping.findOneAndUpdate(
      { _id: shippingId, user: user._id },
      { address, city, state, zip },
      { new: true }
    );

    if (!updatedShipping) {
      return null;
    } else {
      return updatedShipping;
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteShipping = async (user, shippingId) => {
  try {
    const deletedShipping = await Shipping.findOneAndDelete({ _id: shippingId, user: user._id });

    if (!deletedShipping) {
      return null;
    } else {
      return deletedShipping;
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};
