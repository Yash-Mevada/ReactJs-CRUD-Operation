import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Pages/Signup.js';
import Login from './Pages/Login.js';
import Dashboard from './Pages/Dashboard.js';
import UserForm from './Pages/UserForm.js';
import PostList from './Pages/PostList.js';
import Header from './Pages/Header.js';
import Footer from './Pages/Footer.js';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }); 

  return (
    <Router>
      <Header handleLogout={handleLogout} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
        {loggedInUser ? (
          <>
            <Route path="/dashboard" element={<Dashboard handleLogout={handleLogout} />} />
            <Route path="/add-user" element={<UserForm />} />
            <Route path="/edit-user/:id" element={<UserForm />} />
            <Route path="/posts/:userId" element={<PostList />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" handleLogout={handleLogout}/>} />
        )}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
