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
    Input,
    Autocomplete,
    AutocompleteItem,
    AutocompleteSection
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
        selectedMeterKeys,
        selectedKeys,
        maxCapacity,
    }
    ){

    //configuración tailwind para los componentes de la tabla de nextUI
    const classNames = React.useMemo(
        () => ({
            wrapper: ["w-full", "h-full flex justify-left items-center"],
            table:["h-full justify-start align-start text-left"],
            th: ["px-1 py-5 h-full", "text-default-500", "", "border-divider","text-center"],
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
                // Estilo condicional para filas seleccionadas
                ],
        }),[]);

        {/*
        const isDisabled = (item) => {
            // Encuentra la prueba seleccionada.
            const pruebaSeleccionada = pruebas.find((prueba) => selectedKeys.has(prueba.nombre));
        
            // Filtra las demás pruebas, excluyendo la seleccionada.
            const otrasPruebas = pruebas.filter((prueba) => prueba !== pruebaSeleccionada);
        
            // Verifica si `item.numero_serie` coincide con alguno de los medidores de las otras pruebas.
            return otrasPruebas.some((prueba) =>
                prueba.medidores?.some((medidor) => medidor.meter_id === item.numero_serie)
            );
        };
        */}

    const tableRow = React.useMemo(() => {

        return meters.map((item) => (
            <TableRow 
                //className={`${isDisabled(item) ? "pointer-events-none opacity-40" : ""}`}
                key={item.id}
                >
                {(columnKey) => 
                <TableCell
                    className=''
                    >
                        {renderCell(item, columnKey)}</TableCell>}
            </TableRow>
        ));
      }, [meters, headerColumns, selectedMeterKeys, selectedKeys])


    return(
        <div className="mt-5">
        <Autocomplete 
            className="w-full bg-gray-100 rounded-xl" 
            //onInputChange={onSearchChange}
            listboxProps={{
            hideSelectedIcon: true,
            itemClasses: {
                base: [
                "text-default-500",
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "dark:data-[hover=true]:bg-gray-100",
                "data-[pressed=true]:opacity-70",
                "data-[hover=true]:bg-default-200",
                "data-[selectable=true]:focus:bg-default-100",
                "data-[focus-visible=true]:ring-default-500",
                ],
            },
            }}
            aria-label="Select an employee"
            variant='flat'
            placeholder='Ingrese serial del medidor para buscar'
            popoverProps={{
            offset: 5,
            classNames: {
                base: "rounded-large",
                content: "p-1 border-small border-black bg-gray-100 justify-center items-center",
                itemClasses: "hover"
            },
            }}
            onSelectionChange={
                (key)=>{
                    const newSet = new Set([...selectedMeterKeys, key]);
                    newSet.size > maxCapacity ? null: setSelectedMeterKeys(newSet);
                    //setGatewayPost(key)
                }
            }

            onClear={() => {setFilterValue("")}}
            >
            {meters.map((meter) => (
                <AutocompleteItem key={meter.id} value={meter.medidor}>
                    {meter.medidor}
                </AutocompleteItem>
                ))
                }
        </Autocomplete>
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
                onSelectionChange={(keys) => {
                    keys.size > maxCapacity || keys === 'all' ? null: setSelectedMeterKeys(keys);
                }}                
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
                    {tableRow}
                </TableBody>
            </Table>
        </div>
    </div>
    )
}