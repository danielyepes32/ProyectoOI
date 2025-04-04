import React from 'react';
import { RiMenuSearchLine } from 'react-icons/ri';
import { BrowserRouter as Router, Route, Routes , useLocation} from 'react-router-dom';
import { MdCancel } from "react-icons/md";

import Menu from '../shared/menu';
import Static_1 from './static_1';
import { Button } from '@nextui-org/react';
import MainClient from './MainClient';
import Static_2_nc from './static_2_nc';
import Static_2_c from './static_2_c';
import Static_3 from './static_3';
import Static_3_nc from './static_3_nc';
import Static_3_c from './static_3_c';
//Importaciones para Q1
import Static_6 from './Record_Q1/static_6';
import Static_6_5_Q1 from './Record_Q1/static_6_5';
import Static_7 from './Record_Q1/static_7';
import Static_8 from './Record_Q1/static_8';
//Importaciones para Q2
import Static_6_Q2 from './Record_Q2/static_6';
import Static_6_5_Q2 from './Record_Q2/static_6_5';
import Static_7_Q2 from './Record_Q2/static_7';
import Static_8_Q2 from './Record_Q2/static_8';
//Importaciones para Q3
import Static_4_Q3 from './Record_Q3/static_4';
import Static_5_Q3 from './Record_Q3/static_5';
import Static_6_5_Q3 from './Record_Q3/static_6_5';
import Static_6_Q3 from './Record_Q3/static_6';
import Static_7_Q3 from './Record_Q3/static_7';
import Static_8_Q3 from './Record_Q3/static_8';

import Static_9 from './static_9';
import Static_10 from './static_10';

import Static_end from './static_end';


import ModalData from '../shared/ModalData';
import {  
  useDisclosure
} from "@nextui-org/modal";
//Elementos de react necesarios

const Client = () => {

  const location = useLocation();
  //const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAuthenticated = true
  const [sidebar, setSidebar] = React.useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  window.addEventListener("message", (event) => {
    setTimeout(() => {
      //console.log("Mensaje recibido:", event.data);
      // Aquí va tu lógica
    }, 0);
  });
  

  const modal = React.useMemo(() => {
    return(
      <ModalData
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        popUpData={'cancelForm'}
      />
    )
  },
  [isOpen])

  const handleSidebar = () => {
    setSidebar(!sidebar);
    console.log(sidebar);
    window.innerWidth >= 1024 ? setSidebar(false) : true;
  }

  //const [sidebar, setSidebar] = React.useState(false);

  return isAuthenticated ? (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-7">
      {modal}
      {/* Sidebar */}
        <Menu sidebar={sidebar} handleSidebar={handleSidebar} />
      {/* Contenido principal */}
      <Routes>
        <Route path="/" element={<MainClient/>} />
        <Route path="/static_1" element={<Static_1/>}/>
        <Route path="/static_2_c" element={<Static_2_c/>}/>
        <Route path="/static_2_nc" element={<Static_2_nc/>}/>
        <Route path="/static_3" element={<Static_3/>}/>
        <Route path="/static_3_nc" element={<Static_3_nc/>}/>
        <Route path="/static_3_c" element={<Static_3_c/>}/>
        {/*No la vayas a cagar en el futuro agrega un enrutador*/}
        <Route path="/Q1/static_6" element={<Static_6/>}/>
        <Route path="/Q1/static_6_5" element={<Static_6_5_Q1/>}/>
        <Route path="/Q1/static_7" element={<Static_7/>}/>
        <Route path="/Q1/static_8" element={<Static_8/>}/>
        {/*Rutas para Q2*/}
        <Route path="/Q2/static_6" element={<Static_6_Q2/>}/>
        <Route path="/Q2/static_6_5" element={<Static_6_5_Q2/>}/>
        <Route path="/Q2/static_7" element={<Static_7_Q2/>}/>
        <Route path="/Q2/static_8" element={<Static_8_Q2/>}/>
        {/*Rutas para Q3*/}
        <Route path="/Q3/static_4" element={<Static_4_Q3/>}/>
        <Route path="/Q3/static_5" element={<Static_5_Q3/>}/>
        <Route path="/Q3/static_6_5" element={<Static_6_5_Q3/>}/>
        <Route path="/Q3/static_6" element={<Static_6_Q3/>}/>
        <Route path="/Q3/static_7" element={<Static_7_Q3/>}/>
        <Route path="/Q3/static_8" element={<Static_8_Q3/>}/>
        {/**/}
        <Route path="/static_9" element={<Static_9/>}/>
        <Route path="/static_10" element={<Static_10/>}/>
        <Route path="/static_end" element={<Static_end/>}/>
      </Routes>
      {/* Botón del menú móvil */}
      <Button
        className={`${location.pathname !== "/client/" ? '' : 'hidden'} z-[200] fixed bottom-4 right-4 mb-12 bg-red-400 border border-gray-400 text-white py-2 px-0 rounded-full shadow-lg text-2xl`}
        onClick={()=>{
          if (location.pathname !== "/client/") {
            onOpen();
          }
        }}
      >
        <MdCancel className='w-full h-full'/>
      </Button>
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