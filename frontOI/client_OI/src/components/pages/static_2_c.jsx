import {  
    Dropdown,  
    DropdownTrigger,  
    DropdownMenu,  
    DropdownSection,  
    DropdownItem
} from "@nextui-org/dropdown";
import React from "react";
import { Button } from "@nextui-org/react";
import { FaCaretDown } from "react-icons/fa";
import { BsArrow90DegRight } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import { CgSearch } from "react-icons/cg";
import { RiPlayListAddFill } from "react-icons/ri";
import {  
    Modal,   
    ModalContent,   
    ModalHeader,   
    ModalBody,   
    ModalFooter,
    useDisclosure
} from "@nextui-org/modal";
import {
    Table, //Componente tabla 
    TableHeader, //Componente header de la tabla
    TableColumn, //componente columnas de la tabla
    TableBody, //Componente body para identificar si poner algún texto o las celdas
    TableRow, //Componente que establece las filas de un registro
    TableCell, //Componente que representa una zelda de cada registro
    Spinner,
    Input
  } from "@nextui-org/react";
import {columns, DataPrueba} from "../../utils/tests/data"  //"../../utils/tests/data";
import CustomAlert from "../shared/CustomAlert";


//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["test_id"];

export default function Static_2_c() {

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const [selectedMeterKeys, setSelectedMeterKeys] = React.useState(new Set());
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
    const [customMessage, setCustomMessage] = React.useState(null);
    //Constante para establecer las columnas visibles puesto que estas son dinamicas
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    //Variable que establece la columna y el orden de filtrado para la consulta, es un JSON con el nombre de columna
    //y el orden (ascending, descending)
    const [sortDescriptor, setSortDescriptor] = React.useState({});
    //En esta variable se guardarán los medidores que se extraigan de la API
    const [meters, setMeters] = React.useState(DataPrueba);
    //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
    const [metersLength, setMetersLength] = React.useState(DataPrueba.length);
    //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
    const [isLoading, setIsLoading] = React.useState(true);
   //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
    const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );

    //---------------------------------------------------------------------------------------------------------------------------
    //Aquí se encuentran las funciones usadas en el componente MainClient
    //Esta función se usa para calcular las columnas que se etsablecen como visibles
    const headerColumns = React.useMemo(() => {

        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

    const modal = React.useMemo(() => {
        return (
            <Modal 
            isOpen={isOpen} 
            placement="center"
            onOpenChange={onOpenChange}
            className="mx-5"
            hideCloseButton
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <div className="mt-5">
                    <Input
                        color="primary"
                        className="text-black"
                        classNames={{
                            label: "text-black",
                            input: ["text-black"]
                        }}
                        endContent={<CgSearch/>}
                        startContent={<RiPlayListAddFill />}
                        placeholder="Autocomplete para los medidores"
                        >
                        Autocomplete
                    </Input>
                    <div className="w-full flex-grow bg-red-100 mb-3">
                        <Table
                            isCompact
                            removeWrapper
                            color='primary'
                            aria-label="Example table with custom cells, pagination and sorting"
                            //bottomContent={bottomContent}
                            //bottomContentPlacement="outside"
                            className="bg-white py-4 rounded-lg h-full flex flex-col w-full overflow-x-auto"
                            checkboxesProps={{
                                classNames: {
                                wrapper: "before:bg:black text-white bg-gray-200 mt-1 rounded-lg p-1",
                                },
                            }}
                            classNames={classNames}
                            selectedKeys={selectedMeterKeys}
                            selectionMode="multiple"
                            sortDescriptor={sortDescriptor}
                            //topContent={topContent}
                            //topContentPlacement="outside"
                            onSelectionChange={setSelectedMeterKeys}
                            onSortChange={setSortDescriptor}
                            >
                            {/*{column.uid === "actions" ? "end" : "end"}*/}
                            {/*console.log("Columnas_1: ",headerColumns)*/}
                            <TableHeader columns={headerColumns}>
                                {(column) => (
                                    //console.log("Columnas: ", column),
                                <TableColumn
                                    key={column.uid}
                                    align="start"
                                    allowsSorting={column.sortable}
                                    className="text-center"
                                    width="flex"
                                >
                                    {column.name}
                                </TableColumn>
                                )}
                            </TableHeader>
                            {/*console.log("Sale del header")*/}
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
                                {(item) => (
                                //console.log("Datos de consulta", item),
                                <TableRow 
                                    className=""
                                    key={item.test_id}
                                    >
                                    {(columnKey) => 
                                    <TableCell
                                        className=''
                                        >
                                            {renderCell(item, columnKey) === null ? 'NO DATA': renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    </div>
                  </ModalBody>  
                </>
              )}
            </ModalContent>
          </Modal>    
        );
    }, [isOpen,selectedMeterKeys, sortDescriptor]);


    //Funcion callback al obtener datos para la tabla dependiendo del columkey
    //Se establece un render con el user que representa la llave de medidor seleccionado y la llave de columna 
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        console.log("Llega al render cell")

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
        default:
            return cellValue;
        }
    }, []);

    //configuración tailwind para los componentes de la tabla de nextUI
    const classNames = React.useMemo(
        () => ({
        wrapper: ["w-full", "h-full flex justify-left items-center"],
        table:["h-full justify-start align-start text-left"],
        th: ["bg-oi-bg px-1 py-5 h-full", "text-default-500", "", "border-divider","text-center"],
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
        ],
        }),
        [],
    );

    const confirmationMessage = React.useMemo(() => {
        console.log(isOpenCustomMessage)
        return isOpenCustomMessage === true ? (
          <CustomAlert message={customMessage} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage}></CustomAlert>
        ) : null
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
                    <span className="font-inter font-semibold text-opacity-text text-[16px] ml-4">Orden Seleccionada</span>
                    <Dropdown
                        >
                        <DropdownTrigger>
                            <Button 
                            variant="bordered" 
                            className="capitalize mt-2 z-[0]"
                            >
                            <div className="flex justify-between w-full">
                                <span className="font-teko font-semibold text-black text-[24px]">{selectedKeys}</span>
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
                            <DropdownItem key="text">Text</DropdownItem>
                            <DropdownItem key="number">Number</DropdownItem>
                            <DropdownItem key="date">Date</DropdownItem>
                            <DropdownItem key="single_date">Single Date</DropdownItem>
                            <DropdownItem key="iteration">Iteration</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="ml-3 bg-white w-2/6 h-auto rounded-[20px] flex flex-col justify-center place-items-center">
                    <span className="font-inter font-semibold text-opacity-text text-[16px] mt-3">Capacidad</span>
                    <span className="font-teko font-semibold text-[40px]">10</span>
                </div>
            </div>
            <Button 
                className="flex justify-center place-items-center bg-custom-blue w-full my-[3vh] h-auto py-2"
                >
                <span className="font-inter text-[15px] text-center text-white">Medidores disponibles en orden (350ud)</span>
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
                        <span className="font-teko font-semibold text-[40px]">6</span>
                    </div>
                    <div className="ml-3 bg-white w-[45%] h-auto rounded-[20px] flex flex-col place-items-center">
                        <span className="font-inter font-semibold text-center text-opacity-text text-[16px] mt-3">Modificar selección</span>
                        <Button
                            isIconOnly
                            className="my-2 bg-white"
                            onClick={onOpen}
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