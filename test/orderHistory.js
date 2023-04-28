const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');

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

  it('should return a buyer\'s order history', async () => {
    const res = await chai.request(app)
      .get('/api/orders/history')
      .set('Authorization', `Bearer ${token}`);

    res.should.have.status(200);
    res.body.should.be.an('array');
  });
});
