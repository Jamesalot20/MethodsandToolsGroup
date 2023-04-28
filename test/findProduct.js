const chai = require('chai');
const chaiHttp = require('chai-http');
const Product = require('../server/models/Product');
const { expect } = chai;
const app = require('../server/server');
const mongoose = require('mongoose');
chai.use(chaiHttp);

describe('Product API', () => {
  let testProductId;
  let testProduct;
  before((done) => {
    // Create a test product
    testProduct = new Product({
      name: 'Test Product',
      description: 'Test Product Description',
      price: 99.99,
      category: 'TestCategory',
      seller: new mongoose.Types.ObjectId(),
    });
    testProduct.save()
      .then((savedProduct) => {
        testProductId = savedProduct._id;
        done();
      });
  });

  describe('GET api/products/:productId', () => {
    it('should get a product by ID', (done) => {
      chai
        .request(app)
        .get('/api/products/' + testProductId)
        .end((err, res) => {
          if (err || res.status !== 200) {
            console.error(res.body);
          }
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', 'Test Product');
          expect(res.body).to.have.property('description', 'Test Product Description');
          expect(res.body).to.have.property('price', 99.99);
          expect(res.body).to.have.property('seller', testProduct.seller.toString());
          done();
        });
    });
    it('should return a 404 error when the product is not found', (done) => {
      chai
        .request(app)
        .get('/products/nonexistent-product-id')
        .end((err, res) => {
          if (err || res.status !== 404) {
            console.error(res.body);
          }
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.be.empty;
          done();
        });
    });
  });
});
