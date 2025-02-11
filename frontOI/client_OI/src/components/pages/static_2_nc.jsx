
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
import apiService from "../../hook/services/apiService";
//-------------------------------------------------------------------------------------
//Elementos externos
//--------------------------------------------------------------------------------------
//Para el componente table, hay que definir las columnas totales y los datos o elementos a desplegar
import {DataPrueba} from "../../utils/tests/data"  //"../../utils/tests/data";
//Modal para el mensaje de confirmación
import CustomAlert from "../shared/CustomAlert";
//Modal para el despliegue de la tabla de selección de medidores
import ModalData from "../shared/ModalData";

//Esta variable global guarda la selección de columnas que quieres desplegar en cada vista, esto permite delimitar enm reenderizado de variables en el componente table
const INITIAL_VISIBLE_COLUMNS = ["numero_serie"];

const columns = [
    {name: "ID MEDIDOR", uid: "numero_serie", sortable: true},
    {name: "ESTADO", uid: "estado", sortable: true},
    {name: "MARCA", uid: "marca", sortable: true},
  ];

export default function Static_2_nc() {

    //Variable, de tipo set que guarda el valor seleccionado en el dropdown de las ordenes
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
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
    //Variable que define las pruebas provenientes de la api
    const[pruebas, setPruebas] = React.useState([])
    //Variable que define los medidores provenientes de la prueba
    const[metersPrueba, setMetersPrueba] = React.useState([])
    //Variable que define los medidores provenientes de la prueba
    const [updatedPruebas, setUpdatedPruebas] = React.useState([]);

    const[selectedOrderId, setSelectedOrderId] = React.useState(localStorage.getItem("selectedOrderId"));

    const[pruebasApi, setPruebasApi] = React.useState([]);
    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente static_2_nc que tienen cambios de reenderizado y caché
    //---------------------------------------------------------------------------------------------------------------------------
    const enrichUpdatedPruebas = (updatedPruebas) => {
        // Mapear cada objeto en updatedPruebas
        return updatedPruebas.map(prueba => {
            // Enriquecer cada medidor con los campos adicionales
            const enrichedMedidores = prueba.medidores.map(medidor => {
                // Buscar el medidor en metersPrueba que coincida en numero_serie y meter_id
                const matchingMeter = metersPrueba.find(
                    meter => meter.numero_serie === medidor.meter_id
                );
    
                // Construir los campos adicionales dinámicamente
                const additionalFields = {
                    medidor: matchingMeter ? matchingMeter.id : null, // Asignar el id del medidor si coincide, o null si no
                    num: 1,
                    state: "Sin observaciones",
                    drain: "Sin observaciones",
                    obs: "Conforme",
                    result: "Apto",

                    q1: {
                        record_li: 0.0,
                        record_lf: 0.0,
                        reference_volume: 1.0
                    },
                    q2: {
                        record_li: 0.0,
                        record_lf: 0.0,
                        reference_volume: 1.0
                    },
                    q3: {
                        record_li: 0.0,
                        record_lf: 0.0,
                        reference_volume: 1.0
                    }
                };
    
                // Retornar el medidor enriquecido
                return {
                    ...medidor,
                    ...additionalFields
                };
            });
    
            // Retornar el objeto actualizado
            return {
                ...prueba,
                medidores: enrichedMedidores // Reemplazar los medidores originales
            };
        });
    };
    
    
    
    console.log("Medidores: ", metersPrueba)
    //Esta función se usa para calcular las columnas que se etsablecen como visibles en el componente table
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    // Objeto combinado que se actualiza cuando cambian `selectedKeys` o `selectedMeterKeys
    // Actualización de la prueba con los medidores seleccionados

    React.useMemo(() => {
        setUpdatedPruebas(pruebas);
    }, [pruebas]);

    React.useMemo(() => {
        
        console.log("Tamaño de selectedMeterKeys: ", selectedMeterKeys.size);
        const newUpdatedPruebas = updatedPruebas.map((prueba) =>
            selectedKeys.has(prueba.nombre)
                ? { 
                    ...prueba, 
                    medidores: Array.from(selectedMeterKeys).map(key => ({ meter_id: key }))
                  }
                : prueba
        );
        
        console.dir(newUpdatedPruebas, { depth: null });   
    
        setUpdatedPruebas(newUpdatedPruebas);
    }, [selectedMeterKeys]);
    

    const medidoresCount = React.useMemo(() => {
        const prueba = updatedPruebas ? updatedPruebas.find(prueba => selectedKeys.has(prueba.nombre)) : null;
        return prueba && prueba.medidores ? prueba.medidores.length : 0;
    }, [selectedKeys, selectedMeterKeys, updatedPruebas]);

    React.useMemo(() => {
        const prueba = updatedPruebas ? updatedPruebas.find(prueba => selectedKeys.has(prueba.nombre)) : null;
        const existingPrueba = updatedPruebas ? updatedPruebas.find(prueba => selectedKeys.has(prueba.nombre)) : null;
        const existingMedidores = existingPrueba && existingPrueba.medidores ? existingPrueba.medidores.map(medidor => medidor.meter_id) : [];
        setSelectedMeterKeys(new Set(existingMedidores));
    },[selectedKeys])

    

    //----------------------------------------------------------------------------------------------
    //Funciones que requieren un manejo de reenderizado y manejo de caché
    //------------------------------------------------------------------------------------------------

    //Función para obtener los gateways del autocomplete
    React.useEffect(() => {
  
        //Al estar ejecutando el fetch activamos el loading de la data
            const fetchPruebas = async () => {
            try {
            const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
            
            const response = await apiService.getAll("pruebas/pruebas/by-orden/", { orden_id: sessionData.selectedOrder.nombre_orden });
            // Suponiendo que setPruebas es un setter de un estado que contiene un array
            setPruebas(response);
            setSelectedKeys(new Set([response[0].nombre]))
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
            //setIsLoading(true);
            const fetchMetersPrueba = async () => {
            try {

            const sessionData = JSON.parse(localStorage.getItem('selectedOrderData'));
            const response = await apiService.getAll('ordenes/trabajo/identificador/', {identificador: sessionData.selectedOrder.id_orden});
            // Suponiendo que setPruebas es un setter de un estado que contiene un array

            setMetersPrueba(response.medidores_asociados)
            setMetersLength(response.medidores_asociados.length);
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
        React.useMemo(() => {
            //const ids = generateTestIds();
            //setPruebas(ids); // Almacena los IDs en el estad
            pruebas.length > 0 ? setSelectedKeys(new Set([pruebas[0].nombre])) : null
        }, [pruebas]); // Arreglo de dependencias vacío

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
                meters={metersPrueba}
                loadingState={loadingState}
                selectedKeys={selectedKeys}
                pruebas={updatedPruebas}
            />
        );
    }, [isOpen,selectedMeterKeys, sortDescriptor, popUpData, selectedKeys, updatedPruebas]); //Variables de reenderizado

    // Crear un closure de enrichUpdatedPruebas con updatedPruebas
    const handleConfirm = React.useCallback(async () => {
        // Calcular la suma de todos los medidores de updatedPruebas, validando la existencia de medidores
        const totalMedidores = updatedPruebas.reduce((acc, prueba) => {
            if (prueba.medidores && Array.isArray(prueba.medidores)) {
                return acc + prueba.medidores.length;
            }
            return acc; // Ignorar si prueba.medidores es undefined o no es un array
        }, 0);

        // Validar que todas las pruebas tengan al menos un medidor
        const allPruebasHaveMedidores = updatedPruebas.every(
            prueba => prueba.medidores && Array.isArray(prueba.medidores) && prueba.medidores.length > 0
        );

        // Validar condiciones antes de proceder
        if (totalMedidores !== metersLength) {
            alert(
                `La suma total de medidores (${totalMedidores}) no es igual a metersLength (${metersLength}).`
            );
            return null; // O cualquier acción deseada en caso de que no se cumpla
        }

        if (!allPruebasHaveMedidores) {
            alert(`Una o más pruebas no tienen medidores seleccionados.`);
            return null; // O cualquier acción deseada en caso de que no se cumpla
        }

        const enrichedPruebas = enrichUpdatedPruebas(updatedPruebas);
        console.log("Enriched Pruebas:", enrichedPruebas);

        try {
            console.log("Iniciando el proceso de asignación de medidores...");
        
            if (!enrichedPruebas || !Array.isArray(enrichedPruebas)) {
                console.error("Error: 'enrichedPruebas' no está definido o no es un array.", enrichedPruebas);
                throw new Error("Datos de pruebas inválidos.");
            }
        
            if (!metersPrueba || !Array.isArray(metersPrueba)) {
                console.error("Error: 'metersPrueba' no está definido o no es un array.", metersPrueba);
                throw new Error("Datos de medidores inválidos.");
            }
        
            console.log(`Cantidad de pruebas a procesar: ${enrichedPruebas.length}`);
            console.log(`Cantidad de medidores a actualizar: ${metersPrueba.length}`);
        
            const promises = enrichedPruebas.map(prueba => {
                if (!prueba.id || !prueba.medidores) {
                    console.error("Error: Prueba inválida, falta ID o medidores:", prueba);
                    throw new Error(`Prueba inválida detectada: ${JSON.stringify(prueba)}`);
                }
        
                const pruebaId = prueba.id;
                const metersPayload = {
                    medidores: prueba.medidores,
                };
        
                console.log(`Enviando medidores para la prueba ID: ${pruebaId}`, metersPayload);
        
                return apiService.postMetersPrueba(pruebaId, metersPayload)
                    .catch(error => {
                        console.error(`Error en postMetersPrueba para ID ${pruebaId}:`, error);
                        return Promise.reject(error);
                    });
            });
        
            const promises_meters = metersPrueba.map(meter => {
                if (!meter.id) {
                    console.error("Error: Medidor inválido, falta ID:", meter);
                    throw new Error(`Medidor inválido detectado: ${JSON.stringify(meter)}`);
                }
        
                const metersPayload = {
                    ...meter,
                    registro_tecnico_id: meter.registro_tecnico.id,
                    estado: "Asignado",
                };
        
                console.log(`Actualizando estado de medidor ID: ${meter.id}`, metersPayload);
        
                return apiService.updateMetersData(meter.id, metersPayload)
                    .catch(error => {
                        console.error(`Error en updateMetersData para ID ${meter.id}:`, error);
                        return Promise.reject(error);
                    });
            });
        
            console.log("Esperando que todas las promesas finalicen...");
        
            const [resultsPruebas, resultsMeters] = await Promise.all([
                Promise.allSettled(promises),
                Promise.allSettled(promises_meters)
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
        
            // Acción adicional tras la actualización exitosa
            alert("Los medidores se asignaron exitosamente a las pruebas.");
            return true;
        
        } catch (error) {
            console.error("Error al enviar los medidores:", error);
            alert("Ocurrió un error al asignar los medidores. Intenta nuevamente.");
            return false;
        }        

    }, [updatedPruebas, metersLength]); // Agregar metersLength como dependencia


    
    // Ejecución de componente externo modal para confirmación
    const confirmationMessage = React.useMemo(() => {
        return isOpenCustomMessage === true ? (
            <CustomAlert 
                routeRedirect={"/client/static_3_nc"} 
                handleConfirm={handleConfirm} 
                message={customMessage} 
                isVisible={isOpenCustomMessage} 
                setIsVisible={setIsOpenCustomMessage}
            ></CustomAlert>
        ) : null;
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
                            className="capitalize mt-2 z-[0] px-0 justify-items-end w-full"
                            >
                            <div className="flex justify-between w-full">
                                <span className="font-teko text-center font-semibold text-black text-[18px]">{selectedKeys}</span>
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
                        {pruebas.length > 0 ? pruebas.map((prueba, index) => (
                            <DropdownItem key={prueba.nombre} textValue={`${prueba.nombre}`}>
                                Prueba: {prueba.nombre}
                            </DropdownItem>
                        )) : null}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="ml-3 bg-white w-2/6 h-auto rounded-[20px] flex flex-col justify-center place-items-center">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] mt-3">Capacidad</span>
                    <span className="font-teko font-semibold text-[40px]">{updatedPruebas.length > 0 ? updatedPruebas.find(prueba => selectedKeys.has(prueba.nombre)).n_medidores_seleccionados : 0}</span>
                </div>
            </div>
            <Button 
                disableAnimation={true}
                className="flex justify-center place-items-center bg-custom-blue w-full my-[3vh] h-auto py-3"
                >
                <span className="font-inter text-[15px] text-center text-white">Medidores disponibles en orden ({metersLength}uds)</span>
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
                        <span className="font-teko font-semibold text-[40px]">{medidoresCount}</span>
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