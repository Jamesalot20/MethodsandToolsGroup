const Payment = require('../models/Payment');

async function createPayment(paymentData) {
  try {
    const newPayment = new Payment(paymentData);
    await newPayment.save();

    return newPayment;
  } catch (error) {
    console.error('Error creating payment information.', error);
    return null;
  }
}

module.exports = {
  createPayment,
};
