import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { sendRequest, showAlert } from '../functions';
import storage from '../storage/storage';
import logoPensi from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isSubming, setSubming] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubming(true);

    try {
      const response = await sendRequest('POST', { email: email, password: password }, '/api/login/user', '', false);
      if (response.status===200) {
        storage.set('authToken', response.data.token);
        storage.set('authUser', response.data.user);

        setSubming(false);
        
        navigate('/admin/inmuebles');
      }
      setSubming(false);
    } catch (err) {
      showAlert('Error: ' + err.message, 'error');
      setSubming(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary">

      <div className="w-full shadow-2xl max-w-xs bg-secondary p-5 rounded-xl">
        <div className="flex justify-center mb-9">
          <img src={logoPensi} alt="Logo Pensi" />
        </div>
        <form className="space-y-6 " onSubmit={handleSubmit}>
          <div>
            
            <input
              type="email"
              id="email"
              value={email}
              placeholder='Correo electrónico'
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
  
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Contraseña'
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
         
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubming}
              className="w-full bg-primary hover:bg-acent text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
