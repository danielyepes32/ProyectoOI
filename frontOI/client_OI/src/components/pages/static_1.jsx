//Importación de Iconos
//-------------------------------------------------------------
import { LuEye } from "react-icons/lu";
import { FiTool } from "react-icons/fi";
import { Button } from "@nextui-org/react";
//Librería de UI NextUI, la librería usa un Disclosure para desplegar el modal y los eventos
//----------------------------------------------------------------------------------------
import {  
    useDisclosure
} from "@nextui-org/modal";
//Elementos de react necesarios
//-----------------------------------------------------------------
import React, { useState, useEffect } from "react";
//Elementos externos
//-------------------------------------------------------------
import CustomAlert from "../shared/CustomAlert"; //Modal externo para mensages de confirmación
import ModalData from "../shared/ModalData"; //Modal externo para el manejo de mensages y forms en el popUp

// Importacion de librerias utils de carga de datos
import  DateService  from "../../hook/services/dateService.js"
import apiService from "../../hook/services/apiService";

export default function Static_1() {
  //Variables del useDisclosure, este useDisclosure se usa solo para el popUp de datos 
  //isOpen define si se abre o no el modal
  //onOpen es la función useState que activa la variable isOpen
  //onOpenChanges es la función que hace el manejo de eventos en el popUp
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //Variable para definir que elementos va a mostrar el modal al activarse (instrumentos, banco, etc)
  const [popUpData,setPopUpData] = React.useState(null);
  //Esta variable se usa para el modal de los mensages de confirmación para setear un mensaje de confirmación customizado
  const [customMessage, setCustomMessage] = React.useState(null);
  //El useDisclosure se pueda usar una vez por reenderizado y objeto react, por lo que se activará el segundo popUp de una manera distinta
  //Esta variable setea en true o false en caso de querer activar el modal de confirmación
  const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
  //Variable para guardar la capicidad maxima de cada prueba
  const [maxCapacity, setMaxCapacity] = React.useState(0)
  //Variable para guardar las notaciones especiales
  const [specialAnotations, setSpecialAnotations] = React.useState(null)
  //Modal para mostrar datos de los intrumentos o del banco en la vista
  const [dataModal, setDataModal] = useState({});
  // Variable para definir los parametros del modal de bancos
  const [instrumentos, setInstrumentos] = useState([]);

  const [navigateRoute, setNavigateRoute] = React.useState(null)

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [bankCapacity, setBankCapacity] = React.useState(null)

  // Building the logic to consult the banks capacities
  async function consultingCapacities(nBanco){
    try{
      const response = await apiService.getByKey(`bancos/capacidades`, nBanco)
      console.log(response, 'Olaaaaaaaaaaaaaaaaaa')
      setBankCapacity(response.capacidad_por_turno);
      setMaxCapacity(response.capacidad_por_turno)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
    if (sessionData) {
      const data = {
        nBanco: sessionData.bancoData.nBanco,
        capacidad: sessionData.selectedOrder.capacidad_banco,
        marca: sessionData.selectedOrder.marca_medidores,
        modelo: sessionData.selectedOrder.modelo_medidores,
        cert: sessionData.bancoData.cert,
      }
      setDataModal(data);
      
    }
    // Aplicacion de la logica para llamar a la API y obtener toda la info del banco de Prueba y obtener los instrumentos
    async function fetchBancoData() {
      try {
        const params = { nombre: sessionData.bancoData.nBanco };
        const response = await apiService.getAll(`bancos/nombre/`, params);
        if (response) {
          const instrumentos = response?.instrumentos?.map((instrumento) => {
            return {
              id: instrumento.id,
              nombre: instrumento.codigo_interno,
              fecha_ultima_calibracion: instrumento.fecha_ultima_calibracion,
              fecha_vencimiento_certificado: instrumento.fecha_vencimiento_certificado,
            };
          });
          setInstrumentos(instrumentos);
          localStorage.setItem('instrumentsAsociated', JSON.stringify(instrumentos));
          console.log(instrumentos)
        }
      } catch (error) {
        console.log("Error al obtener los datos del banco: ", error);
      }
    }
    fetchBancoData();
    console.log(sessionData.bancoData)
    consultingCapacities(sessionData.bancoData.nBanco);
  }, []);


  // Funcion encargada de manejar el cambio de la capacidad máxima de la prueba
  const handleMaxCapacityChange = (event) => {
    const value = event.target.value;
    const condicion = bankCapacity? bankCapacity : 10;
    if (value && parseInt(value, 10) >= 0 && parseInt(value, 10) <= condicion) {
      setMaxCapacity(value);
    } else {
      setMaxCapacity("")
    }
  };

  // Funcion encargada de manejar el cambio de las anotaciones especiales
  // En este punto hemos de tener en cuenta que las anotaciones especiales son obligatorias cuando no colocan el numero maximo de medidores permitidos para ese banco
  const handleProceed = async (route) => {
    setIsProcessing(true); // Activar estado de procesamiento

    if (maxCapacity < dataModal.capacidad && (!specialAnotations || specialAnotations.trim() === "")) {
      alert("Por favor, deje una descripción en el campo de anotaciones especiales.");
      return;
    }
    const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
    if (!sessionData || !sessionData.selectedOrder) {
      alert("No se encontró la Orden de Servicio en la sesión.");
      return;
    }

    try {
      const payload = {
        orden_servicio_id: sessionData.selectedOrder.nombre_orden,
        capacidad_elegida: parseInt(maxCapacity, 10),
      };

      // Eliminar Las pruebas creadas anteriormente
      const pruebas_anterirores = await apiService.getAll("pruebas/pruebas/by-orden/", { orden_id: sessionData.selectedOrder.nombre_orden });
      // Solo si hay pruebas anteriores las elimina antes de crear las nuevas
      if (pruebas_anterirores) {
        for (const prueba of pruebas_anterirores) {
          await apiService.deleteData(`pruebas/pruebas`, `${prueba.id}`);
        }
      }
      
      // Crear las pruebas automaticamente con la capacidad seleccionada
      //await apiService.create("pruebas/auto-creation/", payload);

      //setCustomMessage("¡Se crearon automáticamente las pruebas con éxito!");
      setNavigateRoute(route);
      setIsOpenCustomMessage(true);

    } catch (error) {
      console.log("Error al crear las pruebas automáticamente:", error);
      alert("Ocurrió un error creando las pruebas. Revisa la consola.");
    } finally {
      setIsProcessing(false); // Desactivar estado de procesamiento
    }
  };

  const modal = React.useMemo(() => {
    return (
      <ModalData
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        popUpData={popUpData}
        dataBanco={dataModal}
        dataInstrumentos={instrumentos}
      />
    );
  }, [isOpen, popUpData, dataModal]); // Se re-renderiza cada que se realiza un cambio en la variable isOpen

  //En esta función de reenderización se ejecuta 
  const confirmationMessage = React.useMemo(() => {
    //El reenderizado solo se ejecuta al reconoce un true en a variable, al estarse ejecutando en diferentes reenderizados y no usar el disclosure, puede reenderizarse el modal en un false de la variable
    return isOpenCustomMessage === true ? (
      <CustomAlert 
        message={customMessage} 
        isVisible={isOpenCustomMessage} 
        setIsVisible={setIsOpenCustomMessage}
        routeRedirect={navigateRoute}
        />
    ) : null //En caso de ser false no ejecuta nada
  }, [isOpenCustomMessage]); //Se reenderiza cada que hay un cambio en la variable isOpenCustomMessage

  // console.log("Max: ", specialAnotations)
  return (
    <>
      {/*
      Se crea un div padre para la vista del tamaño de toda la pantalla
      Color de fondo establecido en el tailwind.config flex-col para que los items se agreguen hacia abajo y un overflow automático hacia abajo
      */}
      <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
        {modal} {/*Se ejecuta el modal la primera vez que se reenderiza la vista*/}
        {confirmationMessage} {/*Se ejecuta el modal la primera vez que se reenderiza la vista*/}
          {/*Header*/}
          <span className="font-mulish font-bold pt-5 text-[24px]">Ensayo de presión estática</span>
          <span className="font-mulisg font-semibold text-opacity-text">{DateService.getCurrentDate()}</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 py-2">
            <div className="col-span-3 bg-white shadow-lg flex space-x-2 rounded-[20px] items-center">
              <span className="font-inter text-center w-2/3 px-5">Usted está seleccionando el banco No.</span>
              <span className="font-teko text-[64px] w-1/3 text-center">{dataModal?.nBanco}</span>
            </div>
            <div className="col-span-1 w-full flex justify-center place-items-center">
              <Button
                className="w-[50px] h-[50px] bg-custom-blue p-2 rounded-xl shadow-lg items-center"
                onClick={
                    ()=>{
                        setPopUpData("banco") //Primero se ejecuta el cambio de la variable para saber qué datos se van a mostrar
                        onOpen() //Se cambia el estado de la variable isOpen para ejecutarse
                        }
                    }
                >
                <LuEye 
                  className="text-white w-[50px] h-[50px]"
                />
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <Button 
              className="bg-custom-blue h-auto w-full flex py-2 my-2 shadow-lg items-center"
              fullWidth={true}
              onClick={
                ()=>{
                    setPopUpData("instrumentNew") //Primero se ejecuta el cambio de la variable para saber qué datos se van a mostrar
                    onOpen() //Se cambia el estado de la variable isOpen para ejecutarse
                    }
                }
              >
              <span className="font-inter w-full text-white text-[17px]">Estado actual de los instrumentos</span>
              <FiTool className="text-white w-full h-full"/>
            </Button>
          </div>
          {/*-----------------------------------------------------------------------------------------------*/}
          {/*Body*/}
          <div className="w-full h-auto bg-white shadow-lg rounded-[20px] flex flex-col px-[7.5vw] py-3 mt-3">
            <span className="font-mulish font-bold text-[24px] text-center">Ajustes generales</span>
            <div className="w-full grid grid-cols-3 py-3">
              <div className="col-span-2 flex justify-center place-items-center">
                <span className="font-inter text-[18px]">Selección de capacidad (No de medidores por prueba)</span>
              </div>
              <div className="col-span-1 flex justify-end place-items-center">
              {/* Numero de medidores por bancada */}
                <input 
                    type="number"
                    value={maxCapacity}
                    onChange={(event) => {handleMaxCapacityChange(event)}}
                    className="w-full font-teko font-semibold text-[40px] border-oi-bg border-4 rounded-xl px-5 my-2 text-center"
                    max={dataModal.capacidad}
                    min={0}
                  />
              </div>
            </div>
            <div className="w-full grid grid-cols-5 place-items-center py-3">
              <div className="col-span-2 flex justify-center">
                <span className="font-inter text-[18px]">Anotaciones especiales</span>
              </div>
              <div className="col-span-3 w-full h-full flex justify-center">
                <textarea 
                  onInput={(event)=>{
                    setSpecialAnotations(event.target.value)
                  }}
                  className="font-inter text-[16px] w-full h-auto p-2 text-justify border-oi-bg border-4 rounded-xl ml-5"/>
              </div>
            </div>
          </div>
          {/*------------------------------------------------------------------------------------------*/}
          {/*Footer*/}
          <div className="w-full flex flex-col flex-grow bg-white shadow-lg rounded-[20px] my-5 px-[7.5vw]">
            <span className="font-mulish font-bold text-[22px] pt-5 text-center">Selección de medidores a evaluar</span>
            <Button 
              className="w-full bg-custom-blue mt-3 py-1 rounded-[15px]"
              onClick={() => handleProceed("/client/static_2_c")}
              >
              <span className="font-inter text-[18px] text-white">Correlativos</span>
            </Button>
            <Button 
              className="w-ful bg-gray-but mt-3 mb-5 py-1 rounded-[15px]"
              onClick={() => handleProceed("/client/static_2_nc")}
              isDisabled={isProcessing}
              >
              <span className="font-inter text-[18px] text-white">No correlativos</span>
            </Button>
          </div>
          {/*-------------------------------------------------------------------------------------------*/}
      </div>
    </>
  )
}