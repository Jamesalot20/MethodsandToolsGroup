const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);

chai.use(chaiHttp);
chai.should();

describe('Order history API', () => {
  let token;

  before(async () => {
    // Log in as a buyer to obtain an access token
    const res = await chai.request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    token = res.body.token;
  });

  describe('Create order', () => {
    it('should create a new order', async () => {
      const order = {
        "buyer": "64384ac5734ffb9222e8a989",
        "items": [
          {
            "product": "64387bd7c54a9c45b738eba3",
            "quantity": 2,
            "price": 599.98
          },
          {
            "product": "6438d521ea7f3e39c5ec31b9",
            "quantity": 1,
            "price": 9.99
          }
        ],
        "totalPrice": 27.97,
        "status": "pending",
        "createdAt": "2022-04-13T10:00:00.000Z",
        "updatedAt": "2022-04-13T10:00:00.000Z"
      };
      
      const res = await chai.request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      
      res.should.have.status(201);
  res.body.should.be.a('object');
  res.body.should.have.property('buyer').eql(order.buyer);
  res.body.should.have.property('items').excluding('_id').deep.equal(order.items);
  res.body.should.have.property('totalPrice').eql(order.totalPrice);
  res.body.should.have.property('status').eql(order.status);
  res.body.should.have.property('createdAt');
  res.body.should.have.property('updatedAt');
    });
  });
});

