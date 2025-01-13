import { LuEye } from "react-icons/lu";
import { Button, Input} from "@nextui-org/react";
import {  
    useDisclosure
} from "@nextui-org/modal";
import React, { useState } from "react";
import CustomAlert from "../../shared/CustomAlert";
import {meterColumns} from "../../../utils/tests/data"  //"../../utils/tests/data";

import { IoSpeedometerOutline } from "react-icons/io5";
import { MdOutlineWbIncandescent } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

import ModalData from "../../shared/ModalData";
import TableRecordInspection from "../../record_inspection/TableRecordInspection";
import apiService from "../../../hook/services/apiService";
import  DateService  from "../../../hook/services/dateService.js"
//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["meter_id", "num", "record_li"];

export default function Static_6_Q3() {

    const [isChanged, setIsChanged] = useState(false)
        const [initialPreassure, setInitialPreassure] = React.useState(null);
        const [endPreassure, setEndPreassure] = React.useState(null);
    const [seconds, setSeconds] = useState(0);
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
    const [meters, setMeters] = React.useState([]);
    //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
    const [metersLength, setMetersLength] = React.useState(null);
    //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
    const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";

    const[confirm , setConfirm] = React.useState(false)

    const [pruebas, setPruebas] = React.useState([])

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient
    React.useMemo(() => {
      // Inicia un intervalo que incrementa el tiempo cada segundo
      //const interval = setInterval(() => {
        //setSeconds((prevSeconds) => prevSeconds + 1);
      //}, 1000);
  
      // Limpia el intervalo al desmontar el componente
      //return () => clearInterval(interval);
    }, []);

    React.useMemo(() => {
  
    //Al estar ejecutando el fetch activamos el loading de la data
      //setIsLoading(true);
      const fetchPruebas = async () => {
      try {
      //inizializamos los parametros de consultas a la API de consumo
        const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
        
        const response = await apiService.getAll("pruebas/pruebas/by-orden/", { orden_id: sessionData.selectedOrder.nombre_orden });
        // Suponiendo que setPruebas es un setter de un estado que contiene un array
        setPruebas(response);
        console.log(response)
        //setSelectedKeys(new Set([response[0].nombre]))
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
      }
  , []);

    React.useMemo(() => {

      //Al estar ejecutando el fetch activamos el loading de la data
      setIsLoading(true);
      const fetchMetersPrueba = async () => {
      try {
      
      const responses = await Promise.all(pruebas.map(async (prueba) => {
        const medidores = await apiService.getAll(`pruebas/pruebas/${prueba.id}/medidores-asociados/`);
        
        return {
            ...prueba,
            medidores: medidores
        };

      }));
      const filtrados = responses[0] ? responses[0].medidores.filter(item => item.result !== "No apto" && item.obs !== "No conforme") : null;
      // Suponiendo que setPruebas es un setter de un estado que contiene un array
      console.log(filtrados)
      setMeters(filtrados ? filtrados : null)
      // Actualizar el estado visualInspection
      setMetersLength(filtrados ? filtrados.length : null);

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
    }, [pruebas]);

    // Calcula los minutos y segundos a partir del total de segundos
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;

    //Esta función se usa para calcular las columnas que se etsablecen como visibles
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return meterColumns;

        return meterColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    const validateInput = (pruebaValue) => pruebaValue ? pruebaValue.match(/^\d{1,3}(\.\d{0,2})?$/) : "";

    // Función para actualizar el value de un objeto específico
    const updateResult = (key, newValue) => {
      setMeters((prevMeters) =>
        prevMeters.map(({ meter_id, q3, ...rest }) =>
          meter_id === key
            ? {
                ...rest,
                meter_id,
                q3: { ...q3, record_li: Number(newValue) }, // Actualiza solo record_li
              }
            : { meter_id, q3, ...rest } // Devuelve el medidor sin cambios
        )
      );
    };

        // Función para actualizar el value de un objeto específico
    const updateValidate = (key, newValue) => {

      const validate = newValue === "" ? true : validateInput(newValue) ? false : true;
      //!validate ? addKey(key) : removeKey(key)
      setMeters((prevMeters) => 
        prevMeters.map((meter) => 
          meter.meter_id === key
            ? { ...meter, isInvalid: validate} // Actualiza solo el que coincide
            : meter // Deja el resto igual
        )
      );
    };

    // Función para actualizar el value de un objeto específico
    const handleEnterAction = (key, newValue) => {

      const validate = newValue === "" ? true : validateInput(newValue) ? false : true;
      !validate ? addKey(key) : removeKey(key)
    };

    const addKey = (newKey) => {
      setSelectedKeys(() => {
        const updatedSet = new Set(selectedKeys);
        updatedSet.add(newKey); // Agregar el nuevo valor al Set
    
        return updatedSet; // Devolver el nuevo Set actualizado
      });
    };

    const removeKey = (keyToRemove) => {

      setSelectedKeys(() => {
        const updatedSet = new Set(selectedKeys);
        updatedSet.delete(keyToRemove); // Eliminar el valor del Set
    
        return updatedSet; // Devolver el Set actualizado
      });
    };
    
    const handleConfirm = async () => {
      console.log("Entra")
      // Actualizar todos los medidores con el valor de `visualInspection` correspondiente
      const apiResult = await handleUpdateMeter(meters); // Llama a handleUpdateMeter como callback

      return apiResult; //Validar avanzar de vista
    };

    const handleUpdateMeter = async (medidores) => {
      try {

      // Construir el payload con los medidores
      const payload = {
        medidores: medidores.map((item) => ({
        id: item.id, // Asegúrate de que 'meter_id' corresponde a 'id' en el payload
        state: item.state || "En Evaluación", // Estado por defecto
        obs: item.obs || "Sin observaciones", // Observación por defecto
        result: item.result || "Apto", // Resultado por defecto
        drain: item.drain || 'En Evaluación', // Valor por defecto,
        q1: {
          record_li: item.q1?.record_li || 0, // Valor por defecto
          record_lf: item.q1?.record_lf || 0, // Valor por defecto
          reference_volume: item.q1?.reference_volume || 0, // Valor por defecto
          presion_entrada: item.q1?.presion_entrada || 0, // Valor por defecto
          presion_salida: item.q1?.presion_salida || 0, // Valor por defecto
        },                
        q2: {
          record_li: item.q2?.record_li || 0, // Valor por defecto
          record_lf: item.q2?.record_lf || 0, // Valor por defecto
          reference_volume: item.q2?.reference_volume || 0, // Valor por defecto
          presion_entrada: item.q2?.presion_entrada || 0, // Valor por defecto
          presion_salida: item.q2?.presion_salida || 0, // Valor por defecto
        },
        q3: {
          record_li: item.q3?.record_li || 0, // Valor por defecto
          record_lf: item.q3?.record_lf || 0, // Valor por defecto
          reference_volume: item.q3?.reference_volume || 0, // Valor por defecto
          presion_entrada: item.q3?.presion_entrada || 0, // Valor por defecto
          presion_salida: item.q3?.presion_salida || 0, // Valor por defecto
        },
        })),
      };

      payload.medidores.map(async (item, index) => {
        const singlePayload = { medidores: [item] };
        await apiService.updateMetersPrueba(pruebas[0].id, singlePayload);
        console.log(`Payload for index ${index}: `, singlePayload);
      })

      console.log("Payload: ", payload)
      // alert("Medidores actualizados correctamente");
      return true;    
      // Llamada al servicio de la API 
      } catch (error) {
      console.error('Error updating meters:', error);
      alert("Error al actualizar los medidores, intente de nuevo");
      return false;
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
        console.log("CustomMessage: ", isOpenCustomMessage)
        return isOpenCustomMessage === true ? (
          <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={"/client/Q3/static_6_5"}
            handleConfirm={handleConfirm}
            />
        ) : null
      }, [isOpenCustomMessage]);

  const tableRow = React.useMemo(() => {
    return (
      <TableRecordInspection
        selectedKeys={selectedKeys}
        headerColumns={headerColumns}
        meters={meters}
        loadingState={loadingState}
        //visualInspection={visualInspection}
        updateResult={updateResult}
        //updateValue={updateValue}
        //addKey={addKey}
        handleEnterAction = {handleEnterAction}
        updateValidate={updateValidate}
        selectedQ={'q3'}
      />
    );
  }, [meters, headerColumns ,selectedKeys])

    return (
        <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Ensayo de errores de indicación</span>
          <span className="font-mulisg font-semibold text-opacity-text ">Sesion iniciada en {DateService.getCurrentDate()}</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 pt-2">
            <div className="col-span-3 bg-white shadow-lg px-4 flex justify-between rounded-[30px] items-center">
              <span className="font-inter text-center w-full pr-2">Usted se encuentra en la prueba</span>
              <span className="font-teko text-[48px] font-semibold w-auto text-right">Q3</span>
            </div>
            <div className="col-span-1 w-full flex justify-center place-items-center">
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
            //Reparar componente una vez termine reunión de presentación 
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
            */}

          <div className="w-full flex flex-col flex-grow mb-5 h-[600px] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
            <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Primela lectura</span>
            <div className="w-5/6 rounded-[20px] bg-custom-blue h-2 mb-2 text-white">'</div>
            <div className="w-full flex h-[60svh] my-3">
                {tableRow}
            </div>
          </div> 
          <div className="flex justify-between w-full mb-4 h-auto space-x-2">
            <div className="w-full h-auto bg-white rounded-[20px] shadow-sm flex flex-col justify-between py-2">
              <span className="font-inter font-bold text-center w-full text-[15px] h-auto">Presiones estáticas</span>
              <div className="flex justify-between">
                <IoSpeedometerOutline className="w-full h-[12vh] p-4"/>
                <div className="flex flex-col w-full place-items-center justify-center px-4">
                  <span className="text-[18px] font-inter text-gray-300">Entrada</span>
                  <Input 
                    className="text-[16px] font-teko font-semibold"
                    placeholder="Presión de entrada"
                    type="number"
                    value={initialPreassure}
                    onValueChange={(value) => {
                      value.length < 5 ? setInitialPreassure(value) : null;
                    }}
                    classNames={
                      {
                        input: "w-full h-auto text-center bg-white border-none text-[16px] font-teko font-semibold",
                      }
                    }
                  />
                  <span className="text-[18px] font-inter text-gray-300">Salida</span>
                  <Input 
                    className="text-[16px] font-teko font-semibold"
                    placeholder="Presión de entrada"
                    type="number"
                    value={endPreassure}
                    onValueChange={(value) => {
                      value.length < 5 ? setEndPreassure(value) : null;
                    }}
                    classNames={
                      {
                        input: "w-full h-auto text-center bg-white border-none text-[16px] font-teko font-semibold",
                      }
                    }
                  />
                </div>
              </div>
            </div>
          </div> 
          <div className="flex flex-grow flex-col bg-white rounded-[20px] px-5 py-5 shadow-sm mb-5">
            <span className="font-mulish font-semibold text-center text-[24px]">Pasar a presiones dinámicas</span>
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