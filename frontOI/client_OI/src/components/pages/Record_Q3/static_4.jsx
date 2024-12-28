import { LuEye } from "react-icons/lu";
import { Button } from "@nextui-org/react";
import {  
    useDisclosure
} from "@nextui-org/modal";
import React, { useState } from "react";
import CustomAlert from "../../shared/CustomAlert";
  //Componente
import {meterColumns, meterDataTest} from "../../../utils/tests/data"  //"../../utils/tests/data";
import { TbTableShortcut } from "react-icons/tb";
import ModalData from "../../shared/ModalData";
import TableVisualInspection from "../../visual_inspection/TableVisualInspection";
import { useNavigate } from "react-router-dom";

import apiService from "../../../hook/services/apiService";

//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["meter_id", "state", "result"];

export default function Static_4_Q3() {

    const navigate = useNavigate()

    const [isChanged, setIsChanged] = useState(false)
    const [pruebaValue, setPruebaValue] = useState(null)
    const [visualInspection, setVisualInspection] = useState({})
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [popUpData,setPopUpData] = React.useState(null);
    const [customMessage, setCustomMessage] = React.useState(null);
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
    const [isLoading, setIsLoading] = React.useState(true);
    //constante con los id de los medidores seleccionados
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    //Variable que establece la columna y el orden de filtrado para la consulta, es un JSON con el nombre de columna
    //y el orden (ascending, descending)
    //Constante para establecer las columnas visibles puesto que estas son dinamicas
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    //En esta variable se guardarán los medidores que se extraigan de la API
    const [meters, setMeters] = React.useState([]);
    //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
    const [metersLength, setMetersLength] = React.useState(meterDataTest.length);
    //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
    const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";

    const [pruebasUpdated, setPruebasUpdated] = React.useState([]);

    const [pruebas, setPruebas] = React.useState([])

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient
    //Función para obtener los gateways del autocomplete

    //Función para obtener los gateways del autocomplete
    React.useMemo(() => {
  
    //Al estar ejecutando el fetch activamos el loading de la data
        //setIsLoading(true);
        const fetchPruebas = async () => {
        try {
        //inizializamos los parametros de consultas a la API de consumo
        //console.log("No ha salido")
        //const params = {
            // q: filterValue,
            //page:1,
            //page_size : 10
        //};

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

    //Función para obtener los gateways del autocomplete
    React.useMemo(() => {
  
      //Al estar ejecutando el fetch activamos el loading de la data
      //setIsLoading(true);
      const fetchMedidoresAsociados = async () => {
      try {
      //inizializamos los parametros de consultas a la API de consumo
      //console.log("No ha salido")
      //const params = {
          // q: filterValue,
          //page:1,
          //page_size : 10
      //};
      
      const responses = await Promise.all(pruebas.map(async (prueba) => {
          const medidores = await apiService.getAll(`pruebas/pruebas/${prueba.id}/medidores-asociados/`);
          
          return {
              ...prueba,
              medidores: medidores
          };
      }));
      console.log("Prueba: ", responses);
      setPruebasUpdated(responses);
      setMeters(responses[0] ? responses[0].medidores : null)
      setMeters(
        responses[0]
          ? responses[0].medidores.map((meter) => ({
              ...meter,
              result: meter.state === "Sin observaciones" || meter.state === "En Evaluación" ? "Apto" : "No Apto",
            }))
          : null
      );
      const visualInspectionObj = responses[0] ? responses[0].medidores.reduce((acc, item) => {
        acc[item.meter_id] = { value: item.state}; // Establecer valor por defecto
        return acc;
      }, {}):null;
      // Actualizar el estado visualInspection
      setVisualInspection(visualInspectionObj);

      setMetersLength(responses[0] ? responses[0].medidores.length : null);

      } catch (error) {
          //En caso de error en el llamado a la API se ejecuta un console.error
          console.error('Error fetching initial meters:', error);
      } finally {
          //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
          //console.log("salio");
      }
      }

      fetchMedidoresAsociados();
      }
    ,[pruebas]);

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
            ? { ...meter, result: newValue } // Actualiza solo el que coincide
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

    const handleConfirm = async () => {
      // Actualizar todos los medidores con el valor de `visualInspection` correspondiente
      const medidores = meters.map((meter) => ({
        ...meter,
        state: visualInspection[meter.meter_id].value, // Asigna el valor de visualInspection para cada meter
      }))
      const apiResult = await handleUpdateMeter(medidores); // Llama a handleUpdateMeter como callback

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
        q1: {
          record_li: item.q1?.record_li || 0, // Valor por defecto
          record_lf: item.q1?.record_lf || 0, // Valor por defecto
          reference_volume: item.q1?.reference_volume || 0, // Valor por defecto
        },                
        q2: {
          record_li: item.q2?.record_li || 0, // Valor por defecto
          record_lf: item.q2?.record_lf || 0, // Valor por defecto
          reference_volume: item.q2?.reference_volume || 0, // Valor por defecto
        },
        q3: {
          record_li: item.q3?.record_li || 0, // Valor por defecto
          record_lf: item.q3?.record_lf || 0, // Valor por defecto
          reference_volume: item.q3?.reference_volume || 0, // Valor por defecto
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

    const confirmationMessage = React.useMemo(() => {
        return isOpenCustomMessage === true ? (
          <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={"/client/Q3/static_5"}
            handleConfirm = {handleConfirm}
            />
        ) : null
      }, [isOpenCustomMessage]);

  React.useEffect(() => {
    pruebaValue === '' ? setIsChanged(false) : setIsChanged(true)
  },[pruebaValue])

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

    return (
        <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Inspección visual</span>
          <span className="font-mulisg font-semibold text-opacity-text ">Sesion iniciada en Julio 24, 2024</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 pt-2">
            <div className="col-span-3 bg-white shadow-lg px-7 flex flex-col space-x-2 rounded-[20px] items-center py-4">
              <span className="font-inter text-center w-full">Usted se encuentra en la prueba No.</span>
              <span className="font-teko text-[32px] font-semibold w-full text-center">{pruebas[0] ? pruebas[0].nombre : ''}</span>
            </div>
            <div className="col-span-1 w-full justify-center place-items-center flex">
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
          {/* <div>
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
            </div> */}
          <div className="w-full flex flex-col flex-grow mb-5 h-[600px] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
            <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Inspección visual</span>
            <div className="w-5/6 rounded-[20px] bg-custom-blue h-2 mb-2 text-white">'</div>
            <div className="w-full flex h-[60svh] my-3">
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
                navigate("/client/static_3")
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