
//Iconos de la vista
//---------------------------------------------------------
import React from "react";
import { Button } from "@nextui-org/react";
import { FaCaretDown } from "react-icons/fa";
import { BsArrow90DegRight } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
//------------------------------------------------------
//Importaciones de los elementos UI de la librería nextUI
//----------------------------------------------------------
import {  
    Dropdown,  
    DropdownTrigger,  
    DropdownMenu,  
    DropdownItem
} from "@nextui-org/dropdown"; //Aquí se importan los elementos del dropdownBox 
import {  
    useDisclosure
} from "@nextui-org/modal"; //Use disclosure para el manejo del Modal de selección de datos
//-------------------------------------------------------------------------------------
//Elementos externos
//--------------------------------------------------------------------------------------
//Para el componente table, hay que definir las columnas totales y los datos o elementos a desplegar
import {columns, DataPrueba} from "../../utils/tests/data"  //"../../utils/tests/data";
//Modal para el mensaje de confirmación
import CustomAlert from "../shared/CustomAlert";
//Modal para el despliegue de la tabla de selección de medidores
import ModalData from "../shared/ModalData";

//Esta variable global guarda la selección de columnas que quieres desplegar en cada vista, esto permite delimitar enm reenderizado de variables en el componente table
const INITIAL_VISIBLE_COLUMNS = ["test_id"];

export default function Static_2_nc() {

    //Variable, de tipo set que guarda el valor seleccionado en el dropdown de las ordenes
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    //Esta variable guarda los identificadortes de los medidores seleccionados en el modal de selección, de tipo set evitando duplicados
    const [selectedMeterKeys, setSelectedMeterKeys] = React.useState(new Set());
    //Variable para abrir el modal de selección de medidores
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    //Variable para abrir el Modal de confirmación
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    //Mensaje personbalizado para el modal de confirmación
    const [customMessage, setCustomMessage] = React.useState(null);
    //Constante para establecer las columnas visibles puesto que estas son dinamicas
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    //Variable que establece la columna y el orden de filtrado para la consulta, es un JSON con el nombre de columna
    //y el orden (ascending, descending)
    const [sortDescriptor, setSortDescriptor] = React.useState({});
    //En esta variable se guardarán los medidores que se extraigan de la API, para el caso de prueba son datos del archivo data.js
    const [meters, setMeters] = React.useState(DataPrueba);
    //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
    const [metersLength, setMetersLength] = React.useState(DataPrueba.length);
    //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
    const [isLoading, setIsLoading] = React.useState(true);
    //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
    const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";
    //Variable para específicar que datos se quieren mostrar en el modal
    const [popUpData, setPopUpData] = React.useState(null)

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente static_2_nc que tienen cambios de reenderizado y caché
    //---------------------------------------------------------------------------------------------------------------------------
    //Función que agrupa y formatea los campos que se seleccionen en el dropdownBox
    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );
    //Esta función se usa para calcular las columnas que se etsablecen como visibles en el componente table
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    //Componente externo Modal para mostrar los datos del componente Table
    const modal = React.useMemo(() => {
        return (
            <ModalData
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                popUpData={popUpData}   
                selectedMeterKeys={selectedMeterKeys} 
                sortDescriptor={sortDescriptor}
                setSelectedMeterKeys={setSelectedMeterKeys}
                setSortDescriptor={setSortDescriptor}
                headerColumns={headerColumns}
                meters={meters}
                loadingState={loadingState}
            />
        );
    }, [isOpen,selectedMeterKeys, sortDescriptor, popUpData]); //Variables de reenderizado

    //Ejecución de componente externo modal para confirmación
    //El funcionamiento es el mismo que en static_1
    const confirmationMessage = React.useMemo(() => {
        return isOpenCustomMessage === true ? (
          <CustomAlert message={customMessage} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage}></CustomAlert>
        ) : null
      }, [isOpenCustomMessage]);

    return(
        <>
        {confirmationMessage}
        <div className="w-screen h-[100svh] bg-oi-bg flex flex-col space-y-auto px-[5vw] overflow-y-auto">
            {modal}
            <span className="font-mulish font-bold pt-5 text-[24px]">Ensayo de presión estática</span>
            <span className="font-mulisg font-semibold text-opacity-text">Julio 24, 2024</span>
            <div className="w-full h-auto flex mt-8">
                <div className="bg-white w-4/6 h-full rounded-[20px] flex flex-col justify-center p-3">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] ml-4">Identificador de Prueba</span>
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
            <Button 
                disableAnimation={true}
                className="flex justify-center place-items-center bg-custom-blue w-full my-[3vh] h-auto py-3"
                >
                <span className="font-inter text-[15px] text-center text-white">Medidores disponibles en orden (350ud)</span>
            </Button>
            <div className="bg-white shadow-sm w-full h-auto rounded-[20px] place-items-center flex flex-col">
                <span className="font-mulish font-semibold text-[24px]">Selección a evaluar</span>
                <div className="w-5/6 bg-gray-400 h-0.5 mb-2"></div>
                <div className="w-5/6">
                    <span className="text-left font-inter text-[18.4px] mt-2" style={{ lineHeight: '0' }}>Realice una selección de medidores para la ejecución de la prueba.</span>
                </div>
                <div className="w-5/6 bg-gray-400 h-0.5 my-2"></div>
                <div className="w-5/6 flex justify-between place-items-center h-auto">
                    <div className="ml-3 bg-white w-[45%] h-auto rounded-[20px] flex flex-col place-items-center">
                        <span className="font-inter font-semibold text-opacity-text text-center text-[16px] mt-3">Medidores seleccionados</span>
                        <span className="font-teko font-semibold text-[40px]">6</span>
                    </div>
                    <div className="ml-3 bg-white w-[45%] h-auto rounded-[20px] flex flex-col place-items-center">
                        <span className="font-inter font-semibold text-center text-opacity-text text-[16px] mt-3">Modificar selección</span>
                        <Button
                            isIconOnly
                            className="my-2 bg-white"
                            onClick={()=>{
                                setPopUpData("meter_nc")//Se cambia el estado a meter_nc
                                onOpen()//Se abre el modal
                            }}
                            >
                            <FaListAlt className="text-custom-blue w-full h-full" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex w-full mt-[8vw]">
                <Button
                    className="mx-[20vw] h-[75px] py-2 bg-custom-blue"
                    onClick={()=>{
                        setIsOpenCustomMessage(true)//se abre el modal de confirmación de mensaje
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