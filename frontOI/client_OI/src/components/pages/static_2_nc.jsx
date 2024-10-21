import {  
    Dropdown,  
    DropdownTrigger,  
    DropdownMenu,  
    DropdownSection,  
    DropdownItem
} from "@nextui-org/dropdown";
import React from "react";
import { Button } from "@nextui-org/react";
import { FaCaretDown } from "react-icons/fa";
import { BsArrow90DegRight } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgSearch } from "react-icons/cg";
import { RiPlayListAddFill } from "react-icons/ri";
import { GoPencil } from "react-icons/go";

import {  
    Modal,   
    ModalContent,   
    ModalHeader,   
    ModalBody,   
    ModalFooter,
    useDisclosure
} from "@nextui-org/modal";
import CustomAlert from "../shared/CustomAlert";


export default function Static_2_nc() {

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    const [customMessage, setCustomMessage] = React.useState(null);

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );

    const modal = React.useMemo(() => {
        return (
            <Modal 
            isOpen={isOpen} 
            placement="center"
            onOpenChange={onOpenChange}
            className="mx-10"
            size="sm"
            scrollBehavior="outside"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <div className="mt-7">
                        <div className="w-full flex flex-col rounded-[10px] border border-1 h-auto bg-white shadow-sm">
                            <div className="w-full h-[10px] rounded-tl-[60px] rounded-tr-[60px] bg-oi-bg"></div>
                            <div className="w-full flex justify-left place-items-center">
                                <div className="m-3 w-[45px] h-[45px] rounded-full justify-center bg-custom-blue place-items-center flex items-center">
                                    <span className="font-inter text-white text-center">1</span>
                                </div>
                                <div className="flex-grow flex items-center place-items-center justify-center">
                                    <span className="text-center">AA23099470</span>
                                </div>
                            </div>
                            <div className="w-full h-[10px] rounded-tl-[60px] rounded-tr-[60px] bg-oi-bg"></div>
                            <div className="w-full flex justify-left place-items-center">
                                <div className="m-3 w-[45px] h-[45px] rounded-full justify-center bg-custom-blue place-items-center flex items-center">
                                    <span className="font-inter text-white text-center">2</span>
                                </div>
                                <div className="flex-grow flex items-center place-items-center justify-center">
                                    <span className="text-center">AA23099471</span>
                                </div>
                            </div>
                            <div className="w-full h-[10px] rounded-tl-[60px] rounded-tr-[60px] bg-oi-bg"></div>
                            <div className="w-full flex justify-left place-items-center">
                                <div className="m-3 w-[45px] h-[45px] rounded-full justify-center bg-custom-blue place-items-center flex items-center">
                                    <span className="font-inter text-white text-center">3</span>
                                </div>
                                <div className="flex-grow flex items-center place-items-center justify-center">
                                    <span className="text-center">AA23099472</span>
                                </div>
                            </div>
                            <div className="w-full h-[10px] rounded-tl-[60px] rounded-tr-[60px] bg-oi-bg"></div>
                            <div className="w-full flex justify-left place-items-center">
                                <div className="m-3 w-[45px] h-[45px] rounded-full justify-center bg-custom-blue place-items-center flex items-center">
                                    <span className="font-inter text-white text-center">4</span>
                                </div>
                                <div className="flex-grow flex items-center place-items-center justify-center">
                                    <span className="text-center">AA23099473</span>
                                </div>
                            </div>
                            <div className="w-full h-[10px] rounded-tl-[60px] rounded-tr-[60px] bg-oi-bg"></div>
                            <div className="w-full flex justify-left place-items-center">
                                <div className="m-3 w-[45px] h-[45px] rounded-full justify-center bg-custom-blue place-items-center flex items-center">
                                    <span className="font-inter text-white text-center">5</span>
                                </div>
                                <div className="flex-grow flex items-center place-items-center justify-center">
                                    <span className="text-center">AA23099474</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </ModalBody>  
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


    return(
        <>
        {confirmationMessage}
        <div className="w-screen h-[100svh] bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            <span className="font-mulish font-bold pt-5 text-[24px]">Ensayo de presión estática</span>
            <span className="font-mulisg font-semibold text-opacity-text">Julio 24, 2024</span>
            <div className="w-full h-auto flex mt-8">
                <div className="bg-white w-4/6 h-full rounded-[20px] flex flex-col justify-center p-3">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] ml-4">Orden Seleccionada</span>
                    <Dropdown
                        >
                        <DropdownTrigger>
                            <Button 
                            variant="bordered" 
                            className="capitalize mt-2 z-[0]"
                            >
                            <div className="flex justify-between w-full">
                                <span className="font-teko font-semibold text-black text-[24px]">{selectedKeys}</span>
                                <FaCaretDown className="text-custom-blue"/>
                            </div>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                        >
                            <DropdownItem key="text">Text</DropdownItem>
                            <DropdownItem key="number">Number</DropdownItem>
                            <DropdownItem key="date">Date</DropdownItem>
                            <DropdownItem key="single_date">Single Date</DropdownItem>
                            <DropdownItem key="iteration">Iteration</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="ml-3 bg-white w-2/6 h-auto rounded-[20px] flex flex-col justify-center place-items-center">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] mt-3">Capacidad</span>
                    <span className="font-teko font-semibold text-[40px]">10</span>
                </div>
            </div>
            <div>
                <Button 
                    className="flex justify-center place-items-center bg-custom-blue w-full my-[3vh]"
                    onClick={onOpen}
                    endContent={<RiPlayListAddFill className="w-auto justify-end text-right text-white h-[40px]"/>}
                    classNames={{
                        base:"bg-red-100",
                        startContent: "bg-red-100"
                    }}
                    >
                    <span className="font-inter text-[14px] text-center text-white py-2">Medidores disponibles en orden (350ud)</span>
                </Button>
            </div>
            <div className="bg-white shadow-sm w-full h-auto rounded-[20px] place-items-center flex flex-col">
                <span className="font-mulish font-semibold text-[24px]">Selección a evaluar</span>
                <div className="w-5/6 bg-gray-400 h-0.5 mb-2"></div>
                <div className="w-5/6">
                    <span className="text-left font-inter text-[18.4px] mt-2" style={{ lineHeight: '0' }}>Realice una selección de medidores para la ejecución de la prueba.</span>
                </div>
                <div className="w-5/6 bg-gray-400 h-0.5 my-2"></div>
                <div className="w-5/6 flex grid grid-cols-4 place-items-center h-auto">

                    <div className="ml-3 bg-white col-span-3 w-full h-auto rounded-[20px] flex flex-col place-items-center">
                        <div className="flex w-full justify-between items-center place-items-center space-x-[2vw]">
                            <span className="w-auto font-inter font-semibold text-opacity-text text-left text-[18.4px]">Desde:</span>
                            <span className="w-full font-teko font-semibold text-[24px] text-left">AA23099470</span>
                        </div>
                        <div className="flex w-full justify-between place-items-center space-x-[3.5vw]">
                            <span className="w-auto font-inter font-semibold text-opacity-text text-left text-[18.4px]">Hasta:</span>
                            <span className="w-full font-teko font-semibold text-[24px] text-left">AA23099482</span>
                        </div>
                    </div>  
                    <div className="ml-3 bg-white col-span-1 h-auto rounded-[20px] flex flex-col place-items-center mb-3">
                        <span className="font-inter font-semibold text-center text-opacity-text text-[16px] mt-3">Seleccionar todos</span>
                        <Button
                            isIconOnly
                            className="my-2 bg-white"
                            >
                            <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm">
                                <GoPencil className="text-white p-2 w-full h-full" />
                            </div>
                        </Button>
                        <span className="font-inter font-semibold text-center text-opacity-text text-[16px] mt-3">Confirmar selección</span>
                        <Button
                            isIconOnly
                            className="my-2 bg-white"
                            >
                            <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm">
                                <IoMdAddCircleOutline className="text-white p-2 w-full h-full" />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex w-full justify-between place-items-center space-x-2 rounded-[20px] my-[8vw] bg-white shadow-sm">
                <div className="ml-3 bg-white w-[45%] h-auto rounded-[20px] flex flex-col place-items-center">
                    <span className="font-inter font-semibold text-opacity-text text-center text-[16px] mt-3">Medidores seleccionados</span>
                    <span className="font-teko font-semibold text-[40px]">6</span>
                </div>
                <Button
                    className="mx-[20vw] h-[60px] my-5 py-2 bg-custom-blue "
                    onClick={()=>{
                        setIsOpenCustomMessage(true)
                      }}
                    >
                    <div className="flex flex-col items-center justify-center place-items-center space-y-2 w-full h-full">
                        <span className="font-inter text-white text-center text-[16px]">Guardar configuración</span>
                        <BsArrow90DegRight className="text-center text-white text-[16px] font-semibold"/>
                    </div>
                </Button>
            </div>  
        </div>
        </>
    )
}