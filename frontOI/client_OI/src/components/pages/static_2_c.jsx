//Importaciones de elementos UI
//------------------------------------------------------------------
//Elemento Dropdown
import {  
    Dropdown,  
    DropdownTrigger,  
    DropdownMenu,  
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
import { FaCaretDown } from "react-icons/fa";
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
import React, { useState, useEffect, useMemo } from "react";
import { GiConsoleController } from "react-icons/gi";

const INITIAL_VISIBLE_COLUMNS = ["medidor"];

const columns = [
  {name: "ID MEDIDOR", uid: "medidor", sortable: true},
  {name: "ESTADO", uid: "estado", sortable: true},
  {name: "MARCA", uid: "marca", sortable: true},
];


export default function Static_2_c() {

    const maxCapacity = parseInt(localStorage.getItem("maxCapacity"))
    // -- Estados, modals y variables --
    const {isOpen, onOpen, onOpenChange} = useDisclosure(); // Para el ModalData
    const [isOpenCustomMessage, setIsOpenCustomMessage] = useState(false); // Para el CustomAlert
    const [customMessage, setCustomMessage] = useState(null); 
    const [popUpData, setPopUpData] = useState(null);

    const [metersPrueba, setMetersPrueba] = useState([]);   // Lista de medidores asociados a la orden
    const [selectedMedidores, setSelectedMedidores] = useState([]); // IDs (o series) de medidores seleccionados
    const [metersLength, setMetersLength] = useState(0);

    const [selectedConfirmMeters, setSelectedConfirmMeters] = useState([]); // IDs (o series) de medidores seleccionados

    const [ordenID, setOrdenID] = useState(null);
    const [pruebas, setPruebas] = useState([
      {
        nombre: "Ninguna",
      }
    ]);         // Pruebas abiertas
    const [selectedKeys, setSelectedKeys] = useState(new Set([])); 
    const [capacity, setCapacity] = useState(0);

    const [rangeStart, setRangeStart] = useState(null);
    const [rangeEnd, setRangeEnd] = useState(null);

    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));

    //----------------------------------------------------------------------------------------------
    //Funciones que requieren un manejo de reenderizado y manejo de caché
    //------------------------------------------------------------------------------------------------

    const headerColumns = React.useMemo(() => {
      if (visibleColumns === "all") return columns;
      return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // Carga inicial
    useEffect(() => {
      const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
      if (sessionData) {
          setCapacity(sessionData.selectedOrder.capacidad_banco);
          setOrdenID(sessionData.selectedOrder.id_orden);
      }
      const fetchOrders = async () => {
        try {
            const medidores_order = await apiService.getAll(`ordenes/trabajo/buscar/`, {
              identificador: sessionData.selectedOrder.id_orden
            });
            localStorage.setItem("idOrdenSelected",sessionData.selectedOrder.nombre_orden)
            if(medidores_order){
                const medidores = medidores_order[0].medidores_asociados.filter((medidor) => (medidor.estado === 'Disponible')).map((medidor) => ({
                    id: medidor.id,
                    medidor: medidor.numero_serie,
                    estado: medidor.estado,
                }));
                setMetersPrueba(medidores);

                setMetersLength(medidores.length);
            }

        } catch (error) {
            console.error('Error fetching initial meters:', error);
        }
        };
        fetchOrders();
      }, []);

      const handleOnClose = () => {
        //En caso de no confirmar la selección mostrar los medidores previamente confirmados
        setSelectedMedidores([...new Set(selectedConfirmMeters.map(String))])
      }

      const generateTestObjects = (idSet) => {
        const ids = Array.from(idSet); // Convertimos el Set en un Array
        const testObjects = [];
      
        for (let i = 0; i < ids.length; i += maxCapacity) {
          testObjects.push({ nombre: `Prueba generada ${i / maxCapacity + 1}` });
        }
      
        return testObjects;
      };
      
      // Selección total
      const handleSelectAll = () => {
          const all = metersPrueba.map(m => m.id);
          setSelectedConfirmMeters(all);
          setSelectedMedidores([...new Set(all.map(String))])
          if (all.length > 0) {
              setRangeStart(metersPrueba[0].medidor);
              setRangeEnd(metersPrueba[all.length - 1].medidor);
          }

          const pruebas = generateTestObjects([...new Set(all.map(Number))])
          setPruebas(pruebas)

      };
  
      // Selección parcial
      const handleSelectPartial = () => {
          setPopUpData("meter_partial");
          onOpen();
      };
  
    const handlePartialSelectionConfirm = (selected) => {
      let selectedTransformed = [...new Set(selected.map(Number))];
      let sorted = selectedTransformed.sort((a, b) => a - b);

      console.log("Selected meters: ", selected)
      
      const selectedMeters = metersPrueba.filter(m => sorted.includes(m.id));
      console.log("filtrados: ", metersPrueba)

      const start = selectedMeters.length > 0 ? selectedMeters[0].medidor : null;
      const end = selectedMeters.length > 0 ? selectedMeters[selectedMeters.length - 1].medidor : null;
    
      const pruebas = generateTestObjects(selectedTransformed)
      setPruebas(pruebas)

      // Combinar actualizaciones relacionadas
      setSelectedConfirmMeters(sorted);
      setRangeStart(start);
      setRangeEnd(end);
      onOpenChange(false); // Cerrar el modal explícitamente
    };

    const handleConfirmSelection = async () => {
      if (selectedConfirmMeters.length === 0) {
          alert("No has seleccionado ningún medidor.");
          return null;
      }
      let success = true;
      //const selectedMeters = metersPrueba.filter(m => selectedMedidores.includes(m.id));
  
      try {
        const payload = {
          medidores: Array.from(selectedConfirmMeters),
          n_medidores_seleccionados: maxCapacity,
          usuario: JSON.parse(localStorage.getItem('user')).id,
          id_orden: parseInt(localStorage.getItem("idOrdenSelected"))
        }

        const response = await apiService.create(
            `pruebas/pruebas/crear-pruebas/`,
            payload
        );

        console.log("Response: ", response)

        response.length < 1 ? success = false : null

        if (success) {
          setCustomMessage("Asignación completada con éxito.");

          return success;
            // Forzar recarga de datos tras confirmación exitosa
            // const updatedMeters = await apiService.getAll('ruta/actualizacion');
            // setMetersPrueba(updatedMeters);
        }else{
          throw new Error("Un error ha ocurrido");
          return null;
        }
      } catch (error) {
          if(error.details === "Algunos medidores no están en estado 'Disponible'."){
            alert("Otro operario ya seleccionó esta secuencia de medidores, intente de nuevo")
            window.location.reload();
          } else {
            console.error("Error en la asignación de medidores:", error);
            alert("Hubo un error, intente de nuevo")
            setCustomMessage("Ocurrió un error al intentar asignar los medidores.");
            window.location.reload()
            return null
          }
      }
  };
      const modal = useMemo(() => (
          <ModalData
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              popUpData={popUpData}
              meters={metersPrueba}
              selectedMeterKeys={selectedMedidores}
              setSelectedMeterKeys={setSelectedMedidores}
              headerColumns={headerColumns}
              onConfirmSelection={handlePartialSelectionConfirm}
              pruebaCapacity={capacity}
              handleOnClose={handleOnClose}
          />
      ), [isOpen, popUpData, metersPrueba, selectedMedidores]);

    const rangePresentation = useMemo(() => {
      return (
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
      </div>)
    }, [rangeStart, rangeEnd])

    // Enviar en funcion de respuesta del estado del medidor si este ha sido evaluado
    const handleMeterEvaluation = (meterKey, evaluation) => {
      const updatedMeters = metersPrueba.map((meter) => {
        if (meter.id === meterKey) {
          return {
            ...meter,
            estado: evaluation,
          };
        }
        return meter;
        });
        setMetersPrueba(updatedMeters);
    };

    const confirmationMessage = useMemo(() => {
        return isOpenCustomMessage ? (
        <CustomAlert 
            message={customMessage} 
            isVisible={isOpenCustomMessage} 
            handleConfirm={handleConfirmSelection}
            setIsVisible={setIsOpenCustomMessage}
            routeRedirect={"/client/static_3_c"}
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

            <div className="w-full h-auto flex mt-8">
              <div className="bg-white w-4/6 h-full rounded-[20px] flex flex-col justify-center p-3">
                <span className="font-inter font-semibold text-opacity-text text-[16px] ml-4">
                  Previsualización de pruebas
                </span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="capitalize mt-2 z-[0]">
                      <div className="flex justify-between w-full">
                        <span className="font-teko font-semibold text-black text-center text-[22px]">
                          {Array.from(selectedKeys).join(", ") || "Bancadas a realizar"}
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
                <span className="font-teko font-semibold text-[40px]">{maxCapacity}</span>
              </div>
            </div>

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

              <div className="flex flex-col space-y-4 items-start w-full">
                <div className="flex flex-row w-full justify-between">
                  <div className="flex flex-col justify-center items-center">
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

                  <div className="flex flex-col justify-center items-center">
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
                  </div>
                </div>
              </div>

              {/* Aqui se ajusta el componente de renderizacion por rango */}
              {rangePresentation}
            </div>

            <div className="flex-grow flex w-full justify-between place-items-center space-x-2 rounded-[20px] my-[4vh] bg-white shadow-sm p-3">
              <div className="ml-3 bg-white w-[45%] h-auto rounded-[20px] flex flex-col place-items-center">
                <span className="font-inter font-semibold text-opacity-text text-center text-[16px] mt-3">
                  Medidores seleccionados
                </span>
                <span className="font-teko font-semibold text-[40px]">
                  {selectedConfirmMeters.length}
                </span>
              </div>
              <div className="flex flex-col">
                    <span className="font-inter font-semibold text-opacity-text text-[16px]">
                      Confirmar selección
                    </span>
                    <Button
                      isIconOnly
                      className="my-2 bg-white"
                      onClick={()=>{
                        setIsOpenCustomMessage(true)//se abre el modal de confirmación de mensaje
                      }}
                    >
                      <div className="w-[40px] h-[40px] bg-custom-blue rounded-[10px] shadow-sm flex justify-center items-center">
                        <IoMdAddCircleOutline className="text-white p-1 w-[28px] h-[28px]" />
                      </div>
                    </Button>
                  </div>
            </div>
          </div>
        </>
    );
}
