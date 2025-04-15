import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Inmubles from './views/Inmuebles/Inmubles';
import Login from './views/Login';
import Profile from './views/profile/Profile';
import User from './views/users/User';
import Client from './views/clients/Client';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotFound from './views/NotFound';
import Detalle from './views/Inmuebles/Detalle';
import Genero from './views/generos/Genero';
import Service from './views/servicios/Service';
import Service_ex from './views/servicios_ex/Service_ex';
import Blog from './views/blog/Blog';



function App() {

  return (

    <Router>
      <Routes>
        <Route path="admin/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<Dashboard />}>
            <Route path="inmuebles" element={<Inmubles />} />
            {/*<Route path="admin/profile" element={<Profile />} />*/}
            <Route path="novedades" element={<Blog />} />
            <Route path="inmuebles/:id" element={<Detalle />} />
            <Route path="usuarios" element={<User />} />
            <Route path="clientes" element={<Client />} />
            <Route path="servicios" element={<Service />} />
            <Route path="servicios-extra" element={<Service_ex />} />
            <Route path="generos" element={<Genero />} />
            <Route path="*" element={<NotFound />} /> {/* Ruta 404 */}
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} /> {/* Redirección para rutas desconocidas */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} /> {/* Redirección para la ruta raíz */}
       
      </Routes>
    </Router>

  )
}

export default App
