import React, { useState, useEffect } from "react";
import { LuEye } from "react-icons/lu";
import { Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/modal";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import ModalData from "../shared/ModalData";
import DateService from "../../hook/services/dateService";
import CustomAlert from "../shared/CustomAlert";

// Importamos el servicio desde apiService
import apiService from "../../hook/services/apiService";

// Definición de columnas a mostrar en la tabla
const columns = [
  { name: "ID ORDEN", uid: "id_orden" },
  { name: "FECHA", uid: "fecha_programada" },
  { name: "CONCLUSION", uid: "conclusion" },
];

export default function MainClient() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [popUpData, setPopUpData] = useState(null);

  // Estado para almacenar datos del banco (que consultaremos por ID)
  const [dataModal, setDataModal] = useState({});
  const [customMessage, setCustomMessage] = useState(null);
  const [isOpenCustomMessage, setIsOpenCustomMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para TODAS las órdenes (sin filtrar)
  const [orders, setOrders] = useState([]);
  const [ordersLength, setOrdersLength] = useState(0);
  const loadingState = isLoading && ordersLength === 0 ? "loading" : "idle";

  // Estado para selección de la tabla
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState({});
  // Columnas visibles (si deseas mostrar solo un subset de columns)
  const [visibleColumns] = useState(new Set(["id_orden", "fecha_programada", "conclusion"]));

  // Info de usuario (por si la necesitas en el frontend)
  const [userData, setUserData] = useState({});
  // Orden seleccionada
  const [selectedOrder, setSelectedOrder] = useState(null);

  localStorage.setItem("count_secuencia", "0");

  useEffect(() => {
    // 1. Cargar info de usuario
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    } else {
      console.error("No se encontró información del usuario en localStorage.");
    }

    // 2. Llamar a la función que carga todos los datos
    fetchData();
  }, []);

  /**
   * Carga:
   * - Todas las órdenes de servicio (para que cualquier usuario las vea).
   * - Programación del usuario, para extraer el ID del banco.
   * - Detalles del banco usando ese ID.
   */
  async function fetchData() {
    try {
      setIsLoading(true);

      // a) Obtener TODAS las órdenes de servicio
      const allOrders = await apiService.getAll("ordenes/trabajo/");
      if (Array.isArray(allOrders)) {
        const mappedOrders = allOrders.map((order) => ({
          id_orden: order.identificador,
          nombre_orden: order.id,
          estado: order.estado,
          conclusion: order.observaciones || "Sin conclusión",
          fecha_programada: order.fecha_programada,
          capacidad_banco: order.capacidad_banco,
          marca_medidores: order?.medidores_asociados[0]?.registro_tecnico?.marca,
          modelo_medidores: order?.medidores_asociados[0]?.registro_tecnico?.modelo,
          tipo_medidores: order?.medidores_asociados[0]?.registro_tecnico?.id,
        }));
        setOrders(mappedOrders);
        setOrdersLength(mappedOrders.length);
      } else {
        console.error(
          "La respuesta de 'ordenes-servicio/' no es un array:",
          allOrders
        );
      }

      // b) Obtener la programación del usuario para extraer ID del banco
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const dateTransformed = DateService.getCurrentDate("YYYY-MM-DD");
        const params = { fecha: dateTransformed, usuario: user.id };
        const programacion = await apiService.getAll(
          `programacion/get/${user.id}/`
        );

        if (programacion) {
          // Este objeto se ve así:
          // { "id": 2, "usuarios": [2], "banco": 16, "fecha":..., "turno":..., "estado":... }
          const bancoId = programacion.banco; // 16

          // c) Con el ID del banco, hacemos otra llamada a la API para obtener sus detalles
          if (bancoId) {
            // Ajusta la ruta si tu API es diferente: p.e. "bancos/16/"
            const bancoDetails = await apiService.getAll(
              `bancos/get/${bancoId}/`
            );
            // Supongamos que 'bancoDetails' trae { id: 16, nombre: "Banco #16", habilitado: true, cert: "CertXYZ", ... }
            if (bancoDetails) {
              // Ajusta según lo que devuelva tu API
              const bancoData = {
                nBanco: bancoDetails.nombre || `Banco #${bancoDetails.id}`,
                habilitado: bancoDetails.habilitado ? "Habilitado" : "No Habilitado",
                cert: bancoDetails.cert || "Sin Certificado",
              };
              setDataModal(bancoData);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Hook de memo para columnas visibles
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // Renderizado de celdas
  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    return cellValue;
  };

  // Manejar selección de una orden en la tabla
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    localStorage.setItem("selectedOrderId", order.id_orden);

    // Guardar la info del banco actual en localStorage también (si lo necesitas)
    const sessionData = {
      selectedOrder: order,
      bancoData: dataModal,
    };
    localStorage.setItem("selectedOrderData", JSON.stringify(sessionData));
  };

  // Confirmar la acción de "Iniciar nueva prueba"
  const handleProceed = () => {
    if (!selectedOrder) {
      alert("Por favor, seleccione una orden de trabajo antes de continuar.");
      return;
    }
    setCustomMessage("Orden de trabajo seleccionada correctamente.");
    setIsOpenCustomMessage(true);
  };

  return (
    <div className="w-screen h-screen bg-oi-bg flex flex-col px-[5vw] overflow-y-auto">
      {/* Modal para ver detalles (banco, etc.) */}
      {isOpen && (
        <ModalData
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          popUpData={popUpData}
          dataBanco={dataModal}
        />
      )}

      {/* Alerta de confirmación */}
      {isOpenCustomMessage && (
        <CustomAlert
          message={customMessage}
          isVisible={isOpenCustomMessage}
          setIsVisible={setIsOpenCustomMessage}
          routeRedirect={"/client/static_1"}
        />
      )}

      <span className="font-mulish font-bold pt-5 text-[24px] justify-center">
        Bienvenido a la vista de operario
      </span>
      <span className="font-mulisg font-semibold text-opacity-text">
        Sesión iniciada en {DateService.getCurrentDate()}
      </span>

      <div className="w-full h-auto grid grid-cols-4 space-x-2 py-2">
        <div className="col-span-3 bg-white shadow-lg flex flex-col space-x-2 rounded-[20px] items-center py-4">
          <span className="font-inter text-center w-full px-2">Operario</span>
          <span className="font-teko text-[26px] w-full text-center">
            {`${userData.name ?? ""} ${userData.lastName ?? ""}` || "Cargando..."}
          </span>
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

      <div className="w-full flex flex-col h-auto bg-white shadow-lg rounded-[20px] mt-5 px-[7.5vw]">
        <span className="font-mulish font-bold text-[22px] pt-5 text-center">
          ¿Desea iniciar una nueva prueba?
        </span>
        <Button
          className="w-full flex flex-col overflow-x-3 items-center place-items-center h-auto bg-custom-blue my-3 py-2 rounded-[15px] text-center break-words cursos-pointer"
          onClick={handleProceed}
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
        <span className="font-mulish justify-center font-semibold text-[20px] mt-3 text-center">
          Órdenes de servicio
        </span>
        <div className="w-full flex-grow bg-red-100 mb-3">
          <Table
            isCompact
            removeWrapper
            color="primary"
            aria-label="Tabla de órdenes"
            selectedKeys={selectedKeys}
            selectionMode="single"
            sortDescriptor={sortDescriptor}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys).map((key) =>
                orders.find((order) => order.id_orden === key)
              );
              handleOrderSelect(selected[0]);
              setSelectedKeys(keys);
            }}
            onSortChange={setSortDescriptor}
            className="bg-white p-4 rounded-lg h-full flex flex-col w-full overflow-x-auto"
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align="start"
                  allowsSorting={false}
                  className="text-center"
                  width="flex"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"No se encontraron órdenes"}
              items={orders}
              loadingContent={
                <Spinner label="Obteniendo Datos" className="flex top-[200px]" />
              }
              loadingState={loadingState}
              isLoading={isLoading}
            >
              {(item) => (
                <TableRow key={item.id_orden}>
                  {(columnKey) => (
                    <TableCell className="text-center">
                      {renderCell(item, columnKey) === null
                        ? "NO DATA"
                        : renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}