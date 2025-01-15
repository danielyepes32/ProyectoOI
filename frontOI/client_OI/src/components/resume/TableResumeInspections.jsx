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

export default function TableResumeInspection(
    {
        selectedKeys, 
        headerColumns,
        meters,
        loadingState,
        updateResult,
        updateValidate,
        handleEnterAction,
        selectedQ,
        onOpen,
        setSelectedMeter,
        setPopUpData
    }
){

    //configuración tailwind para los componentes de la tabla de nextUI
    const classNames = React.useMemo(
        () => ({
        wrapper: ["w-full", "h-full flex justify-center items-center"],
        table:["h-full w-full py-1 px-1"],
        th: ["bg-oi-bg px-1 py-1 h-full", "text-default-500 text-[12px]", "", "border-divider","text-center"],
        tr: ["px-2"],
        td: [ 
            //Agregar las celdas en la mitad del componente
            "align-middle text-center px-0 py-2 text-[13px]",
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
        [selectedKeys],
    );

    const tableRow = React.useMemo(() => {
        return meters ? meters.map((item) => (
          <TableRow
              key={item.meter_id}
              //className={isChanged && item.test_id === '001' ? 'data-[selected=true]:bg-green-600 transition-colors duration-500' : 'transition-colors duration-500'}
          >
            {(columnKey) => 
            <TableCell
                >
                {renderCell(
                    item, // Asegúrate de pasar el item correctamente
                    columnKey, // Pasa columnKey directamente
                    setSelectedMeter, // Añade setSelectedMeter si es necesario en renderCell
                    setPopUpData, // Añade setActionKey si es necesario
                    onOpen,
                    null,
                    updateResult,
                    null,
                    null,
                    updateValidate,
                    meters,
                    null,
                    null,
                    handleEnterAction,
                    selectedQ
                )}
            </TableCell>}
        </TableRow>
        )) : null;
      }, [meters, headerColumns])


    return(
    <Table
        isCompact={false}
        color='primary'
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        className="bg-white px-2 rounded-lg h-auto flex flex-col w-full overflow-auto"
        checkboxesProps={{
            classNames: {
            wrapper: "before:bg:black text-white bg-gray-200 rounded-lg ",
            },
        }}
        classNames={classNames}
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
    )
}