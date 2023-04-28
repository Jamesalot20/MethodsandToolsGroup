
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/server');
const should = chai.should();

chai.use(chaiHttp);

// Move sellerToken declaration to the outer scope
let sellerToken;


describe('Product Tests', () => {
  before(async () => {
    // Login as a seller to obtain the authorization token
    const sellerCredentials = {
      email: 'deleteproduct@example.com',
      password: 'password123'
    };

    const res = await chai.request(server)
      .post('/api/users/login')
      .send(sellerCredentials);

    sellerToken = res.body.token;
  });

  describe('Delete Product', () => {
    let productId;

    before(async () => {
      // Create a new product
      const newProduct = {
        name: 'Test Product',
        description: 'Test Product Description',
        price: 10,
        category: 'Test Category',
        seller: '643c8ea417aa25bf8350452b', // Replace this with an actual seller ID
      };

      const createRes = await chai.request(server)
        .post('/api/products/createProduct')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(newProduct);

      productId = createRes.body._id;
    });

    it('should delete a product by a seller', (done) => {
      chai.request(server)
        .delete(`/api/users/${productId}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product successfully deleted.');
          done();
        });
    });
  });
});

describe('Cart Tests', () => {
  let buyerToken;
  let productId;

  before(async () => {
    // Login as a buyer to obtain the authorization token
    const buyerCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginRes = await chai.request(server)
      .post('/api/users/login')
      .send(buyerCredentials);

    buyerToken = loginRes.body.token;

    // Create a new product
    const newProduct = {
      name: 'Test Product',
      description: 'Test Product Description',
      price: 10,
      category: 'Test Category',
      seller: '643c8ea417aa25bf8350452b', // Replace this with an actual seller ID
    };

    const createRes = await chai.request(server)
      .post('/api/users/createProduct')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(newProduct);

    productId = createRes.body._id;
  });

  describe('Add Product to Cart', () => {
    it('should add a product to the buyer\'s cart', (done) => {
      const addProductToCart = {
        productId: productId,
        quantity: 1
      };

      chai.request(server)
        .post('/api/carts/add')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(addProductToCart)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product added to cart successfully.');
          done();
        });
    });
  });
});

