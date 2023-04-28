const User = require('../server/models/User');
const bcrypt = require('bcrypt');
const request = require('supertest');
const chai = require('chai');
const app = require('../server/server');
const server = require('../server/server');
const { expect } = chai;

describe('Admin banning a user', () => {
  let adminToken;
  let userEmail;

  before(async () => {
  // Create an admin user and get its token
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('AdminPassword123', salt);
  
  const adminUser = new User({
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

    const savedAdminUser = await adminUser.save();

    const response = await request(app)
      .post('/api/users/login') // Updated the login endpoint
      .send({
        email: 'admin@example.com',
        password: 'AdminPassword123',
      });
    adminToken = response.body.token;

    // Create a user to be banned
    const userToBeBanned = new User({
      email: 'user@example.com',
      password: 'UserPassword123',
      role: 'buyer',
    });

    const savedUserToBeBanned = await userToBeBanned.save();
    userEmail = savedUserToBeBanned.email;
  });

  after(async () => {
    // Clean up the test users
    await User.deleteOne({ email: 'admin@example.com' });
    await User.deleteOne({ email: 'user@example.com' });
  });

  it('Admin can ban a user', async () => {
    const deleteUserResponse = await request(app)
      .delete(`/api/users/deleteUser/${userEmail}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteUserResponse.status).to.equal(200);
    expect(deleteUserResponse.body.message).to.equal('User account deleted successfully.');

    const deletedUser = await User.findOne({ email: userEmail });
    expect(deletedUser).to.be.null;
  });
});
