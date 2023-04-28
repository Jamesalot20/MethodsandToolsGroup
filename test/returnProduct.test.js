/*
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');

chai.use(chaiHttp);
chai.should();

describe('Orders', () => {
  let orderId;

  // Create a new order for testing
  before(async () => {
    const order = {
      buyer: '64384ac5734ffb9222e8a989',
      items: [{
        product: '64387bd7c54a9c45b738eba3',
        quantity: 2,
        price: 599.98,
      }],
      totalPrice: 599.98,
      status: 'processing',
    };
    const res = await chai.request(app).post('/api/orders').send(order);
    orderId = res.body._id;
  });

  // Test the updateOrder method
  describe('PUT /api/orders/:orderId', () => {
    it('should allow the user to return a product they ordered', async () => {
      const updatedOrder = {
        items: [{
          product: '64387bd7c54a9c45b738eba3',
          quantity: 0,
          price: 0,
        }],
        totalPrice: 0,
        status: 'cancelled',
      };
      const res = await chai.request(app).put(`/api/orders/${orderId}`).send(updatedOrder);
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').equal('cancelled');
      res.body.items[0].should.have.property('quantity').equal(0);
      res.body.items[0].should.have.property('price').equal(0);
    });
  });

  // Delete the test order after testing is complete
  after(async () => {
    await chai.request(app).delete(`/api/orders/${orderId}`);
  });
});
*/
