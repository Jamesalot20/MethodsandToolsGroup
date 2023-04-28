const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');

chai.use(chaiHttp);

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', (done) => {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.be.an('array');
          chai.expect(res.body[0]).to.have.property('name');
          chai.expect(res.body[0]).to.have.property('price');
          // Add more expectations for other properties of a product object
          done();
        });
    });
  });
});
