import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import storage from '../storage/storage';
import { sendRequest } from '../functions';
import axios from 'axios';
import logoPensi from '../assets/logo.png'
import logoP from '../../public/pensi-logo.ico'

const Sidebar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const logout = async () => {
        await sendRequest('POST', {}, '/api/logout-user', '', true);
        storage.remove('authToken');
        storage.remove('authUser');
        navigate('login');
    };

    return (
        <div className={`bg-primary text-white h-screen ${isOpen ? 'w-64 absolute z-20' : 'w-16'} md:w-64 z-10 flex flex-col items-center justify-between `}>
            <div className={`${isOpen ? 'block' : 'hidden'} md:block p-6 border-b`}>
                <img src={logoPensi} alt="Logo Pensi inmuebles" className='' />

            </div>
            <div className="p-4 flex items-center justify-center w-full">
                <button className="block md:hidden text-white">
                    <svg className="w-8 h-8 cursor-pointer" onClick={toggleSidebar} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        {isOpen ? (
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.707 7.293a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
                        ) : (
                            <path fillRule="evenodd" clipRule="evenodd" d="M3 9a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zm-1-4a1 1 0 011-1h12a1 1 0 010 2H3a1 1 0 01-1-1zm1 8a1 1 0 100 2h12a1 1 0 100-2H3z" />
                        )}
                    </svg>
                </button>
                <h2 className={`text-md font-semibold ${isOpen ? 'flex' : 'hidden'} md:flex items-center`}>
                    <img src={logoP} alt="Logo Pensi" className="w-8 mr-2 hidden md:block" />
                    {storage.get('authUser').name}
                </h2>
            </div>
            <ul className={`flex-1 ${isOpen ? 'block' : 'hidden'} relative  md:block w-full`}>
                <li className="hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/inmuebles" ><i className="fa-solid fa-hotel mr-2"></i> Inmuebles</Link>
                </li>
                <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/generos" ><i className="fa-solid fa-venus-mars mr-2"></i> Generos</Link>
                </li>
                <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/servicios" ><i className="fa-solid fa-store mr-2"></i> Servicios</Link>
                </li>
                <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/servicios-extra" ><i className="fa-solid fa-shop mr-2"></i> Servicios Extra</Link>
                </li>
                <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/novedades" ><i className="fa-solid fa-newspaper mr-2"></i> Novedades & Blog</Link>
                </li>
                <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/clientes" ><i className="fa-solid fa-user-tie mr-2"></i> Clientes</Link>
                </li>
                <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/usuarios" ><i className="fa-solid fa-user mr-2"></i> Usuarios</Link>
                </li>

                {/**
                 * <li className=" hover:bg-acent w-full">
                    <Link className='block p-4' to="/admin/profile"><i className="fa-solid fa-address-card mr-2"></i> Profile</Link>
                    </li>
                */}
                
                <li className=" hover:bg-acent w-full">
                    <a
                        className="block p-4"
                        href="mailto:josecastrillonizquierdo@gmail.com?subject=Pensi PQR&body=Hola, necesito ayuda con..."
                        rel="noopener noreferrer"
                    >
                        <i className="fa-solid fa-bug mr-2"></i> Ayuda
                    </a>
                </li>
                <li className=" w-full bg-acent absolute bottom-0 ">
                    <button className={` ${isOpen ? 'block' : 'hidden'} p-4 w-full md:block hover:bg-acent `} onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket mr-2" ></i> Salir
                    </button>
                </li>
                {/* Agrega más enlaces según sea necesario */}
            </ul>
        </div>
    );
};

export default Sidebar;
