import React from 'react';
import { RiMenuSearchLine } from 'react-icons/ri';
import { BrowserRouter as Router, Route, Routes , useLocation} from 'react-router-dom';
import Menu from '../shared/menu';
import Static_1 from './static_1';
import { Button } from '@nextui-org/react';
import MainClient from './MainClient';
import Static_2_c from './static_2_c';
import Static_2_nc from './static_2_nc';

const Client = () => {

  //const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAuthenticated = true
  console.log(isAuthenticated)
  const [sidebar, setSidebar] = React.useState(false);

  const handleSidebar = () => {
    setSidebar(!sidebar);
    console.log(sidebar);
    window.innerWidth >= 1024 ? setSidebar(false) : true;
  }

  //const [sidebar, setSidebar] = React.useState(false);

  return isAuthenticated ? (
    <div className="min-h-screen flex grid grid-cols-1 lg:grid-cols-7">
      {/* Sidebar */}
        <Menu sidebar={sidebar} handleSidebar={handleSidebar} />
      {/* Contenido principal */}
      <Routes>
        <Route path="/" element={<MainClient/>} />
        <Route path="/static_1" element={<Static_1/>}/>
        <Route path="/static_2_c" element={<Static_2_c/>}/>
        <Route path="/static_2_nc" element={<Static_2_nc/>}/>
      </Routes>
      {/* Botón del menú móvil */}
      <Button
        className="z-[200] fixed bottom-4 right-4 bg-custom-blue border border-gray-400 text-white py-2 px-4 rounded-full shadow-lg text-2xl"
        onClick={handleSidebar}
      >
        <RiMenuSearchLine className='w-full h-full'/>
      </Button>
    </div>
  ) : (
    <div className="h-full w-full">
      <h1>USTED NO TIENE ACCESO A ESTAS VISTAS</h1>
    </div>
  )
};

export default Client;