import React from "react";
import {
    Table, //Componente tabla 
    TableHeader, //Componente header de la tabla
    TableColumn, //componente columnas de la tabla
    TableBody, //Componente body para identificar si poner algún texto o las celdas
    TableRow, //Componente que establece las filas de un registro
    TableCell, //Componente que representa una zelda de cada registro
    Spinner,
  } from "@nextui-org/react";
import renderCell from "../shared/table/renderCell";
import { useLocation } from 'react-router-dom';

export default function TableStatic({
    selectedKeys, 
    headerColumns,
    meters,
    loadingState,
    handleValidateError,
    handleValidateErrorInput
})
{
const location = useLocation();
      //configuración tailwind para los componentes de la tabla de nextUI
  const classNames = React.useMemo(
    () => ({
      wrapper: ["w-full", "h-full flex justify-center items-center"],
      table:["h-full"],
      th: ["bg-oi-bg px-0 py-2 px-2 h-full w-auto", "text-default-500", "", "border-divider","text-center"],
      td: [ 
        //Agregar las celdas en la mitad del componente
        "align-middle text-center",
        // changing the rows border radius
        // first,
        "group-data-[first=true]:rounded-tr-xl",
        "group-data-[first=true]:rounded-tl-xl",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
        "group-data-[last=true]:rounded-br-xl",
        "group-data-[last=true]:rounded-bl-xl",
        //"group-data-[selected=true]:before:bg-default/0" //Eliminar color del bg de la fila seleccionada
      ],
      tr: ["rounded-xl"]
    }),
    [],
  );

  const tableRow = React.useMemo(() => {
    return meters ? meters.map((item) => (
      <TableRow
          key={item.meter_id}
          //data-[selected=true]:
          className={handleValidateError(item.meter_id)}
          //className={item.meter_id === meters[0].meter_id ? 'text-green-500 bg-green-200 transition-colors duration-500' : 'transition-colors duration-500'}
      >
        {(columnKey) => 
        <TableCell
            >
                {renderCell(                        
                        item, // Asegúrate de pasar el item correctamente
                        columnKey, // Pasa columnKey directamente
                        null, // Añade setSelectedMeter si es necesario en renderCell
                        null, // Añade setActionKey si es necesario
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        meters,
                        handleValidateErrorInput,
                        location)}</TableCell>}
    </TableRow>
    )) : null;
  }, [meters, headerColumns, selectedKeys])

    return(
    <Table
        isCompact
        removeWrapper
        color="primary"
        aria-label="Example table with custom cells, pagination and sorting"
        //bottomContent={bottomContent}
        //bottomContentPlacement="outside"
        className="bg-white px-4 pb-4 rounded-lg h-full flex flex-col w-full overflow-auto"
        checkboxesProps={{
            classNames: {
            wrapper: "before:bg:black text-white bg-gray-200 mt-1 rounded-lg p-1",
            },
        }}
        selectionMode='none'
        classNames={classNames}
        selectedKeys={selectedKeys}
        >
        {/*{column.uid === "actions" ? "end" : "end"}*/}
        <TableHeader columns={headerColumns}>
            {(column) => (
            <TableColumn
                key={column.uid}
                align="start"
                allowsSorting={false} //Column.sortable
                className=""
                width="full"
                minWidth={"full"}
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
    )
}