import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../../hook/services/apiService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar errores previos

    try {
      // Llamar al servicio de autenticación
      const credentials = { username, password };
      const data = await loginUser(credentials);

      // Guardar datos en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('roles', JSON.stringify(data.roles));

      // Redirigir según rol
      navigate('/client');
    } catch (error) {
      // Manejo de errores
      setErrorMessage(error.detail || 'Credenciales inválidas. Intente de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className='flex min-w-full justify-center mb-2'>
        <img src='/logo_medileser.png' alt='Logo_Medileser' style={{height:'8rem'}}/>
        </div>
        <p className="text-gray-500 text-center mb-8">
          Bienvenido, ingrese sus credenciales
        </p>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">Error al autenticarse</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue"
              placeholder="Ingrese su usuario"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue"
              placeholder="Ingrese su contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-custom-blue text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
