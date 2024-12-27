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
import ModalSelection from "../shared/ModalSelection";
import apiService from "../../hook/services/apiService";
import  DateService  from "../../hook/services/dateService.js"
//---------------------------------------------------------------
//Funcionamiento
import React, { useState, useEffect, useMemo } from "react";

export default function Static_2_c() {

  // -- Estados, modals y variables --
  const {isOpen, onOpen, onOpenChange} = useDisclosure(); // Para el ModalData
  const [isOpenCustomMessage, setIsOpenCustomMessage] = useState(false); // Para el CustomAlert
  const [customMessage, setCustomMessage] = useState(null); 
  const [popUpData, setPopUpData] = useState(null);

  const [metersPrueba, setMetersPrueba] = useState([]);   // Lista de medidores asociados a la orden
  const [selectedMedidores, setSelectedMedidores] = useState([]); // IDs (o series) de medidores seleccionados
  const [metersLength, setMetersLength] = useState(0);

  const [ordenID, setOrdenID] = useState(null);
  const [pruebas, setPruebas] = useState([]);         // Pruebas abiertas
  const [selectedKeys, setSelectedKeys] = useState(new Set([])); 
  const [capacity, setCapacity] = useState(0);

  // Para mostrar rango “Desde… Hasta…” de la selección
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);


  //----------------------------------------------------------------------------------------------
  //Funciones que requieren un manejo de reenderizado y manejo de caché
  //------------------------------------------------------------------------------------------------

  //Función para obtener los gateways del autocomplete
  useEffect(() => {
      const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
      if (sessionData) {
          setCapacity(sessionData.selectedOrder.capacidad_banco);
          setOrdenID(sessionData.selectedOrder.id_orden);
      }
      const fetchOrders = async () => {
          try {
              //Para obtener los medidores se hace abstraccion de la orden de trabajo que esta en el local storage para traer los valores concernientes
              const medidores_orden = await apiService.getAll(`ordenes/trabajo/identificador/`, {identificador: sessionData.selectedOrder.id_orden});
              if(medidores_orden){
                  const medidores = medidores_orden.medidores_asociados.map((medidor) => {
                      return {
                          id: medidor.id,
                          medidor: medidor.numero_serie,
                          estado: medidor.estado,
                      }
                  })
                  console.log(medidores)
                  setMetersPrueba(medidores);
                  setMetersLength(medidores.length);
              }
              
              const pruebasActuales = await apiService.getAll("pruebas/pruebas/by-orden/", { orden_id: sessionData.selectedOrder.nombre_orden });
              if (pruebasActuales) {
                  const respuestas = pruebasActuales.map((q) => {
                      return {
                          id: q.id,
                          nombre: q.nombre,
                          estado: q.estado,
                      }
                  });
                  const filtradas = pruebasActuales.filter(p => p.estado === "ABIERTA");
                  console.log(filtradas)
                  setPruebas(filtradas)

                  if (filtradas.length > 0) {
                      setSelectedKeys(new Set([filtradas[0].nombre]));
                  }
              }
          } catch (error) {
              //En caso de error en el llamado a la API se ejecuta un console.error
              console.error('Error fetching initial meters:', error);
          }
      }
      fetchOrders();
    }, []);


  // ---------------------------------------------------------------------------------------------
  // 2. Métodos para selección de medidores
  // ---------------------------------------------------------------------------------------------
  const handleSelectAll = () => {
      // Selecciona todos
      const all = metersPrueba.map(m => m.id);
      setSelectedMedidores(all);
      if (all.length > 0) {
      // toma el rango completo de los medidores a trabajar
      setRangeStart(metersPrueba[0].numero_serie);
      setRangeEnd(metersPrueba[all.length - 1].numero_serie);
      }
  };

  const handleSelectPartial = () => {
      // Abre el modal para seleccionar “parcial”
      // popUpData = "meter_partial" (ejemplo)
      setPopUpData("meter_partial");
      onOpen();
  };

  // Cuando cierras el modal partial, asume que en el ModalData 
  // guardas en `selectedMedidores` la selección hecha.
  // 
  // También podrías calcular el "rangeStart" y "rangeEnd" 
  // si la selección es correlativa, o dejarlos en null si no es correlativo.

  //Se agrupan y formatean los datos seleccionados en el dropdownBox
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  // ---------------------------------------------------------------------------------------------
  // 3. Confirmar selección => asignar a las pruebas
  // ---------------------------------------------------------------------------------------------
  const handleConfirmSelection = async () => {
      if (selectedMedidores.length === 0) {
      alert("No has seleccionado ningún medidor.");
      return;
      }
      // O llamas a la lógica para asignarlos. 
      // Ejemplo: “asignarMedidores(selectedMedidores)”
      // y muestras un alert/resumen
      setCustomMessage(`Seleccionaste ${selectedMedidores.length} medidores. Ahora se asignarán automáticamente a las pruebas abiertas.`);
      setIsOpenCustomMessage(true);
  };

  // ---------------------------------------------------------------------------------------------
  // 4. Renders y UI
  // ---------------------------------------------------------------------------------------------


  const modal = useMemo(() => {
      return (
      <ModalData
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          popUpData={popUpData}
          meters={metersPrueba} // Lista de medidores disponibles
          selectedMeterKeys={selectedMedidores} // Estado de medidores seleccionados
          setSelectedMeterKeys={setSelectedMedidores} 
      />
      );
  }, [isOpen, popUpData, metersPrueba, selectedMedidores]);

  const confirmationMessage = useMemo(() => {
      return isOpenCustomMessage ? (
      <CustomAlert 
          message={customMessage} 
          isVisible={isOpenCustomMessage} 
          setIsVisible={setIsOpenCustomMessage}
          routeRedirect={"/client/static_3"}
      />
      ) : null;
  }, [isOpenCustomMessage, customMessage]);

  return(
      <>
        {confirmationMessage}
        <div className="w-screen h-[100svh] bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
          {modal}
          <span className="font-mulish font-bold pt-5 text-[24px]">
            Ensayo de presión estática
          </span>
          <span className="font-mulisg font-semibold text-opacity-text">
            {DateService.getCurrentDate()}
          </span>
  
          {/* Dropdown de pruebas */}
          <div className="w-full h-auto flex mt-8">
            <div className="bg-white w-4/6 h-full rounded-[20px] flex flex-col justify-center p-3">
              <span className="font-inter font-semibold text-opacity-text text-[16px] ml-4">
                Identificador prueba
              </span>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize mt-2 z-[0]">
                    <div className="flex justify-between w-full">
                      <span className="font-teko font-semibold text-black text-center text-[22px]">
                        {selectedValue || "Seleccionar prueba"}
                      </span>
                      <FaCaretDown className="text-custom-blue"/>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Pruebas abiertas"
                  variant="flat"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                >
                  {pruebas.map(prueba => (
                    <DropdownItem
                      key={prueba.nombre}
                      textValue={`Prueba: ${prueba.nombre}`}
                    >
                      {prueba.nombre}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="ml-3 bg-white w-2/6 h-auto rounded-[20px] flex flex-col justify-center place-items-center">
              <span className="font-inter font-semibold text-opacity-text text-[16px] mt-3">
                Capacidad
              </span>
              <span className="font-teko font-semibold text-[40px]">{capacity}</span>
            </div>
          </div>
  
          {/* Sección de selección a evaluar */}
          <div className="bg-white shadow-sm w-full h-auto rounded-[20px] place-items-center flex flex-col mt-5 p-4">
            <span className="font-mulish font-semibold text-[24px] mb-2">
              Selección a evaluar
            </span>
            <div className="w-5/6 bg-gray-400 h-0.5 mb-2"></div>
            <div className="w-5/6">
              <span className="text-left font-inter text-[18.4px] mt-2">
                Realice una selección de medidores para la ejecución de la prueba.
              </span>
            </div>
            <div className="w-5/6 bg-gray-400 h-0.5 my-2"></div>
  
            {/* Botones: Seleccionar todos, Seleccionar parcial, Confirmar */}
            <div className="flex flex-col space-y-4 items-start w-full">
              <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col">
                  <span className="font-inter font-semibold text-opacity-text text-[16px]">
                    Seleccionar todos
                  </span>
                  <Button
                    isIconOnly
                    className="my-2 bg-white"
                    onClick={handleSelectAll}
                  >
                    <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm flex justify-center items-center">
                      <GoPencil className="text-white p-1 w-[28px] h-[28px]" />
                    </div>
                  </Button>
                </div>
  
                <div className="flex flex-col">
                  <span className="font-inter font-semibold text-opacity-text text-[16px]">
                    Seleccionar parcial
                  </span>
                  <Button
                    isIconOnly
                    className="my-2 bg-white"
                    onClick={handleSelectPartial}
                  >
                    <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm flex justify-center items-center">
                      <RiPlayListAddFill className="text-white p-1 w-[28px] h-[28px]" />
                    </div>
                  </Button>
                  {/* <Button
                      className="my-2 bg-white"
                      onClick={() => {
                          setPopUpData("meter_partial"); // Define el propósito
                          onOpen(); // Abre el modal
                      }}
                      >
                      <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm">
                          <GoPencil className="text-white p-2 w-full h-full" />
                      </div>
                  </Button> */}
                </div>
  
                <div className="flex flex-col">
                  <span className="font-inter font-semibold text-opacity-text text-[16px]">
                    Confirmar selección
                  </span>
                  <Button
                    isIconOnly
                    className="my-2 bg-white"
                    onClick={handleConfirmSelection}
                  >
                    <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm flex justify-center items-center">
                      <IoMdAddCircleOutline className="text-white p-1 w-[28px] h-[28px]" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
  
            {/* Rango “Desde – Hasta” basado en rangeStart y rangeEnd */}
            <div className="mt-4 w-full flex flex-col space-y-2">
              <div className="flex items-center">
                <span className="font-inter font-semibold text-opacity-text text-[16px] mr-2">
                  Desde:
                </span>
                <span className="font-teko font-semibold text-[20px]">
                  {rangeStart || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-inter font-semibold text-opacity-text text-[16px] mr-2">
                  Hasta:
                </span>
                <span className="font-teko font-semibold text-[20px]">
                  {rangeEnd || "N/A"}
                </span>
              </div>
            </div>
          </div>
  
          {/* Sección final con resumen */}
          <div className="flex-grow flex w-full justify-between place-items-center space-x-2 rounded-[20px] my-[4vh] bg-white shadow-sm p-3">
            <div className="ml-3 bg-white w-[45%] h-auto rounded-[20px] flex flex-col place-items-center">
              <span className="font-inter font-semibold text-opacity-text text-center text-[16px] mt-3">
                Medidores seleccionados
              </span>
              <span className="font-teko font-semibold text-[40px]">
                {selectedMedidores.length}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }