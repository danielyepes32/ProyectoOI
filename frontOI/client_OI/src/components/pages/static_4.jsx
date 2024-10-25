import { LuEye } from "react-icons/lu";
import { Button, Input, input, table } from "@nextui-org/react";
import {  
    Modal,   
    ModalContent,   
    ModalHeader,   
    ModalBody,   
    ModalFooter,
    useDisclosure
} from "@nextui-org/modal";
import React, { useState } from "react";
import CustomAlert from "../shared/CustomAlert";
import {
    Table, //Componente tabla 
    TableHeader, //Componente header de la tabla
    TableColumn, //componente columnas de la tabla
    TableBody, //Componente body para identificar si poner algún texto o las celdas
    TableRow, //Componente que establece las filas de un registro
    TableCell, //Componente que representa una zelda de cada registro
    Spinner,
  } from "@nextui-org/react";
  import {  
    Dropdown,  
    DropdownTrigger,  
    DropdownMenu,  
    DropdownSection,  
    DropdownItem
} from "@nextui-org/dropdown";
  //Componente
import {meterColumns, meterDataTest} from "../../utils/tests/data"  //"../../utils/tests/data";
import { td, thead, tr } from "framer-motion/client";
import { FaCaretDown } from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { MdOutlineWbIncandescent } from "react-icons/md";
import { TbTableShortcut } from "react-icons/tb";

//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["meter_id", "state", "result"];

