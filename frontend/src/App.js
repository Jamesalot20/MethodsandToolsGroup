import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { CartProvider } from './components/CartContext';
import Cart from './components/Cart';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import Store from './components/Store';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Completion from './components/Completion';
import Logout from './components/logout.component';
import Admin from './components/Admin';

import './main.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
              <Link className="navbar-brand" to={'/sign-in'}></Link>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={'/sign-in'}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/sign-up'}>
                      Sign up
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/Store'}>
                      Store
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/cart'}>
                      Cart
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/Checkout'}>
                      Checkout
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/Orders'}>
                      Order History
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/log-out'}>
                      Logout
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/Admin'}>
                      Admin
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="auth-wrapper">
            <div className="auth-inner">
              <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/sign-in" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/store" element={<Store />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/Checkout" element={<Checkout />} />
                <Route path="/Orders" element={<Orders />} />
                <Route path="/Completion" element={<Completion />} />
                <Route path="/log-out" element={<Logout />} />
                <Route path="/Admin" element={<Admin />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
