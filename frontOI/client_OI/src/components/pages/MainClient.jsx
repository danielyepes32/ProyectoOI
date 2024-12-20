import React, { useState, useEffect } from "react";
import { LuEye } from "react-icons/lu";
import { Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/modal";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import ModalData from "../shared/ModalData";
import DateService from "../../hook/services/dateService";
import { columns, DataPrueba } from "../../utils/tests/data";
import CustomAlert from "../shared/CustomAlert";


const INITIAL_VISIBLE_COLUMNS = ["test_id", "state", "result"];

export default function MainClient() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [popUpData, setPopUpData] = useState(null);
  const [customMessage, setCustomMessage] = useState(null);
  const [isOpenCustomMessage, setIsOpenCustomMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableBottoms, setDisableBottoms] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [meters, setMeters] = useState([]);
  const [metersLength, setMetersLength] = useState(0);
  const loadingState = isLoading && metersLength === 0 ? "loading" : "idle";

  const [userData, setUserData] = useState({}); // Estado para el usuario autenticado

  // Recuperar los datos del usuario al cargar el componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    } else {
      console.error("No se encontró información del usuario en localStorage.");
    }
  }, []);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "status":
        return (
          <Chip
            variant="dot"
            size="sm"
            classNames={{
              base: "w-auto h-auto px-1",
              content: "px-1",
              dot: `p-1 bg-${statusColorMap[user.status]}`,
            }}
            className="capitalize gap-4"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-center items-center text-center gap-5">
            {/* Opciones para cada acción */}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
      {isOpen && <ModalData isOpen={isOpen} onOpenChange={onOpenChange} popUpData={popUpData} />}
      {isOpenCustomMessage && <CustomAlert message={customMessage} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage} routeRedirect={"/client/static_1"} />}
      <span className="font-mulish font-bold pt-5 text-[24px] justify-center">Bienvenido a la vista de operario</span>
      <span className="font-mulisg font-semibold text-opacity-text">Sesión iniciada en {DateService.getCurrentDate()}</span>
      <div className="w-full h-auto grid grid-cols-4 space-x-2 py-2">
        <div className="col-span-3 bg-white shadow-lg flex flex-col space-x-2 rounded-[20px] items-center py-4">
          <span className="font-inter text-center w-full px-2">Operario </span>
          <span className="font-teko text-[26px] w-full text-center">{`${userData.name} ${userData.lastName}` || "Cargando..."}</span>
        </div>
        <div className="col-span-1 w-full flex justify-center place-items-center">
          <Button
            className="w-[50px] h-[50px] bg-custom-blue p-2 rounded-xl shadow-lg items-center"
            onClick={() => {
              setPopUpData("banco");
              onOpen();
            }}
          >
            <LuEye className="text-white w-[50px] h-[50px]" />
          </Button>
        </div>
      </div>
      {/* Restante de la tabla */}
      <div className="w-full flex flex-col h-auto bg-white shadow-lg rounded-[20px] mt-5 px-[7.5vw]">
        <span className="font-mulish font-bold text-[22px] pt-5 text-center">¿Desea iniciar una nueva prueba?</span>
        <Button 
            className="w-full flex flex-col overflow-x-3 items-center place-items-center h-auto bg-custom-blue my-3 py-2 rounded-[15px] text-center break-words cursos-pointer"
            onClick={() => {
                setIsOpenCustomMessage(true);
                console.log("Se oprime")
            }}
            >
                <span className="font-inter w-full text-[18px] h-full text-white justify-center flex text-center leading-tight">
                    Iniciar nueva prueba
                </span>
                <span className="font-inter w-full text-[18px] h-full text-white justify-center flex text-center leading-tight">
                    de sistemas OI
                </span>
        </Button>
      </div>
      <div className="w-full flex flex-col flex-grow mb-20 h-[300px] bg-white shadow-lg items-center place-items-center mt-5 rounded-[20px]">
        <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">Ultimas pruebas realizadas</span>
        <div className="w-full flex-grow bg-red-100 mb-3">
            <Table
                isCompact
                removeWrapper
                color='primary'
                aria-label="Example table with custom cells, pagination and sorting"
                //bottomContent={bottomContent}
                //bottomContentPlacement="outside"
                className="bg-white p-4 rounded-lg h-full flex flex-col w-full overflow-x-auto"
                checkboxesProps={{
                    classNames: {
                    wrapper: "before:bg:black text-white bg-gray-200 mt-1 rounded-lg p-1",
                    },
                }}
                classNames={1}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                //topContent={topContent}
                //topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
                >
                {/*{column.uid === "actions" ? "end" : "end"}*/}
                {console.log("Columnas_1: ",headerColumns)}
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        console.log("Columnas: ", column),
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
                {console.log("Sale del header")}
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
                    console.log("Datos de consulta", item),
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
    </div>
  );
}
