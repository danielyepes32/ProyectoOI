import { LuEye } from "react-icons/lu";
import { FiTool } from "react-icons/fi";
import { Button } from "@nextui-org/react";
import {  
    Modal,   
    ModalContent,   
    ModalHeader,   
    ModalBody,   
    ModalFooter,
    useDisclosure
} from "@nextui-org/modal";
import React from "react";
import CustomAlert from "../shared/CustomAlert";

export default function Static_1() {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [popUpData,setPopUpData] = React.useState(null);
    const [customMessage, setCustomMessage] = React.useState(null);
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    

    //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
    const modal = React.useMemo(() => {
        return (
            <Modal 
            isOpen={isOpen} 
            placement="center"
            onOpenChange={onOpenChange}
            className="mx-5"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-center font-mulish font-bold">{popUpData === 'banco' ? 'Banco': 'Instrumentos'}</ModalHeader>
                  <ModalBody>
                        {React.useMemo(() => {
                          if(popUpData === 'banco'){
                            return (
                              <div className="w-full h-full grid grid-cols-2 mb-10">
                                <div className="w-full h-full space-y-5 flex flex-col justify-start items-left">
                                  <p className="h-1/3 font-semibold">No. Banco</p>
                                  <p className="h-1/3 font-semibold">Capacidad de medidores</p>
                                  <p className="h-1/3 font-semibold">Certificados vigentes</p>
                                </div>
                                <div className="w-full h-full space-y-2 flex flex-col justify-end">
                                  <p className="text-right h-1/3">1</p>
                                  <p className="text-right h-1/3">15</p>
                                  <p className="text-right h-1/3">CONFORME</p>
                                </div>
                              </div>
                            )
                          }else if(popUpData === 'instrument'){
                            return (
                              <div className="w-full h-full grid grid-cols-5 mb-10">
                                <div className="col-span-2 w-full h-full space-y-5 flex flex-col justify-start items-left">
                                  <p className="h-1/3 font-semibold">Manómetro</p>
                                  <p className="h-1/3 font-semibold">Cronómetro</p>
                                  <p className="h-1/3 font-semibold">Termostato</p>
                                </div>
                                <div className="col-span-3 w-full h-full space-y-2 flex flex-col justify-end">
                                  <p className="text-left h-1/3">Vigencia (De: 2023-04-27, hasta 2024-04-27)</p>
                                  <p className="text-left h-1/3">Vigencia (De: 2023-01-15, hasta 2027-01-15)</p>
                                  <p className="justify-start h-1/3 flex place-items-center align-right">Vigencia (De: 2023-05-30, hasta 2024-05-30)</p>
                                </div>
                              </div>
                            )
                          }
                          }, [popUpData])
                        }
                  </ModalBody>
                  {/*   
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </ModalFooter>
                  */}
                </>
              )}
            </ModalContent>
          </Modal>    
        );
    }, [isOpen]);
  
    const confirmationMessage = React.useMemo(() => {
      console.log(isOpenCustomMessage)
      return isOpenCustomMessage === true ? (
        <CustomAlert message={customMessage} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage}></CustomAlert>
      ) : null
    }, [isOpenCustomMessage]);

  return (
    <>
      <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
        {modal}
        {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px]">Ensayo de presión estática</span>
          <span className="font-mulisg font-semibold text-opacity-text">Julio 24, 2024</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 py-2">
            <div className="col-span-3 bg-white shadow-lg flex space-x-2 rounded-[20px] items-center">
              <span className="font-inter text-center w-2/3 px-5">Usted está seleccionando el banco No.</span>
              <span className="font-teko text-[64px] w-1/3 text-center">1</span>
            </div>
            <div className="col-span-1 w-full flex justify-center place-items-center flex">
              <Button
                className="w-[50px] h-[50px] bg-custom-blue p-2 rounded-xl shadow-lg items-center"
                onClick={
                    ()=>{
                        setPopUpData("banco")
                        onOpen()
                        }
                    }
                >
                <LuEye 
                  className="text-white w-[50px] h-[50px]"
                />
              </Button>
            </div>
          </div>
          <div>
            <Button 
              className="bg-custom-blue h-auto w-full flex py-2 my-2 shadow-lg items-center"
              fullWidth={true}
              onClick={
                ()=>{
                    setPopUpData("instrument")
                    onOpen()
                    }
                }
              endContent={<FiTool className="text-white w-auto h-full"/>}
              >
              <span className="font-inter w-full text-white text-[17px]">Estado actual de los instrumentos</span>
            </Button>
          </div>
          <div className="w-full h-auto bg-white shadow-lg rounded-[20px] flex flex-col px-[7.5vw] py-3 mt-3">
            <span className="font-mulish font-bold text-[24px] text-center">Ajustes generales</span>
            <div className="w-full grid grid-cols-3 py-3">
              <div className="col-span-2 flex justify-center place-items-center">
                <span className="font-inter text-[18px]">Selección de capacidad (No de medidores por prueba)</span>
              </div>
              <div className="col-span-1 flex justify-end">
                <span className="font-teko font-semibold text-[40px] border border-oi-bg border-4 rounded-xl px-5 my-2 text-right">10</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-5 flex place-items-center py-3">
              <div className="col-span-2 flex justify-center">
                <span className="font-inter text-[18px]">Anotaciones especiales</span>
              </div>
              <div className="col-span-3 w-full h-full flex justify-center">
                <span className="font-inter text-[16px] w-full h-full p-2 text-justify border border-oi-bg border-4 rounded-xl ml-5">Se interrumpio el numero total a usar por mantenimiento del banco</span>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col h-auto bg-white shadow-lg rounded-[20px] mt-5 px-[7.5vw]">
            <span className="font-mulish font-bold text-[22px] pt-5 text-center">Selección de medidores a evaluar</span>
            <Button 
              className="w-full bg-custom-blue mt-3 py-1 rounded-[15px]"
              onClick={()=>{
                setIsOpenCustomMessage(true)
              }}>
              <span className="font-inter text-[18px] text-white">Correlativos</span>
            </Button>
            <Button className="w-ful bg-gray-but mt-3 mb-5 py-1 rounded-[15px]">
              <span className="font-inter text-[18px] text-white">No correlativos</span>
            </Button>
          </div>
      </div>
    </>
  )
}