import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';  

const Header = ({ handleLogout, setLoggedInUser, loggedInUser }) => {
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoginUser(JSON.parse(storedUser)); // Parse the stored user if it's a JSON string
    }
  }, [handleLogout, setLoggedInUser]);

  const user =  loggedInUser; // Use local state if no prop is passed

  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <nav>
        {user ? (
          <div>
            <p>{`Welcome, ${loginUser?.firstName} ${loginUser?.lastName}`}</p>
            <p className="logout" onClick={() => handleLogout()}>Logout</p>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link> | <Link to="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
