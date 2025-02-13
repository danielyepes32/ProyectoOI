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

export default function TableVisualInspection(
    {
        selectedKeys, 
        headerColumns,
        meters,
        loadingState,
        visualInspection,
        updateResult,
        updateValue,
        addKey,
    }
){

    //configuración tailwind para los componentes de la tabla de nextUI
    const classNames = React.useMemo(
        () => ({
        wrapper: ["w-full", "h-full flex justify-center items-center"],
        table:["h-full w-full"],
        th: ["bg-oi-bg px-1 py-5 h-full", "text-default-500 text-[12px]", "", "border-divider","text-center"],
        td: [ 
            //Agregar las celdas en la mitad del componente
            "align-middle text-center px-2 text-[13px]",
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
            "group-data-[selected=true]:before:bg-default/0" //Eliminar color del bg de la fila seleccionada
        ]
        }),
        [],
    );

    const tableRow = React.useMemo(() => {
        console.dir(meters, {depth: null});

        return meters ? meters.map((item) => (
          <TableRow
              key={item.meter_id}
              className={`${
                window.location.pathname === "/client/Q3/static_5" ?
                selectedKeys.has(item.meter_id)
                    ? item.result === "No apto" && item.obs === "Conforme"
                        ? "bg-red-100 opacity-50 pointer-events-none"
                        : item.obs === "Conforme"
                            ? "bg-blue-100"
                            : "bg-red-100"
                    : item.result === "No apto" 
                        ? "bg-red-100"
                        : ""
                    : selectedKeys.has(item.meter_id)
                        ? item.result === "No apto" || item.obs === "No conforme"
                            ? "bg-red-100"
                            : "bg-blue-100"
                        : item.result === "No apto"
                            ? "bg-red-100"
                            : ""
              }`}
                       
            >
            {(columnKey) => 
            <TableCell>
                {renderCell(
                    item, // Asegúrate de pasar el item correctamente
                    columnKey, // Pasa columnKey directamente
                    null, // Añade setSelectedMeter si es necesario en renderCell
                    null, // Añade setActionKey si es necesario
                    null,
                    visualInspection,
                    updateResult,
                    updateValue,
                    addKey
                )}
            </TableCell>}
        </TableRow>
        )) : null;
      }, [meters, headerColumns, visualInspection])


    return(
    <Table
        isCompact
        color='primary'
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        className="bg-white px-2 pt-4 pb-6 rounded-lg h-full flex flex-col w-full overflow-auto"
        checkboxesProps={{
            classNames: {
            wrapper: "before:bg:black text-white bg-gray-200 mt-1 rounded-lg p-1",
            },
        }}
        selectionMode='multiple'
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