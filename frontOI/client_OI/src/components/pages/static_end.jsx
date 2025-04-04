import { LuEye } from "react-icons/lu";
import { Button} from "@nextui-org/react";
import {
    useDisclosure
} from "@nextui-org/modal";
import React, { useState } from "react";
import CustomAlert from "../shared/CustomAlert.jsx";
import {meterColumns, meterDataTest} from "../../utils/tests/data"  //"../../utils/tests/data";
import TableResumeInspection from "../resume/TableResumeInspections.jsx";
import ModalData from "../shared/ModalData";
import apiService from "../../hook/services/apiService";
import DateService  from "../../hook/services/dateService.js"
//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["meter_id", "q3", "q2", "q1", "resume", "actions"];

export default function Static_end() {

    const selected_prueba = JSON.parse(localStorage.getItem('selected_prueba'))
    const typePrueba = localStorage.getItem('typePrueba')

    const [isChanged, setIsChanged] = useState(false)
    const [initialPreassure, setInitialPreassure] = React.useState(null);
    const [endPreassure, setEndPreassure] = React.useState(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [popUpData,setPopUpData] = React.useState(null);
    const [customMessage, setCustomMessage] = React.useState(typePrueba === "nc" ? "¿Desea iniciar otra bancada?" : "");
    const [selectedMeter, setSelectedMeter] = React.useState(null);
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

    const [confirm, setConfirm] = React.useState(false)

    const [pruebas, setPruebas] = React.useState([])

    const [volumeValue, setVolumeValue] = React.useState()

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient
    React.useMemo(() => {
  
    //Al estar ejecutando el fetch activamos el loading de la data
      //setIsLoading(true);
      const fetchPruebas = async () => {
      try {
      //inizializamos los parametros de consultas a la API de consumo
        const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
        
      const user = JSON.parse(localStorage.getItem("user")); 
      const response = await apiService.getAll("pruebas/pruebas/by-orden/", { orden_id: sessionData.selectedOrder.nombre_orden, usuario: user.id, estado: 'ABIERTA' });

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

      console.log('Respuestas ', responses)
      const prueba_search = selected_prueba != null && selected_prueba != {} && selected_prueba.length > 0 ? responses.find(prueba => prueba.id === selected_prueba.id) : responses[0]

      console.log("pruebaSearch: ", prueba_search)
      const filtrados = prueba_search ? prueba_search.medidores : null;
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
                q3: { ...q3, record_lf: Number(newValue) }, // Actualiza solo record_li
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
      console.log("Se ejecuto el rmove")
      setSelectedKeys(() => {
        const updatedSet = new Set(selectedKeys);
        updatedSet.delete(keyToRemove); // Eliminar el valor del Set
    
        return updatedSet; // Devolver el Set actualizado
      });
    };
    
  
    //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
    const modal = React.useMemo(() => {
        return (
          <ModalData
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            popUpData={popUpData}
            selectedMeter={selectedMeter}
          />
        );
    }, [isOpen]);
  
    const handleCancel = async () => {
      console.log("Entra")
      // Actualizar todos los medidores con el valor de `visualInspection` correspondiente
      const apiResult = await handleUpdateCancelMeter(meters); // Llama a handleUpdateMeter como callback

      return apiResult; //Validar avanzar de vista
    };

    const handleUpdateCancelMeter = async (medidores) => {
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
          presion_salida: item.q1?.presion_entrada || 0, // Valor por defecto
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

      const count_secuencia = localStorage.getItem("count_secuencia");

      const puedeAvanzar = parseInt(count_secuencia) === 14 || parseInt(count_secuencia) === 12; 

      console.log("Puede avanzar: ", puedeAvanzar)

      if (!puedeAvanzar) {
        console.warn("No se puede avanzar: hay procesos pendientes");
        throw new Error("No se puede avanzar: La prueba tiene procesos pendientes")
      }
      
      // Llama a la API para actualizar los medidores
      const prueba_search = selected_prueba && selected_prueba != {} && selected_prueba.length > 0 ? pruebas.find(prueba => prueba.id === selected_prueba.id) : pruebas[0]
      // pruebas.find(prueba => prueba.id === selected_prueba.id)
      
      console.log("Prueba search: ", prueba_search)

      console.log("Iniciando actualización de medidores...");

      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const promises = payload.medidores.map(async (item, index) => {
          const singlePayload = { estado: "CERRADA" , medidores: [item] };
  
          console.log(`Payload for index ${index}:`, singlePayload);
  
          return apiService.updatePrueba(prueba_search.id, singlePayload);
      });


      const promiese_meters = medidores.map(meter => {
        if (!meter.medidor.id) {
            console.error("Error: Medidor inválido, falta ID:", meter.medidor);
            throw new Error(`Medidor inválido detectado: ${JSON.stringify(meter.medidor)}`);
        }

        const metersPayload = {
            ...meter.medidor,
            registro_tecnico_id: meter.medidor.registro_tecnico.id,
            estado: "Evaluado",
        };

        console.log(`Actualizando estado de medidor ID: ${meter.medidor.id}`, metersPayload);

        return apiService.updateMetersData(meter.medidor.id, metersPayload)
            .catch(error => {
                console.error(`Error en updateMetersData para ID ${meter.medidor.id}:`, error);
                return Promise.reject(error);
            });
      });
  
      const [resultsPruebas, resultsMeters] = await Promise.all([
          Promise.allSettled(promises),
          Promise.allSettled(promiese_meters)
      ]);
  
      console.log("Resultados Pruebas:", resultsPruebas);
      console.log("Resultados de la actualización de medidores:", resultsMeters);
  
        // Verificar errores en cada conjunto de promesas
        const failedPruebas = resultsPruebas.filter(result => result.status === "rejected");
        const failedMeters = resultsMeters.filter(result => result.status === "rejected");
    
        if (failedPruebas.length > 0 || failedMeters.length > 0) {
            console.error("Algunas promesas fallaron:");
            if (failedPruebas.length > 0) console.error("Errores en Pruebas:", failedPruebas);
            if (failedMeters.length > 0) console.error("Errores en Medidores:", failedMeters);
            throw new Error("Algunas solicitudes no se completaron correctamente.");
        }
    
        console.log("Todas las promesas se resolvieron correctamente.");
        return true; // Indica que todo salió bien
      // Llamada al servicio de la API 
      } catch (error) {
      console.error('Error updating meters:', error);
      alert("Error al actualizar los medidores, intente de nuevo");
      return false;
      }
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
          presion_salida: item.q1?.presion_entrada || 0, // Valor por defecto
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
      const count_secuencia = localStorage.getItem("count_secuencia");

      const puedeAvanzar = parseInt(count_secuencia) === 14 || parseInt(count_secuencia) === 12; 

      if (!puedeAvanzar) {
        console.warn("No se puede avanzar: hay procesos pendientes");
        throw new Error("No se puede avanzar: La prueba tiene procesos pendientes")
      }
      
      // Llama a la API para actualizar los medidores
      const prueba_search = selected_prueba && selected_prueba != {} && selected_prueba.length > 0 ? pruebas.find(prueba => prueba.id === selected_prueba.id) : pruebas[0]
      // pruebas.find(prueba => prueba.id === selected_prueba.id)
      
      console.log("Prueba search: ", prueba_search)

      console.log("Iniciando actualización de medidores...");

      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const promises = payload.medidores.map(async (item, index) => {
          const singlePayload = { estado: "CERRADA" , medidores: [item] };
  
          console.log(`Payload for index ${index}:`, singlePayload);
  
          return apiService.updatePrueba(prueba_search.id, singlePayload);
      });


      const promiese_meters = medidores.map(meter => {
        if (!meter.medidor.id) {
            console.error("Error: Medidor inválido, falta ID:", meter.medidor);
            throw new Error(`Medidor inválido detectado: ${JSON.stringify(meter.medidor)}`);
        }

        const metersPayload = {
            ...meter.medidor,
            registro_tecnico_id: meter.medidor.registro_tecnico.id,
            estado: "Evaluado",
        };

        console.log(`Actualizando estado de medidor ID: ${meter.medidor.id}`, metersPayload);

        return apiService.updateMetersData(meter.medidor.id, metersPayload)
            .catch(error => {
                console.error(`Error en updateMetersData para ID ${meter.medidor.id}:`, error);
                return Promise.reject(error);
            });
      });
  
      const [resultsPruebas, resultsMeters] = await Promise.all([
          Promise.allSettled(promises),
          Promise.allSettled(promiese_meters)
      ]);
  
      console.log("Resultados Pruebas:", resultsPruebas);
      console.log("Resultados de la actualización de medidores:", resultsMeters);
  
        // Verificar errores en cada conjunto de promesas
        const failedPruebas = resultsPruebas.filter(result => result.status === "rejected");
        const failedMeters = resultsMeters.filter(result => result.status === "rejected");
    
        if (failedPruebas.length > 0 || failedMeters.length > 0) {
            console.error("Algunas promesas fallaron:");
            if (failedPruebas.length > 0) console.error("Errores en Pruebas:", failedPruebas);
            if (failedMeters.length > 0) console.error("Errores en Medidores:", failedMeters);
            throw new Error("Algunas solicitudes no se completaron correctamente.");
        }
    
        console.log("Todas las promesas se resolvieron correctamente.");
      
      if (typePrueba !== "nc"){
        const index = selected_prueba && selected_prueba != {} && selected_prueba.length > 0 ? pruebas.findIndex(prueba => prueba.id === selected_prueba.id) : 0;

        const next_prueba = index !== -1 && index + 1 < pruebas.length
            ? pruebas[index + 1]
            : null;// Si no hay siguiente prueba, devuelve null

        const selected = next_prueba ? {
          id: next_prueba.id,
          nombre: next_prueba.nombre
        } : {}

        localStorage.setItem("selected_prueba", JSON.stringify(selected))
        localStorage.setItem("count_secuencia", "0")

        next_prueba ? alert("Se avanzará a la siguiente bancada") : alert("Ya terminó con todas las pruebas")
        console.log("Siguiente prueba: ", next_prueba?.nombre)  
      }else{
        alert("Se se avanzará a una nueva bancada")
        localStorage.setItem("count_secuencia", "0")
      }
        return true; // Indica que todo salió bien
      // Llamada al servicio de la API 
      } catch (error) {
      console.error('Error updating meters:', error);
      alert("Error al actualizar los medidores, intente de nuevo");
      return false;
      }
    };

    const depuracion = () => {
      const index = selected_prueba && selected_prueba != {} && selected_prueba.length > 0 ? pruebas.findIndex(prueba => prueba.id === selected_prueba.id) : 0;

      const next_prueba = index !== -1 && index + 1 < pruebas.length
          ? pruebas[index + 1]
          : null;// Si no hay siguiente prueba, devuelve null

      const selected = next_prueba ? {
        id: next_prueba.id,
        nombre: next_prueba.nombre
      } : {}

      console.log("Prueba seleccionada next: ", selected)
    }

    const routeRedirect = React.useMemo(() => {
      //console.log("Selected Prueba: ", selected_prueba)
      const index = selected_prueba && selected_prueba != {} && selected_prueba.length > 0 ? pruebas.findIndex(prueba => prueba.id === selected_prueba.id) : 0;
    
      const next_prueba = index >= 0 && index + 1 < pruebas.length 
        ? pruebas[index + 1] 
        : null;

      console.log("NextRoute: ", next_prueba ? "/client/Q3/static_6" : "/client")
    
      return next_prueba ? "/client/Q3/static_6" : "/client"; // Devuelve el string directamente
    }, [pruebas, selected_prueba]);

    const confirmationMessage = React.useMemo(() => {
        return isOpenCustomMessage === true ? (
          <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={typePrueba === "nc" ? "/client/static_2_nc" : routeRedirect}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            typePrueba={typePrueba}
            />
        ) : null
      }, [isOpenCustomMessage]);

  const tableRow = React.useMemo(() => {
    return (
      <TableResumeInspection
        selectedKeys={selectedKeys}
        headerColumns={headerColumns}
        meters={meters}
        loadingState={loadingState}
        //visualInspection={visualInspection}
        updateResult={updateResult}
        //updateValue={updateValue}
        //addKey={addKey}
        setPopUpData={setPopUpData}
        onOpen={onOpen}
        updateValidate={updateValidate}
        handleEnterAction={handleEnterAction}
        selectedQ={"q3"}
        setSelectedMeter={setSelectedMeter}
      />
    );
  }, [meters, headerColumns ,selectedKeys])

  const handleVolumeChange = (event) => {
    const newValue = event.target.value;
    setVolumeValue(newValue);
  };

    // Función para aplicar el valor del input a todos los medidores visibles
    const applyVolumeToMeters = () => {
      if (!volumeValue || isNaN(volumeValue)) return; // Validación simple
  
      setMeters((prevMeters) =>
        prevMeters.map((meter) =>
          meter.meter_id === meter.meter_id
            ? {
                ...meter,
                q3: {
                  ...meter.q3,
                  reference_volume: Number(volumeValue),
                },
              }
            : meter
        )
      );
    };

    return (
        <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Ensayo de errores de indicación</span>
          <span className="font-mulisg font-semibold text-opacity-text ">Sesion iniciada en {DateService.getCurrentDate()}</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 pt-2">
            <div className="col-span-3 bg-white shadow-lg px-4 flex justify-between rounded-[30px] items-center">
              <span className="font-bold text-[18px] text-center w-full pr-2 py-2">Usted se encuentra en el resumen de la prueba</span>
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
          {/*
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
          {/*
          <div className="col-span-3 py-2 bg-white shadow-lg px-4 flex justify-between rounded-[25px] items-center mt-5">
            <label
              htmlFor="reference_volume_q3"
              className="text-gray-700 font-inter"
            >
              Volumen de referencia
            </label>
            <div className="flex items-center w-full place-content-center justify-center">
              <input
                id="reference_volume_q3"
                type="number"
                className="flex text-left w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none"
                placeholder="Ingrese su volumen"
                value={volumeValue} // Vincula al estado
                onChange={handleVolumeChange} // Actualiza el estado
              />
              <button
                className="bg-custom-blue text-center text-white w-1/3 h-1/2 rounded-2xl hover:bg-blue-600 transition-all"
                onClick={applyVolumeToMeters} // Aplica el cambio
              >
                <GiConfirmed className="text-center w-full h-1/6 p-2"/>
              </button>
            </div>
          </div>
          */}
          <div className="w-full flex flex-col mb-5 max-h-[60vh] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
            <span onClick={depuracion} className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Inspección final</span>
            <div className="w-5/6 rounded-[20px] bg-custom-blue h-2 mb-2 text-white"></div>
            <div className="w-full flex h-auto my-3">
                {tableRow}
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-[20px] px-5 py-5 shadow-sm mb-5">
            <span className="font-mulish font-semibold text-center text-[24px]">Terminar secuencia de la orden</span>
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