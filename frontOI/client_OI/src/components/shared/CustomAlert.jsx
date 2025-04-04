import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import {  
  Modal,   
  ModalContent,   
  ModalHeader,   
  ModalBody,   
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useNavigate } from 'react-router-dom';
import apiService from '../../hook/services/apiService';
import { useLocation } from 'react-router-dom';

const CustomAlert = ({ message, isVisible, setIsVisible, routeRedirect,handleConfirm, handleCancel, typePrueba}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const navigate = useNavigate();
  const [metersLength, setMetersLength] = useState(0);
  const location = useLocation();
  const currentPath = location.pathname;

  console.log("currentPath", currentPath);

  React.useEffect(() => {
    if(isVisible === true){
      onOpen()
    }else if (isVisible === false){
      null
    }
  }, [isVisible]);

  const fetchMetersPrueba = async () => {
  try {
      const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
      const medidores_order = await apiService.getAll(`ordenes/trabajo/buscar/`, {
          identificador: sessionData.selectedOrder.id_orden
      });
      localStorage.setItem("idOrdenSelected",sessionData.selectedOrder.nombre_orden)
      if(medidores_order){
          const medidores = medidores_order[0].medidores_asociados.filter((medidor) => (medidor.estado === 'Disponible')).map((medidor) => ({
              id: medidor.id,
              medidor: medidor.numero_serie,
              estado: medidor.estado,
          }));
          
          return medidores.length;
      }else{
        alert('No es posible crear una nueva bancada No Correlativa, no hay medidores disponibles en la prueba');
        return 0;
      }

  } catch (error) {
      //En caso de error en el llamado a la API se ejecuta un console.error
      console.error('Error fetching initial meters:', error);
      alert('No es posible crear una nueva bancada No Correlativa');
      return 0;
  }}

  console.log("metersLength", metersLength);

  return isOpen ? (
    <Modal 
      isOpen={isOpen} 
      placement="center"
      onOpenChange={()=>{
        onOpenChange()
        setIsVisible(true)
      }}
      onClose={()=>{
        setIsVisible(false)
      }}
      className="mx-5"
      scrollBehavior='outside'
      isDismissable={false}
    >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 text-center font-mulish font-bold text-[30px]">Alerta</ModalHeader>
          <div className='border-2 border-gray-400 mx-5 rounded-[20px]'></div>
          <ModalBody>
            <div className="w-full h-full flex items-center justify-center place-items-center">
              <span className='px-10 text-center font-inter text-[16px]'>{message || "¿Desea continuar con la toma de valores?"}</span>
            </div>
          </ModalBody>   
          <ModalFooter>
            <div className='w-full h-full grid grid-cols-2'>
              <div className='col-span-1 w-full h-full flex justify-center items-center place-items-center'>
                <Button 
                  className='bg-red-200 py-1 text-white h-full w-1/2 flex justify-center items-center place-items-center'
                  onClick={async ()=>{
                    let api_recall = null
                    if (handleCancel) {
                      api_recall = await handleCancel(); // Espera a que handleCancel termine
                    } else {
                      setIsVisible(false)
                      onClose()
                      return;
                    }
                    setIsVisible(false)
                    onClose()
                    typePrueba === "nc" ? navigate("/client") : null
                  }}
                  isDismissable={true}
                >
                <span className='text-center flex h-full w-full break-words whitespace-normal'>{typePrueba === "nc" ? "Volver a la pantalla de inicio" : "Cancelar"}</span>
              </Button>
              </div>
              <div className='col-span-1 w-full h-full flex justify-center items-center place-items-center'>
                <Button 
                  className='bg-custom-blue text-white'
                  onClick={async () => {
                      let api_recall = null
                      let metersLength = null
                    if (handleConfirm) {
                      api_recall = await handleConfirm(); // Espera a que handleConfirm termine
                      currentPath === '/client/static_end' ? metersLength = await fetchMetersPrueba() : null;
                    } else {
                      navigate(routeRedirect)
                      setIsVisible(false)
                      onClose()
                      return;
                    }
                    setIsVisible(false);
                    onClose();
                    api_recall ? metersLength && metersLength > 0 || currentPath !== '/client/static_end' ? navigate(routeRedirect) : navigate("/client") : null; // Navega solo después de que todo lo anterior haya terminado
                  }}
                >
                Confirmar
              </Button>
              </div>
            </div>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
  ) : null
};

export default CustomAlert;
