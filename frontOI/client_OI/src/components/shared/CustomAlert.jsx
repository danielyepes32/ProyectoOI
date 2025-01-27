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

const CustomAlert = ({ message, isVisible, setIsVisible, routeRedirect,handleConfirm}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  console.log("Visible: ",isVisible)
  const navigate = useNavigate();

  React.useEffect(() => {
    if(isVisible === true){
      console.log("entra 1")
      onOpen()
    }else if (isVisible === false){
      null
    }
  }, [isVisible]);



  return (
    <Modal 
      isOpen={isOpen} 
      placement="center"
      onOpenChange={()=>{
        onOpenChange()
        console.log("isOpen: ", isVisible)
      }}
      onClose={()=>{
        console.log("Visible: " , isVisible)
        setIsVisible(false)
        console.log("Se cerró")
        console.log("Visible: " , isVisible)
      }}
      className="mx-5"
      scrollBehavior='outside'
    >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 text-center font-mulish font-bold text-[30px]">Alerta</ModalHeader>
          <div className='border-2 border-gray-400 mx-5 rounded-[20px]'></div>
          <ModalBody>
            <div className="w-full h-full flex items-center justify-center place-items-center">
              <span className='px-10 text-center font-inter text-[16px]'>¿Desea continuar con la toma de valores?</span>
            </div>
          </ModalBody>   
          <ModalFooter>
            <div className='w-full h-full grid grid-cols-2'>
              <div className='col-span-1 w-full h-full flex justify-center items-center place-items-center'>
                <Button 
                className='bg-red-200 text-white'
                onPress={()=>{
                  setIsVisible(false)
                  onClose()
                }}
                >
                Cancelar
              </Button>
              </div>
              <div className='col-span-1 w-full h-full flex justify-center items-center place-items-center'>
                <Button 
                className='bg-custom-blue text-white'
                onPress={async () => {
                    let api_recall = null
                  if (handleConfirm) {
                    api_recall = await handleConfirm(); // Espera a que handleConfirm termine
                  } else {
                    navigate(routeRedirect)
                    setIsVisible(false)
                    onClose()
                    return;
                  }
                  setIsVisible(false);
                  onClose();
                  api_recall ? navigate(routeRedirect) : null; // Navega solo después de que todo lo anterior haya terminado
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
  )
};

export default CustomAlert;
