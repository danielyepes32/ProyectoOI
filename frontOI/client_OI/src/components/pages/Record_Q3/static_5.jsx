import { LuEye } from "react-icons/lu";
import { Button} from "@nextui-org/react";
import {  
    useDisclosure
} from "@nextui-org/modal";
import React, { useState } from "react";
import CustomAlert from "../../shared/CustomAlert";
import {meterColumns, meterDataTest} from "../../../utils/tests/data"  //"../../utils/tests/data";
import { MdOutlineWbIncandescent } from "react-icons/md";
import { TbTableShortcut } from "react-icons/tb";
import ModalData from "../../shared/ModalData";
import TableVisualInspection from "../../visual_inspection/TableVisualInspection";
import { useNavigate } from "react-router-dom";
import apiService from "../../../hook/services/apiService";

//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["meter_id", "drain", "obs"];

export default function Static_5_Q3() {

    const navigate = useNavigate()

    const [isChanged, setIsChanged] = useState(false)
    const [visualInspection, setVisualInspection] = useState({})
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

    const [pruebas, setPruebas] = React.useState([])

    const [confirm, setConfirm] = React.useState(false)

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient

    React.useEffect(() => {
  
      //Al estar ejecutando el fetch activamos el loading de la data
      //setIsLoading(true);
      const fetchPruebas = async () => {
      try {
      
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

      fetchPruebas();
  }, []);

  React.useEffect(() => {

    //Al estar ejecutando el fetch activamos el loading de la data
    setIsLoading(true);
    const fetchMetersPrueba = async () => {
    try {
    
    const response = await apiService.getMedidoresPrueba();
    // Suponiendo que setPruebas es un setter de un estado que contiene un array
    setMeters(response)
    const visualInspectionObj = response.reduce((acc, item) => {
      acc[item.meter_id] = { value: "Sin inspección" }; // Establecer valor por defecto
      return acc;
    }, {});
    // Actualizar el estado visualInspection
    setVisualInspection(visualInspectionObj);


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

    //Esta función se usa para calcular las columnas que se etsablecen como visibles
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return meterColumns;

        return meterColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    // Función para actualizar el value de un objeto específico
    const updateValue = (key, newValue) => {
      setVisualInspection(prevData => ({
        ...prevData, // Mantiene los datos existentes
        [key]: { value: newValue } // Actualiza solo el objeto específico
      }));
    };

        // Función para actualizar el value de un objeto específico
    const updateResult = (key, newValue) => {
      setMeters((prevMeters) => 
        prevMeters.map((meter) => 
          meter.meter_id === key
            ? { ...meter, obs: newValue } // Actualiza solo el que coincide
            : meter // Deja el resto igual
        )
      );
    };

    const addKey = (newKey) => {
      setSelectedKeys(() => {
        const updatedSet = new Set(selectedKeys);
        updatedSet.add(newKey); // Agregar el nuevo valor al Set
    
        return updatedSet; // Devolver el nuevo Set actualizado
      });
    };

    React.useMemo(()=>{
      if(confirm){
        const handleUpdateMeter = async () => {
          try {
            const updates = meters[0];  // Aquí defines el campo que quieres actualizar
            const response = await apiService.updateMetersPrueba(meters[0].meter_id, updates);  // Llamada a la función updateMeter
            console.log('Meter updated:', response);  
          } catch (error) {
            console.error(error); 
          } 
          }
    
          handleUpdateMeter()
      }else{null}
      },[confirm])
  
      const handleConfirm = () => {
        // Actualizar todos los medidores con el valor de `visualInspection` correspondiente
        setMeters((prevMeters) =>
          prevMeters.map((meter) => ({
            ...meter,
            drain: visualInspection[meter.meter_id].value, // Asigna el valor de visualInspection para cada meter
          }))
        )
        setConfirm(true)
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
        console.log("CustomMessage: ", isOpenCustomMessage)
        return isOpenCustomMessage === true ? (
          <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={"/client/Q3/static_6"}
            handleConfirm={handleConfirm}
            />
        ) : null
      }, [isOpenCustomMessage]);

  const tableRow = React.useMemo(() => {
    return(
      <TableVisualInspection
        selectedKeys={selectedKeys}
        headerColumns={headerColumns}
        meters={meters}
        loadingState={loadingState}
        visualInspection={visualInspection}
        updateResult={updateResult}
        updateValue={updateValue}
        addKey={addKey}
      />
    )
  }, [meters, headerColumns, visualInspection])

  console.log(meters)

    return (
        <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Ensayo de presión estática</span>
          <span className="font-mulisg font-semibold text-opacity-text ">Sesion iniciada en Julio 24, 2024</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 pt-2">
            <div className="col-span-3 bg-white shadow-lg px-7 flex flex-col space-x-2 rounded-[20px] items-center py-4">
              <span className="font-inter text-center w-full">Usted se encuentra en la prueba No.</span>
              <span className="font-teko text-[32px] font-semibold w-full text-center">{pruebas[0]}</span>
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
          {/*
          //Reparar componente una vez termine la presentación con Marco
          <div>
                <Button 
                    className="flex justify-between place-items-center bg-custom-blue w-full mt-[3vh]"
                    onClick={onOpen}
                    endContent={<TbTableShortcut className="w-auto justify-end text-right text-white h-[40px]"/>}
                    classNames={{
                        base:"bg-red-100",
                        startContent: "bg-red-100"
                    }}
                    >
                    <span className="font-inter text-[20px] text-center text-white py-2">Códigos de inspección</span>
                </Button>
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
                    <span className="font-inter text-[20px] text-center text-white py-2">Cuadro descriptivo</span>
                </Button>
            </div>
            */}
          <div className="w-full flex flex-col flex-grow mb-5 h-[300px] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
            <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Inspección visual</span>
            <div className="w-5/6 rounded-[20px] bg-custom-blue h-2 mb-2 text-white">'</div>
            <div className="w-full flex h-[30svh] my-3">
              {tableRow}
            </div>
          </div>
          <div className="flex flex-grow flex-col bg-white rounded-[20px] px-5 py-5 shadow-sm mb-5">
            <span className="font-mulish font-semibold text-center text-[24px]">Terminar proceso de inspección visual</span>
            <Button
              className="bg-custom-blue mt-1"
              onClick={()=>{
                setIsOpenCustomMessage(true)
                setIsChanged(!isChanged)
              }}
              >
              <span className="font-inter text-white text-center text-[16px]">Confirmar</span>
            </Button>
            <Button
              className="mt-2 "
              onClick={()=>{
                navigate("/client/static_4")
                //setIsOpenCustomMessage(true)
                //setIsChanged(!isChanged)
              }}
              >
              <span className="font-inter text-white text-center text-[16px]">regresar</span>
            </Button>
          </div>
        </div>
    )
}