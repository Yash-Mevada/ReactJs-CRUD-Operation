import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', gender: 'male' });

  useEffect(() => {
    if (id) {
      axios.get(`https://gorest.co.in/public/v2/users/${id}`, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` }
      })
      .then((response) => setFormData(response.data))
      .catch((error) => console.error(error));
    }
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axios.patch(`https://gorest.co.in/public/v2/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` }
      })
      .then(() => navigate('/dashboard'))
      .catch((error) => console.error(error));
    } else {
      axios.post('https://gorest.co.in/public/v2/users', formData, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` }
      })
      .then(() => navigate('/dashboard'))
      .catch((error) => console.error(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
      <select name="gender" value={formData.gender} onChange={handleInputChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button type="submit">{id ? 'Update' : 'Create'} User</button>
    </form>
  );
};

export default UserForm;
