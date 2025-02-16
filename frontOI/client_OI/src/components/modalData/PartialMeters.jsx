import React, { useMemo } from "react";
import { CgSearch } from "react-icons/cg";
import { RiPlayListAddFill } from "react-icons/ri";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Input,
  Button,
} from "@nextui-org/react";
import renderCell from "../shared/table/renderCell";

export default function PartialMeterSelection({
  meters,
  selectedMeterKeys,
  setSelectedMeterKeys,
  sortDescriptor,
  setSortDescriptor,
  headerColumns,
  pruebas,
  selectedPruebaKey, // Prueba actualmente seleccionada
  onConfirmSelection, // Callback para manejar la confirmación
  pruebaCapacity, // Capacidad de la prueba activa
}) {
  // Estilo de las tablas y celdas
  const classNames = useMemo(
    () => ({
      wrapper: ["w-full", "h-full flex justify-left items-center"],
      table: ["h-full justify-start align-start text-left"],
      th: ["px-1 py-5 h-full", "text-default-500", "border-divider", "text-center"],
      td: [
        "align-middle text-center px-2",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  // Determinar si un medidor está deshabilitado
  const isDisabled = (item) => {
    const otrasPruebas = pruebas?.filter(
      (prueba) => prueba.nombre !== selectedPruebaKey
    );
    return otrasPruebas?.some((prueba) =>
      prueba.medidores?.some((medidor) => medidor.meter_id === item.numero_serie)
    );
  };

  // Crear filas de la tabla
  const tableRow = useMemo(() => {
    return meters.map((item) => (
      <TableRow
        className={`${isDisabled(item) ? "pointer-events-none opacity-40" : ""}`}
        key={item.id}
      >
        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
      </TableRow>
    ));
  }, [meters, selectedMeterKeys, pruebas, selectedPruebaKey]);

  // Manejar confirmación de selección
  const handleConfirmSelection = () => {

    console.log("Entra")
    console.log("SelectedMeterKeys: ", selectedMeterKeys)
    console.log("Prueba capacity: ", pruebaCapacity)

    if (selectedMeterKeys.size > pruebaCapacity) {
      alert(`Solo puedes seleccionar hasta ${pruebaCapacity} medidores.`);
      return;
    }

    // Llamar al callback con los medidores seleccionados
    onConfirmSelection(Array.from(selectedMeterKeys));
  };

  const handleSelectionKeys = (selectedValue) => {
// Convertir selectedValue en un array
    const selectedArray = Array.from(selectedValue);
  
    if (selectedArray.length >= 2) {
      if(selectedValue.size > selectedMeterKeys.size){
        // Ordenar correctamente como números
        const sortedArray = selectedArray.map(Number).sort((a, b) => a - b);

        // Obtener minValue y maxValue
        const [minValue, maxValue] = [sortedArray[0], sortedArray[sortedArray.length - 1]];
    
        // Filtrar los meters y asegurarse de que todos sean strings
        const filteredMeters = meters
          .filter(meter => String(meter.id) >= minValue && String(meter.id) <= maxValue)
          .map(meter => String(meter.id));
        
        setSelectedMeterKeys(new Set(filteredMeters));
      } else {

        const ArraySelected = Array.from(selectedMeterKeys)

        const missingValue = ArraySelected.filter(value => !selectedArray.includes(value));

        // Ordenar correctamente como números
        const sortedArray = selectedArray.map(Number).sort((a, b) => a - b);
        // Obtener minValue y maxValue
        const [minValue, maxValue] = [sortedArray[0], sortedArray[sortedArray.length - 1]];

        // Filtrar los meters y asegurarse de que todos sean strings
        const filteredMeters = meters
          .filter(meter => String(meter.id) >= minValue && String(meter.id) <= missingValue)
          .map(meter => String(meter.id));
        
        setSelectedMeterKeys(new Set(filteredMeters));
      }
    } else {
      // Si hay menos de 2 elementos seleccionados, actualizar normalmente
      setSelectedMeterKeys(new Set(selectedArray));
    }
  };
  
  
  
  


  return (
    <div className="mt-5">
      {/* Input para búsqueda */}
      <Input
        color="primary"
        className="text-black"
        classNames={{
          label: "text-black",
          input: ["text-black"],
        }}
        endContent={<CgSearch />}
        startContent={<RiPlayListAddFill />}
        placeholder="Buscar medidores..."
      />

      {/* Tabla de medidores */}
      <div className="w-full flex-grow bg-white mb-3">
      <Table
        isCompact
        removeWrapper
        color="primary"
        aria-label="Tabla de selección parcial"
        className="bg-white py-4 rounded-lg h-full flex flex-col w-full overflow-x-auto"
        selectionMode="multiple" // Permite selección múltiple
        selectedKeys={selectedMeterKeys} // Llave vinculada al estado
        onSelectionChange={(keys) => handleSelectionKeys(keys)} // Manejo del cambio
        checkboxesProps={{
          classNames: {
            wrapper: "bg-gray-200 mt-1 rounded-lg p-1",
          },
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >

          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align="start"
                allowsSorting={column.sortable}
                className="text-center"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No se encontraron medidores"}
            items={meters}
            loadingContent={
              <Spinner label="Cargando medidores..." className="flex top-[200px]" />
            }
            loadingState={false}
          >
            {tableRow}
          </TableBody>
        </Table>
      </div>

      {/* Botón para confirmar selección */}
      <Button
        auto
        color="primary"
        className="w-full mt-4"
        onPress={handleConfirmSelection}
      >
        Confirmar selección
      </Button>
    </div>
  );
}
