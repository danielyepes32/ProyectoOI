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
import  DateService  from "../../hook/services/dateService.js"
import ModalData from "../shared/ModalData";


export default function Static_3() {

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    const [customMessage, setCustomMessage] = React.useState(null);
    const [popUpData, setPopUpData] = React.useState(null);

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );

    const modal = React.useMemo(() => {
        return (
            <ModalData
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                popUpData={popUpData}
            />
        );
    }, [isOpen]);

    const confirmationMessage = React.useMemo(() => {
        console.log(isOpenCustomMessage)
        return isOpenCustomMessage === true ? (
          <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={"/client/Q3/static_4"}
            />
        ) : null
      }, [isOpenCustomMessage]);


    return(
        <>
        {confirmationMessage}
        <div className="w-screen h-[100svh] bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            <span className="font-mulish font-bold pt-5 text-[24px]">Ensayo de presión estática</span>
            <span className="font-mulisg font-semibold text-opacity-text">{DateService.getCurrentDate()}</span>
            <div className="bg-white shadow-sm w-full h-auto rounded-[20px] place-items-center flex flex-col mt-4">
                <span className="font-mulish font-semibold text-[24px]">Resumen de parámetros</span>
                <div className="w-5/6 bg-gray-400 h-0.5 mb-2"></div>
                <div className="w-5/6 justify-between full flex place-items-center">
                    <span className="font-inter text-left text-[18.4px] w-full">Capacidad seleccionada en banco</span>
                    <span className="font-teko font-semibold text-[40px] w-full text-right">10</span>
                </div>
                <div className="w-5/6 my-5 justify-between full flex place-items-center">
                    <span className="font-inter text-left text-[18.4px] w-full mr-3">Tipo de análisis</span>
                    <span className="font-teko font-semibold text-[32px] w-full text-right">Correlativo</span>
                </div>
                <div className="w-5/6 mb-5 justify-between full flex place-items-center">
                    <span className="font-inter text-left text-[18.4px] w-full">Instrumentos en vigencia</span>
                    <span className="font-teko font-semibold text-[32px] w-full text-right">Si</span>
                </div>
            </div>
            <div className="w-full h-auto flex justify-center py-4 mt-4 bg-white rounded-[40px] shadow-sm">
                <div className="w-5/6 justify-between full flex place-items-center">
                    <span className="font-inter text-center text-[18.4px] w-full">Total de medidores seleccionados</span>
                    <div className="flex flex-col w-full justify-center place-items-center" style={{ lineHeight: '0.7' }}>
                        <span className="text-center font-teko font-semibold text-[64px]">50</span>
                        <span className="text-center font-inter text-[18.4px]">Medidores</span>
                    </div>
                </div>
            </div>
            <div>
                <Button 
                    className="flex justify-center place-items-center bg-custom-blue w-full mt-[3vh]"
                    onClick={()=>{
                        setPopUpData("order")
                        onOpen()
                    }}
                    endContent={<RiPlayListAddFill className="w-auto justify-end text-right text-white h-[40px]"/>}
                    classNames={{
                        base:"bg-red-100",
                        startContent: "bg-red-100"
                    }}
                    >
                    <span className="font-inter text-[14px] text-center text-white py-2">Medidores disponibles en orden (8ud)</span>
                </Button>
            </div>
            <div className="flex-grow flex flex-col w-full justify-between place-items-center rounded-[20px] my-[8vw] bg-white shadow-sm">
                <div className="w-full flex flex-col justify-center place-items-center mt-4">
                    <span className="font-mulish font-semibold text-[24px] text-center">Confirmación</span>
                    <div className="w-5/6 bg-gray-400 h-0.5 mb-2"></div>
                </div>
                <span className="font-inter text-center ext-[16px] mx-20">¿Todos los datos están correctos?</span>
                <div className="flex justify-center space-x-7 mt-4 mb-5">
                    <Button
                    color="danger"
                        >
                        Regresar
                    </Button>
                    <Button
                        className="bg-custom-blue"
                        onClick={()=>{
                            setIsOpenCustomMessage(true)
                          }}
                        >
                        <span className="text-white">Confirmar</span>
                    </Button>
                </div>
            </div>  
        </div>
        </>
    )
}