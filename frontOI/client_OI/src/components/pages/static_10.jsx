import { LuEye } from "react-icons/lu";
import { Button} from "@nextui-org/react";
import { 
    useDisclosure
} from "@nextui-org/modal";
import React, { useState } from "react";
import CustomAlert from "../shared/CustomAlert";
  //Componente
import {meterColumns, meterDataTest} from "../../utils/tests/data"  //"../../utils/tests/data";

import { IoSpeedometerOutline } from "react-icons/io5";
import { MdOutlineWbIncandescent } from "react-icons/md";
import ModalData from "../shared/ModalData";
import TableResume from "../static_resume/TableResume";
//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["checkbox","meter_id", "num", "error"];

export default function Static_10() {

    const [isChanged, setIsChanged] = useState(false)

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [popUpData,setPopUpData] = React.useState(null);
    const [customMessage, setCustomMessage] = React.useState(null);
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
    const [isLoading, setIsLoading] = React.useState(true);
    //constante con los id de los medidores seleccionados
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    //Constante para establecer las columnas visibles puesto que estas son dinamicas
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    //En esta variable se guardarán los medidores que se extraigan de la API
    const [meters, setMeters] = React.useState(meterDataTest);
    //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
    const [metersLength, setMetersLength] = React.useState(meterDataTest.length);
    //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
    const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient
    //Esta función se usa para calcular las columnas que se etsablecen como visibles
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return meterColumns;

        return meterColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    const handleValidateError = (key) => {
      // Buscar el objeto que coincide con el `meter_id` especificado
      const err_record = meters.find(item => item.meter_id === key)?.error;
    
      // Validar el valor de `err_record` y retornar el `className` correspondiente
      switch (true) {
        case (+err_record >= 0 && err_record <= 4.1):
          return "text-green-500 bg-green-200 transition-colors duration-500"; // Rango de error bajo
        case (+err_record > 4.1 && err_record < 5.0):
          return "text-yellow-500 bg-yellow-100 transition-colors duration-500"; // Rango de error medio
        case (+err_record >= 5.0):
          return "text-red-500 bg-red-200 transition-colors duration-500"; // Rango de error alto
        default:
          return "transition-colors duration-500"; // Sin valor de error o valor desconocido
      }
    };

    const handleValidateErrorInput = (key) => {
      // Buscar el objeto que coincide con el `meter_id` especificado
      const err_record = meters.find(item => item.meter_id === key)?.error;
    
      // Validar el valor de `err_record` y retornar el `className` correspondiente
      switch (true) {
        case (+err_record >= 0 && err_record <= 4.1):
          return "w-[17px] h-[17px] flex justify-center place-items-center bg-green-400 rounded-md"; // Rango de error bajo
        case (+err_record > 4.1 && err_record < 5.0):
          return "w-[17px] h-[17px] flex justify-center place-items-center bg-yellow-300 rounded-md"; // Rango de error medio
        case (+err_record >= 5.0):
          return "w-[17px] h-[17px] flex justify-center place-items-center bg-red-400 rounded-md"; // Rango de error alto
        default:
          return "transition-colors duration-500"; // Sin valor de error o valor desconocido
      }
    };
  
    //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
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
        //console.log("CustomMessage: ", isOpenCustomMessage)
        return isOpenCustomMessage === true ? (
          <CustomAlert message={customMessage} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage}></CustomAlert>
        ) : null
      }, [isOpenCustomMessage]);

  const tableRow = React.useMemo(() => {
    return (
      <TableResume
        selectedKeys={selectedKeys}
        headerColumns={headerColumns}
        meters={meters}
        loadingState={loadingState}
        handleValidateError={handleValidateError}
        handleValidateErrorInput={handleValidateErrorInput}
      />
    );
  }, [meters, headerColumns,selectedKeys])

    return (
        <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Ensayo de presión estática</span>
          <span className="font-mulisg font-semibold text-opacity-text ">Sesion iniciada en Julio 24, 2024</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 pt-2">
            <div className="col-span-3 bg-white shadow-lg px-4 flex justify-between rounded-[30px] items-center">
              <span className="font-inter text-center w-full pr-2">Usted se encuentra en la prueba</span>
              <span className="font-teko text-[48px] font-semibold w-auto text-right">Q3</span>
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
                    className="flex justify-between place-items-center bg-custom-blue w-full mt-[3vh]"
                    onClick={onOpen}
                    endContent={<MdOutlineWbIncandescent className="w-auto justify-end text-right text-white h-[40px]"/>}
                    classNames={{
                        base:"bg-red-100",
                        startContent: "bg-red-100"
                    }}
                    >
                    <span className="font-inter text-[20px] text-center text-white py-2">Estatus de prueba</span>
                </Button>
            </div>
          <div className="w-full flex flex-col flex-grow mb-5 h-[300px] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
            <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Errores finales en prueba</span>
            <div className="w-5/6 rounded-[20px] bg-custom-blue h-2 mb-2 text-white">'</div>
            <div className="w-full flex h-[30svh] my-3">
              {tableRow}
            </div>
          </div>
          <div className="flex justify-between w-full mb-4 h-auto space-x-2">
            <div className="w-full h-auto bg-white rounded-[20px] shadow-sm flex flex-col justify-between py-2">
              <span className="font-inter text-center w-full text-[15px] h-auto">Presiones estáticas</span>
              <div className="flex justify-between">
                <IoSpeedometerOutline className="w-full h-auto p-4"/>
                <div className="flex flex-col w-full">
                  <span className="text-[15px] font-inter text-gray-300">Entrada</span>
                  <span className="text-[15px] font-teko font-semibold">6,001</span>
                  <span className="text-[15px] font-inter text-gray-300">Salida</span>
                  <span className="text-[15px] font-teko font-semibold">6,000</span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-betweenh-auto bg-white rounded-[20px] shadow-sm px-2 py-2">
              <div className="ml-2 w-full h-auto flex justify-left place-items-end">
                <span className="font-teko font-semibold text-[32px]">18:53</span>
                <span className="font-teko font-semibold text-[20px]">min</span>
              </div>
              <div className="flex justify-between w-full">
                <img src="../../../public/sandClock.svg" alt="" className="w-2/5 p-2 h-auto"/>
                <div className="flex flex-col justify-between ml-2 w-3/5">
                  <span className="font-inter ml-2 ">/22min</span>
                  <span className="font-poppins font-bold text-[14px]">Duración de la prueba</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-grow flex-col bg-white rounded-[20px] px-5 py-5 shadow-sm mb-5">
            <span className="font-mulish font-semibold text-center text-[24px]">Pasar al resúmen de la prueba </span>
            <Button
              className="bg-custom-blue mt-1"
              onClick={()=>{
                setIsOpenCustomMessage(true)
                setIsChanged(!isChanged)
              }}
              >
              <span className="font-inter text-white text-center text-[16px]">Confirmar</span>
            </Button>
          </div>
        </div>
    )
}