export default function Static_4() {

    const [isChanged, setIsChanged] = useState(false)
    const [pruebaValue, setPruebaValue] = useState(null)
    const [visualInspection, setVisualInspection] = useState(
        {
          'AA23099471': { value: "Sin inspección" },
          'AA23099472': { value: "Sin inspección" },
          'AA23099473': { value: "Sin inspección" },
          'AA23099474': { value: "Sin inspección" },
          'AA23099475': { value: "Sin inspección" },
          'AA23099476': { value: "Sin inspección" }
        }
      )
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [popUpData,setPopUpData] = React.useState(null);
    const [customMessage, setCustomMessage] = React.useState(null);
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
    const [isLoading, setIsLoading] = React.useState(true);
    const [disableBottoms, setDisableBottoms] = React.useState(false);
    //constante con los id de los medidores seleccionados
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    //Variable que establece la columna y el orden de filtrado para la consulta, es un JSON con el nombre de columna
    //y el orden (ascending, descending)
    const [sortDescriptor, setSortDescriptor] = React.useState({});
    //Constante para establecer las columnas visibles puesto que estas son dinamicas
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    //En esta variable se guardarán los medidores que se extraigan de la API
    const [meters, setMeters] = React.useState(meterDataTest);
    //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
    const [metersLength, setMetersLength] = React.useState(meterDataTest.length);
    //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
    const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient
    //Esta función se usa para calcular las columnas que se etsablecen como visibles
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return meterColumns;

        return meterColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    const handleValueChange = (newValue) => {
      setPruebaValue(newValue);
      setIsChanged(true);
    };

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

    console.log("Meters: ", meters)

    const addKey = (newKey) => {
      setSelectedKeys(() => {
        const updatedSet = new Set(selectedKeys);
        updatedSet.add(newKey); // Agregar el nuevo valor al Set
    
        return updatedSet; // Devolver el nuevo Set actualizado
      });
    };
    
    console.log("SelectedKeus: ", selectedKeys)
    //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
    const modal = React.useMemo(() => {
        return (
            <Modal 
            isOpen={isOpen} 
            placement="center"
            onOpenChange={onOpenChange}
            className="mx-5"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-center font-mulish font-bold">{popUpData === 'banco' ? 'Banco': 'Instrumentos'}</ModalHeader>
                  <ModalBody>
                        {React.useMemo(() => {
                          if(popUpData === 'banco'){
                            return (
                              <div className="w-full h-full grid grid-cols-2 mb-10">
                                <div className="w-full h-full space-y-5 flex flex-col justify-start items-left">
                                  <p className="h-1/3 font-semibold">Dato opeario 1</p>
                                  <p className="h-1/3 font-semibold">Dato opeario 2</p>
                                  <p className="h-1/3 font-semibold">Dato opeario 3</p>
                                </div>
                                <div className="w-full h-full space-y-2 flex flex-col justify-end">
                                  <p className="text-right h-1/3">Respuesta 1</p>
                                  <p className="text-right h-1/3">Respuesta 1</p>
                                  <p className="text-right h-1/3">Respuesta 1</p>
                                </div>
                              </div>
                            )
                          }else if(popUpData === 'instrument'){
                            return (
                              <div className="w-full h-full grid grid-cols-5 mb-10">
                                <div className="col-span-2 w-full h-full space-y-5 flex flex-col justify-start items-left">
                                  <p className="h-1/3 font-semibold">Manómetro</p>
                                  <p className="h-1/3 font-semibold">Cronómetro</p>
                                  <p className="h-1/3 font-semibold">Termostato</p>
                                </div>
                                <div className="col-span-3 w-full h-full space-y-2 flex flex-col justify-end">
                                  <p className="text-left h-1/3">Vigencia (De: 2023-04-27, hasta 2024-04-27)</p>
                                  <p className="text-left h-1/3">Vigencia (De: 2023-01-15, hasta 2027-01-15)</p>
                                  <p className="justify-start h-1/3 flex place-items-center align-right">Vigencia (De: 2023-05-30, hasta 2024-05-30)</p>
                                </div>
                              </div>
                            )
                          }
                          }, [popUpData])
                        }
                  </ModalBody>
                  {/*   
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </ModalFooter>
                  */}
                </>
              )}
            </ModalContent>
          </Modal>    
        );
    }, [isOpen]);

    const confirmationMessage = React.useMemo(() => {
        console.log("CustomMessage: ", isOpenCustomMessage)
        return isOpenCustomMessage === true ? (
          <CustomAlert message={customMessage} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage}></CustomAlert>
        ) : null
      }, [isOpenCustomMessage]);
  //Funcion callback al obtener datos para la tabla dependiendo del columkey
  //Se establece un render con el user que representa la llave de medidor seleccionado y la llave de columna 
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    console.log("Llega al render cell", selectedKeys)

    //Realizar diferentes acciones dependiendo de la columkey
    switch (columnKey) {
      case "status":
        return (
          //Creo un componente Chip de tipo dot porque estamos agregando un boton de estatus
          <Chip
            variant="dot"
            size="sm"
            classNames={{
                //Las caracteristicas de base se cambian con respecto a tailwind para el tamaño del componente chip dentro de su contenedot
                base: "w-auto h-auto px-1",
                content: "px-1",
                //le doy un tamaño al punto, en este caso con un padding de 1 y un color de bg en este caso caracterizado por el mapeo del estatus key
                dot: `p-1 bg-${statusColorMap[user.status]}`
            }}
            className="capitalize gap-4"
          >
            {cellValue}
          </Chip>
        );
      //Ejecución en caso de que se active la columna de actions (los 3 puntos)
      case "actions":
        return (
          <div className="relative flex justify-center items-center text-center gap-5">
            {/*Establecemos un dropDown*/}
            <Dropdown 
              className="bg-background border-1 border-default-200"
              backdrop="blur"
              onOpenChange={(isOpen) => {
                // Aplica o elimina el atributo "inert" basado en si el dropdown está abierto
                const dropdownMenu = document.getElementById('dropdown-menu');
                if (dropdownMenu) {
                  dropdownMenu.inert = !isOpen;
                }
              }}
              >
              {/*Evento de dropdownTrigger*/}
              <DropdownTrigger>
                {/*Icono de 3 puntos verticales*/}
                <Button 
                  isIconOnly 
                  radius="full" 
                  size="sm" 
                  variant="light"
                >
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              {/*Menú de acciones al oprimir los 3 puntos*/}
              <DropdownMenu
              id="dropdown-menu" // Asignar un ID para facilitar la referencia
                aria-label="MenuActionKey"
                variant="bordered"
                itemClasses={{
                  base: [
                    //con bordeado
                    "rounded-md",
                    //Tamaño de texto 500
                    "text-default-500",
                    //Transición de la opacidad del blur
                    "transition-opacity",
                    "data-[hover=true]:text-foreground",
                    "dark:data-[hover=true]:bg-default-50",
                    "data-[selectable=true]:focus:bg-default-50",
                    "data-[pressed=true]:opacity-70",
                    "data-[focus-visible=true]:ring-default-500",
                  ],
                }}
                //Dependiendo de las acciones a oprimir teniendo 3 opciones (details, edit, delete)
                //Realizamos el evento OnAction()
                onAction={(key) => {
                  switch (key) {
                    //Caso details
                    case 'details':
                      //Establecemos la llave de acceso cómo Details
                      setActionKey("details");
                      //Establecemos el medidor seleccionado por el medidor seleccionado
                      setSelectedMeter(user)
                      //Abrir el PopModal del componente PopUpModal.jsx
                      onOpen();
                      break;
                    case 'edit':
                      //Establecemos la llave de acceso cómo Edit
                      setActionKey("edit")
                      //Establecemos el medidor seleccionado por el medidor seleccionado
                      setSelectedMeter(user)
                      //Abrir el PopModal del componente PopUpModal.jsx
                      onOpen()
                      // Aquí puedes agregar el código para ejecutar tu función para el item 2
                      break;
                    case 'delete':
                      //Establecemos la llave de acceso cómo Delate
                      setActionKey("delete")
                      //Establecemos el medidor seleccionado por el medidor seleccionado
                      setSelectedMeter(user)
                      //Abrir el PopModal del componente PopUpModal.jsx
                      onOpen()
                      // Aquí puedes agregar el código para ejecutar tu función para el item 3
                      break;
                    default:
                      console.error('No function for this item.');
                  }
                }}
                >
                {/*Item con la key Details*/}
                <DropdownItem
                  key='details'
                  className="hover:bg-default-100"
                >Ver Detalles
                </DropdownItem>
                {/*Item con la key Edit*/}
                <DropdownItem
                  key='edit'
                  className="hover:bg-default-100"
                >
                  Editar Datos
                </DropdownItem>
                {/*Item con la key delete*/}
                <DropdownItem
                  key='delete'
                  className="text-danger hover:bg-red-200"
                  color="danger"
                >
                  Eliminar Status
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "state":
        return (

          <Dropdown
            key={user.meter_id}
          >
          <DropdownTrigger>
              <Button 
              variant="bordered" 
              className="flex justify-center w-full whitespace-pre-wrap mt-2 z-[0] border-none px-0"
              >
              <div className="flex justify-center w-full h-full place-items-center">
                  <span className="font-inter text-black text-[14px] w-full text-center whitespace-pre-wrap h-auto">{visualInspection[user.meter_id].value}</span>
              </div>
              </Button>
          </DropdownTrigger>
          <DropdownMenu 
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              className="flex justify-center place-items-center"
              selectionMode="single"
              selectedKeys={visualInspection[user.meter_id].value}
              onSelectionChange={(keys)=>{
                console.log("Keys: ", keys.anchorKey)
                setSelectedKeys()
                updateValue(user.meter_id, keys.anchorKey);
                keys.anchorKey !== 'Sin observaciones' ? updateResult(user.meter_id, 'No apto') : updateResult(user.meter_id, 'Apto');
                addKey(user.meter_id);
              }
              }
          >
              <DropdownItem key="Sin observaciones">Sin observaciones</DropdownItem>
              <DropdownItem key="Punteros no sincronizados">Punteros no sincronizados</DropdownItem>
              <DropdownItem key="Cuerpo roto">Cuerpo roto</DropdownItem>
              <DropdownItem key="Rosca dañada">Rosca dañada</DropdownItem>
              <DropdownItem key="Polarizado">Polarizado</DropdownItem>
              <DropdownItem key="Sin tapa">Sin tapa</DropdownItem>
              <DropdownItem key="Mal grabado">Mal grabado</DropdownItem>
              <DropdownItem key="Sil filtro">Sil filtro</DropdownItem>
              <DropdownItem key="Sin tapa 2">Sin tapa 2</DropdownItem>
              <DropdownItem key="Registro roto">Registro roto</DropdownItem>
              <DropdownItem key="Elementos extraños">Elementos extraños</DropdownItem>
              <DropdownItem key="Marcas erróneas">Marcas erróneas</DropdownItem>
              <DropdownItem key="Puntero roto">Puntero roto</DropdownItem>
              <DropdownItem key="Otros">Otros</DropdownItem>
          </DropdownMenu>
      </Dropdown>
      );
        {/*
          <Input 
          className="w-full" 
          placeholder={cellValue}
          value={pruebaValue}
          onValueChange={handleValueChange}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
          ></Input>*/}
        
      default:
        return cellValue;
    }
  }, [visualInspection, selectedKeys]);

  
  console.log("Prueba: ", typeof(pruebaValue))

  //configuración tailwind para los componentes de la tabla de nextUI
  const classNames = React.useMemo(
    () => ({
      wrapper: ["w-full", "h-full flex justify-center items-center"],
      table:["h-full"],
      th: ["bg-oi-bg px-0 py-5 h-full", "text-default-500", "", "border-divider","text-center"],
      td: [ 
        //Agregar las celdas en la mitad del componente
        "align-middle text-center px-2",
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
        //"group-data-[selected=true]:before:bg-default/0" //Eliminar color del bg de la fila seleccionada
      ]
    }),
    [],
  );

  React.useEffect(() => {
    pruebaValue === '' ? setIsChanged(false) : setIsChanged(true)
  },[pruebaValue])

  const tableRow = React.useMemo(() => {
    return meters.map((item) => (
      <TableRow
          key={item.meter_id}
          //className={isChanged && item.test_id === '001' ? 'data-[selected=true]:bg-green-600 transition-colors duration-500' : 'transition-colors duration-500'}
      >
        {(columnKey) => 
        <TableCell
            >
                {renderCell(item, columnKey) === null ? 'NO DATA': renderCell(item, columnKey)}</TableCell>}
    </TableRow>
    ));
  }, [meters, headerColumns, isChanged, renderCell,selectedKeys, visualInspection])

    return (
        <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
            {modal}
            {confirmationMessage}
          <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Ensayo de presión estática</span>
          <span className="font-mulisg font-semibold text-opacity-text ">Sesion iniciada en Julio 24, 2024</span>
          <div className="w-full h-auto grid grid-cols-4 space-x-2 pt-2">
            <div className="col-span-3 bg-white shadow-lg px-7 flex flex-col space-x-2 rounded-[20px] items-center py-4">
              <span className="font-inter text-center w-full">Usted se encuentra en la orden No.</span>
              <span className="font-teko text-[32px] font-semibold w-full text-center">VI-001-2024</span>
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
          <div className="w-full flex flex-col flex-grow mb-5 h-[300px] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
            <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Inspección visual</span>
            <div className="w-5/6 rounded-[20px] bg-custom-blue h-2 mb-2 text-white">'</div>
            <div className="w-full flex h-[30svh] my-3">
                  <Table
                    isCompact
                    color='primary'
                    removeWrapper
                    aria-label="Example table with custom cells, pagination and sorting"
                    //bottomContent={bottomContent}
                    //bottomContentPlacement="outside"
                    className="bg-white p-4 rounded-lg h-full flex flex-col w-full overflow-auto"
                    checkboxesProps={{
                        classNames: {
                        wrapper: "before:bg:black text-white bg-gray-200 mt-1 rounded-lg p-1",
                        },
                    }}
                    selectionMode='multiple'
                    classNames={classNames}
                    selectedKeys={selectedKeys}
                    sortDescriptor={sortDescriptor}
                    //topContent={topContent}
                    //topContentPlacement="outside"
                    //onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
                    >
                    {/*{column.uid === "actions" ? "end" : "end"}*/}
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                        <TableColumn
                            key={column.uid}
                            align="start"
                            allowsSorting={false} //Column.sortable
                            className="text-center"
                            width="flex"
                        >
                            {column.name}
                        </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody 
                        emptyContent={"No se encontraros medidores"} 
                        items={meters}
                        className=""
                        loadingContent={
                        <Spinner 
                            label="Obteniendo Datos"
                            className='flex top-[200px]'
                            />
                            }
                        loadingState={loadingState}
                        isLoading={false} //isLoading
                        >
                        {tableRow}
                    </TableBody>
                </Table>
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
                setIsOpenCustomMessage(true)
                setIsChanged(!isChanged)
              }}
              >
              <span className="font-inter text-white text-center text-[16px]">regresar</span>
            </Button>
          </div>
        </div>
    )
}