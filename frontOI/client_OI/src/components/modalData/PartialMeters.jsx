import React from "react";
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

export default function PartialMeterSelection({
  meters,
  selectedMeterKeys,
  setSelectedMeterKeys,
  sortDescriptor,
  setSortDescriptor,
  headerColumns,
  pruebas,
}) {
  // Estilo de las tablas y celdas
  const classNames = React.useMemo(
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

  // Verificar si un medidor está deshabilitado
  const isDisabled = (item) => {
    const pruebaSeleccionada = pruebas.find((prueba) =>
      selectedMeterKeys.has(prueba.nombre)
    );
    const otrasPruebas = pruebas.filter((prueba) => prueba !== pruebaSeleccionada);
    return otrasPruebas.some((prueba) =>
      prueba.medidores?.some((medidor) => medidor.meter_id === item.numero_serie)
    );
  };

  // Crear filas de la tabla
  const tableRow = React.useMemo(() => {
    if (!meters) return null;
    return meters?.map((item) => (
      <TableRow
        key={item.numero_serie}
        className={`${isDisabled(item) ? "pointer-events-none opacity-40" : ""}`}
      >
        {(columnKey) => (
          <TableCell className="text-center">{item[columnKey]}</TableCell>
        )}
      </TableRow>
    ));
  }, [meters, selectedMeterKeys, pruebas]);

  // Renderización principal del componente
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
          checkboxesProps={{
            classNames: {
              wrapper: "bg-gray-200 mt-1 rounded-lg p-1",
            },
          }}
          classNames={classNames}
          selectedKeys={selectedMeterKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          onSelectionChange={setSelectedMeterKeys}
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
            loadingState={false} // Cambiar a true mientras se cargan los datos
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
        onPress={() => {
          // Confirmar selección
          alert("Medidores seleccionados confirmados");
        }}
      >
        Confirmar selección
      </Button>
    </div>
  );
}
