import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      role: 'buyer', //default role to buyer
      successMessage: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    console.log(email, password);
    fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        email,
        password,
        role: this.state.role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'userRegister');
        this.setState({ successMessage: 'Registration successful! You can now sign in.' });
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>

        {this.state.successMessage && (
          <div className="alert alert-success" role="alert">
            {this.state.successMessage}
          </div>
        )}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Account Role</label>
          <select className="form-select" onChange={(e) => this.setState({ role: e.target.value })}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>
      </form>
    );
  }
}
