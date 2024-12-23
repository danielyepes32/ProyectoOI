import React from "react";
import { CgSearch } from "react-icons/cg";
import { RiPlayListAddFill } from "react-icons/ri";
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

import renderCell from "../shared/table/renderCell";

export default function Meter_nc(
    {        
        sortDescriptor, 
        setSelectedMeterKeys, 
        setSortDescriptor,
        headerColumns,
        meters,
        loadingState,
        selectedMeterKeys
    }
    ){

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
        }),[]);

    return(
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
                        key={item.numero_serie}
                        >
                        {(columnKey) => 
                        <TableCell
                            className=''
                            >
                                {renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </div>
    )
}