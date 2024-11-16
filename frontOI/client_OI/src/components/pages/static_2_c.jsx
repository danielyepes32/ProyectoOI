//Importaciones de elementos UI
//------------------------------------------------------------------
//Elemento Dropdown
import {  
    Dropdown,  
    DropdownTrigger,  
    DropdownMenu,  
    DropdownSection,  
    DropdownItem
} from "@nextui-org/dropdown";
//Disclosure para la ejecución del modal
import { 
    useDisclosure
} from "@nextui-org/modal";
//Botón de nextUI
import { Button } from "@nextui-org/react";
//-----------------------------------------------------------------
//Iconos de react
//-----------------------------------------------------------------
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { BsArrow90DegRight } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiPlayListAddFill } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
//----------------------------------------------------------------
//Componentes externos
//---------------------------------------------------------------
import CustomAlert from "../shared/CustomAlert";
import ModalData from "../shared/ModalData";
import apiService from "../../hook/services/apiService";
import  DateService  from "../../hook/services/dateService.js"
//---------------------------------------------------------------
//Funcionamiento
import React from "react";

export default function Static_2_c() {

    //Variable para guardar los identificadores seleccionados en el dropdown
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    //Variable para abrir el modal del componente ModalData
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    //Variable para abrir el modal de confirmación
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    //Variable para crear un mensaje personalizado para el modal de confirmación
    const [customMessage, setCustomMessage] = React.useState(null);
    //Variable para seleccionar que informaciuón se va a mostrar en el modal
    const [popUpData, setPopUpData] = React.useState(null)

    const[maxCapacity, setMaxCapacity] = React.useState(10)

    const[metersPrueba, setMetersPrueba] = React.useState([])

    const[metersLength, setMetersLength] = React.useState(null)

    const[ordenID, setOrdenID] = React.useState(null)

    const[pruebas, setPruebas] = React.useState([])

    //----------------------------------------------------------------------------------------------
    //Funciones que requieren un manejo de reenderizado y manejo de caché
    //------------------------------------------------------------------------------------------------

    //Función para obtener los gateways del autocomplete
    React.useEffect(() => {
  
    //Al estar ejecutando el fetch activamos el loading de la data
        //setIsLoading(true);
        const fetchOrders = async () => {
        try {
        //inizializamos los parametros de consultas a la API de consumo
        //console.log("No ha salido")
        //const params = {
           // q: filterValue,
            //page:1,
            //page_size : 10
        //};
        
        const response = await apiService.getOrdenes();
        // Suponiendo que setPruebas es un setter de un estado que contiene un array
        setPruebas(prevState => [response[0].identificador]);
            //usamos el componente "count" de la consulta para establecer el tamaño de los registros
        } catch (error) {
            //En caso de error en el llamado a la API se ejecuta un console.error
            console.error('Error fetching initial meters:', error);
        } finally {
            //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
            //console.log("salio");
        }
        }

        fetchOrders();
      }, []);

    React.useEffect(() => {

    //Al estar ejecutando el fetch activamos el loading de la data
        //setIsLoading(true);
        const fetchMetersPrueba = async () => {
        try {
        
        const response = await apiService.getMedidoresPrueba();
        // Suponiendo que setPruebas es un setter de un estado que contiene un array
        setMetersPrueba(response)
        setMetersLength(response.length);
            //usamos el componente "count" de la consulta para establecer el tamaño de los registros
        } catch (error) {
            //En caso de error en el llamado a la API se ejecuta un console.error
            console.error('Error fetching initial meters:', error);
        } finally {
            //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
            //console.log("salio");
        }
        }

        fetchMetersPrueba();
        }, []);


    //Se agrupan y formatean los datos seleccionados en el dropdownBox
    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );

    // Función para calcular los IDs de las pruebas
    {/*Agregar esta función después para generar los IDs de prueba de una orden*/}
    {/*
    const generateTestIds = () => {
        const testsCount = Math.ceil(metersLength / maxCapacity); // Redondeo hacia arriba

        // Generamos el identificador con tantos '-000n' como pruebas necesarias
        const ids = Array.from({ length: testsCount }, (_, index) => 
        `${ordenID}-000${index + 1}`
        );

        return ids;
    };
    */}
    // useEffect para ejecutar generateTestIds solo al cargar la vista
    React.useEffect(() => {
        //const ids = generateTestIds();
        //setPruebas(ids); // Almacena los IDs en el estado
        setSelectedKeys(new Set([pruebas[0]]))
    }, [pruebas]); // Arreglo de dependencias vacío

    //Modal para mostrar datos de medidores disponibles en el correlativo
    const modal = React.useMemo(() => {
        return (
            <ModalData
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                popUpData={popUpData}
                meters={metersPrueba}
            />
        );
    }, [isOpen]);//Se ejecuta cada que cambia el valor de isOpen

    function handleLeftKey() {
        console.log(selectedKeys)
        const currentIndex = pruebas.indexOf(selectedKeys.anchorKey ? selectedKeys.anchorKey : selectedKeys);
        
        // Verifica si hay un elemento a la izquierda del actual
        if (currentIndex > 0) {
          setSelectedKeys(pruebas[currentIndex - 1]);
        } else {
          // Si `selectedKeys` está en el primer elemento, no hace nada o puedes definir un comportamiento.
          console.log("No hay un valor a la izquierda");
        }
      }

      function handleRightKey() {
        console.log(selectedKeys)
        const currentIndex = pruebas.indexOf(selectedKeys.anchorKey ? selectedKeys.anchorKey : selectedKeys);
        
        // Verifica si hay un elemento a la izquierda del actual
        if (currentIndex >= 0 && currentIndex < pruebas.length - 1) {
          setSelectedKeys(pruebas[currentIndex + 1]);
        } else {
          // Si `selectedKeys` está en el primer elemento, no hace nada o puedes definir un comportamiento.
          console.log("No hay un valor a la izquierda");
        }
      }

    //Modal para mostrar mensaje de confirmación
    const confirmationMessage = React.useMemo(() => {
        return isOpenCustomMessage === true ? (
          <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={"/client/static_3"}
            ></CustomAlert>
        ) : null
      }, [isOpenCustomMessage]);//Se ejecuta cada que cambia el valor de isOpen


    return(
        <>
        {confirmationMessage}
        <div className="w-screen h-[100svh] bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            <span className="font-mulish font-bold pt-5 text-[24px]">Ensayo de presión estática</span>
            <span className="font-mulisg font-semibold text-opacity-text">{DateService.getCurrentDate()}</span>
            <div className="w-full h-auto flex mt-8">
                <div className="bg-white w-4/6 h-full rounded-[20px] flex flex-col justify-center p-3">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] ml-4">Identificador de prueba</span>
                    <Dropdown
                        >
                        <DropdownTrigger>
                            <Button 
                            variant="bordered" 
                            className="capitalize mt-2 z-[0]"
                            >
                            <div className="flex justify-between w-full">
                                <span className="font-teko font-semibold text-black text-center text-[22px]">{selectedKeys}</span>
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
                        {pruebas.map((prueba, index) => (
                            <DropdownItem key={prueba} textValue={`Prueba: ${prueba}`}>
                                Prueba: {prueba}
                            </DropdownItem>
                        ))}
                        </DropdownMenu>
                    </Dropdown>
                    <div className="flex">
                        <Button
                            className="w-[30px] h-[20px] text-center flex justify-center mt-2 mx-auto"
                            onClick={handleRightKey}
                            >
                            <FaCaretDown className="text-custom-blue"/>
                        </Button>
                        <Button
                            className="w-[30px] h-[20px] text-center flex justify-center mt-2 mx-auto"
                            onClick={handleLeftKey}
                            >
                            <FaCaretUp className="text-custom-blue"/>
                        </Button>
                    </div>
                </div>
                <div className="ml-3 bg-white w-2/6 h-auto rounded-[20px] flex flex-col justify-center place-items-center">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] mt-3">Capacidad</span>
                    <span className="font-teko font-semibold text-[40px]">{maxCapacity}</span>
                </div>
            </div>
            <div>
                <Button 
                    className="flex justify-center place-items-center bg-custom-blue w-full my-[3vh]"
                    onClick={()=>{
                        setPopUpData("meter_c") //Se establece el valor de popUpData en meter_c
                        onOpen() //Se abre el modal
                    }}
                    endContent={<RiPlayListAddFill className="w-auto justify-end text-right text-white h-[40px]"/>}
                    classNames={{
                        base:"bg-red-100",
                        startContent: "bg-red-100"
                    }}
                    >
                    <span className="font-inter text-[14px] text-center text-white py-2">{`Medidores disponibles en orden (${metersLength}uds)`}</span>
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
                            <span className="w-full font-teko font-semibold text-[24px] text-left">{metersPrueba[0] === undefined ? 'No hay' : metersPrueba[0].meter_id}</span>
                        </div>
                        <div className="flex w-full justify-between place-items-center space-x-[3.5vw]">
                            <span className="w-auto font-inter font-semibold text-opacity-text text-left text-[18.4px]">Hasta:</span>
                            <span className="w-full font-teko font-semibold text-[24px] text-left">{metersPrueba[0] === undefined ? 'No hay' : metersPrueba[metersPrueba.length - 1].meter_id}</span>
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
                    <span className="font-teko font-semibold text-[40px]">{metersLength}</span>
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