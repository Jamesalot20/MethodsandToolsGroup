import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('authToken');

    // Redirect to the Login page
    navigate('/sign-in');
  };

  return (
    <div>
      <h3>Logout</h3>
      <p>Are you sure you want to logout?</p>
      <button type="button" className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
