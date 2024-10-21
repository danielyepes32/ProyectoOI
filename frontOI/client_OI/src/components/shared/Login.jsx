import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "../../hook/useForm"

function Login() {
    const [username, setUsername] = useState('');
    const [contra, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    localStorage.setItem('isAuthenticated', 'false');

    const {name, email, password, onInputChange, onResetForm} = useForm ({
        name : '',
        email: '',
        password: '',
    })

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí deberías hacer una llamada al servidor para verificar las credenciales
        // Para el ejemplo, usaremos credenciales de prueba:
        if (username === 'user@example.com' && contra === 'password123') {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/client/'); // Redirigir al usuario a la página /admin
        } else {
            alert('Credenciales inválidas');
        }
    };

    return (
        <div className="relative flex flex-col md:flex-row space-y-8 md:space-y-0 bg-white rounded-2xl">
            {/* left side */}
            <div className="flex flex-col justify-center lg:mx-20 p-8 md:p-14 w-full lg:w-1/2 md:w-full">
                <div className="mb-auto">
                    <NavLink 
                        to="/"
                        className="text-custom-blue font-bold text-30px"
                        >
                            Medileser
                    </NavLink>
                </div>
                <div className="mb-auto py-8 md:py-14">
                    <p className="font-open-sans font-bold text-36 text-custom-blue">Bienvenido al sistema de monitoreo</p>
                    <p className="font-light text-gray-400 mb-8">
                        Bienvenido de vuelta, por favor ingrese sus datos
                    </p>
                    <form onSubmit={handleLogin}>
                        <div 
                            className="border p-1 w-full overflow-hidden 
                                transition-colors 
                                border-transparent 
                                hover:border-l-4
                                hover:border-custom-blue
                                hover:shadow-lg
                                hover:transform
                                hover:scale-101
                                hover:transition-transform
                                border-gray-200"
                            >
                            <p className="text-xs font-roboto text-black">Cuenta de usuario</p>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="text-xs font-medium text-custom-blue focus:outline-none w-full"
                                placeholder="**********"
                            />
                        </div>
                        <div 
                            className="border p-1 w-full overflow-hidden 
                                transition-colors 
                                border-transparent 
                                hover:border-l-4
                                hover:border-custom-blue
                                hover:shadow-lg
                                hover:transform
                                hover:scale-101
                                hover:transition-transform
                                border-gray-200"
                            >
                            <p className="text-xs font-roboto text-black">Contraseña</p>
                            <input
                                type="password"
                                value={contra}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-xs font-medium text-custom-blue focus:outline-none w-full"
                                placeholder="**********"
                            />
                        </div>
                        <div className="py-4">
                            <button
                                type="submit"
                                className="w-full bg-custom-blue text-white p-2 mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* right side */}
            <div className={`flex justify-end p-10 md:p-14 md:h-screen bg-custom-gray w-1/2 md:w-1/2 flex-shrink-0 hidden md:block`}>
                <div className="relative lg:mx-10">
                    <div className="absolute top-0 right-0 space-x-8">
                        <NavLink 
                            to="/" 
                            className={`text-black font-regular text-24px py-3 relative overflow-hidden transition-colors border-b-4 border-transparent hover:border-custom-blue`}
                            >
                            Login
                        </NavLink>
                        <NavLink
                            to="https://www.medileser.com.pe/"
                            className={`text-black font-regular text-24px py-3 relative overflow-hidden transition-colors border-b-4 border-transparent hover:border-custom-blue`}
                            >
                            Acerca De
                        </NavLink>
                        <NavLink
                            to="/"
                            className={`text-black font-regular text-24px py-3 relative overflow-hidden transition-colors border-b-4 border-transparent hover:border-custom-blue`}
                            >
                            Notas Version
                        </NavLink>
                    </div>
                    <img
                        src="engineer_smart.svg"
                        alt="img"
                        className="mb-auto md:h-screen py-20 md:py-30"
                    />
                </div>
                {/* text on image */}
                <div
                    className="absolute bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg hidden md:block"
                >
                    {/* Contenido del texto sobre la imagen */}
                </div>
            </div>
        </div>
    );
}

export default Login;
