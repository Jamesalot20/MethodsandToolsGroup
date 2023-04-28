const supertest = require('supertest');
const chai = require('chai');
const app = require('../server/server'); // Import your server or app instance
const request = supertest(app);
const { expect } = chai;

describe('Auth Tests', () => {
  let buyerToken, sellerToken, adminToken;

  it('Buyer login', async () => {
    const response = await request.post('/api/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).to.equal(200);
    expect(response.body.token).to.exist;
    buyerToken = response.body.token;
  });

  it('Seller login', async () => {
    const response = await request.post('/api/users/login').send({
      email: 'sellertest@example.com',
      password: 'password123',
    });

    expect(response.status).to.equal(200);
    expect(response.body.token).to.exist;
    sellerToken = response.body.token;
  });

  it('Admin login', async () => {
    const response = await request.post('/api/users/login').send({
      email: 'jf1812@msstate.edu',
      password: 'Qwerre123',
    });

    expect(response.status).to.equal(200);
    expect(response.body.token).to.exist;
    adminToken = response.body.token;
  });

  // Write test cases for different user roles performing actions

  it('Buyer logout', async () => {
    const response = await request.post('/api/users/logout').set('Authorization', `Bearer ${buyerToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Logout successful.');
  });

  it('Seller logout', async () => {
    const response = await request.post('/api/users/logout').set('Authorization', `Bearer ${sellerToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Logout successful.');
  });

  it('Admin logout', async () => {
    const response = await request.post('/api/users/logout').set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Logout successful.');
  });
});
