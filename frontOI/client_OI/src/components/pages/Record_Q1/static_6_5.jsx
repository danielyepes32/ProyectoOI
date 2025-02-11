import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { LuEye } from "react-icons/lu";
import { MdOutlineWbIncandescent } from "react-icons/md";
import { useDisclosure } from "@nextui-org/modal";
import ModalData from "../../shared/ModalData";
import CustomAlert from "../../shared/CustomAlert";
import DateService from "../../../hook/services/dateService";
import { useNavigate } from "react-router-dom";

export default function Static_6_5() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [popUpData, setPopUpData] = useState(null);
  const [isOpenCustomMessage, setIsOpenCustomMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState(null);

  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(0);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const [data, setData] = useState([
    { id: 1, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 2, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 3, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 4, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 5, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 6, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 7, entrada: "", salida: "", caudal: "", temperatura: "" },
    { id: 8, entrada: "", salida: "", caudal: "", temperatura: "" },
  ]);

  const RANGES = {
    entrada: { min: 8.0, max: 9.0 },
    salida: { min: 0.5, max: 0.8 },
    caudal: { min: 0.1, max: 20.0 },
    temperatura: { min: 0.1, max: 30.0 },
  };

  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const validRows = data.filter(
      (row) =>
        validateValue(row.entrada, "entrada") &&
        validateValue(row.salida, "salida") &&
        validateValue(row.caudal, "caudal") &&
        validateValue(row.temperatura, "temperatura")
    );
    setCanProceed(validRows.length >= 3);
  }, [data]);

  const validateValue = (value, key) => {
    if (!value) return false;
    const numValue = parseFloat(value.replace(",", "."));
    return numValue >= RANGES[key].min && numValue <= RANGES[key].max;
  };

  const handleInputChange = (id, key, value) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const handleConfirm = () => {
    setCustomMessage("¿Estás seguro de que deseas confirmar los valores?");
    setIsOpenCustomMessage(true);
  };

  const handleConfirmCM = async () => {
    try{    
      const count_secuencia = localStorage.getItem("count_secuencia");
      const puedeAvanzar = parseInt(count_secuencia) === 9; 

      if (!puedeAvanzar) {
        alert("No se puede avanzar: hay procesos pendientes o viene de la secuencia incorrecta");
        return false;
      } else {
        alert("Se avanzará a la siguiente ruta")
        localStorage.setItem("count_secuencia", "10");
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const confirmationMessage = isOpenCustomMessage ? (
    <CustomAlert
      message={customMessage}
      isVisible={isOpenCustomMessage}
      setIsVisible={setIsOpenCustomMessage}
      routeRedirect={"/client/Q1/static_7"} // No redirige automáticamente
      handleConfirm={handleConfirmCM}
    />
  ) : null;

  return (
    <div className="w-screen h-screen bg-white flex flex-col px-4 py-5 overflow-y-auto">
      {/* Modal */}
      <ModalData isOpen={isOpen} onOpenChange={onOpenChange} popUpData={popUpData} />
      {confirmationMessage}

      {/* Encabezado */}
      <div className="text-center">
        <h1 className="font-bold text-[24px] text-custom-blue mb-3">
          ENSAYO DE ERRORES DE INDICACIÓN
        </h1>
        <h2 className="font-semibold text-[16px] mb-3">
          Sesión iniciada en {DateService.getCurrentDate()}
        </h2>
      </div>

      {/* Prueba actual */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="col-span-3 bg-white shadow-lg px-4 flex justify-between items-center rounded-[30px]">
          <span className="font-inter text-center w-full pr-2">
            Usted se encuentra en la prueba
          </span>
          <span className="font-teko text-[48px] font-semibold text-right">
            Q1
          </span>
        </div>
        <div className="col-span-1 w-full flex justify-center items-center">
          <Button
            className="w-[50px] h-[50px] bg-custom-blue p-2 rounded-xl shadow-lg"
            onClick={() => {
              setPopUpData("banco");
              onOpen();
            }}
          >
            <LuEye className="text-white w-[50px] h-[50px]" />
          </Button>
        </div>
      </div>

      {/* Tabla de medición */}
      <div className="mt-5 bg-gray-100 p-5 rounded-lg shadow-md">
        <table className="w-full text-sm md:text-base border-collapse border border-gray-300">
          <thead className="bg-custom-blue text-white">
            <tr>
              <th className="border border-gray-300 p-2">Nº</th>
              <th className="border border-gray-300 p-2">
                Presiones dinámicas (Entrada)
              </th>
              <th className="border border-gray-300 p-2">
                Presiones dinámicas (Salida)
              </th>
              <th className="border border-gray-300 p-2">Caudal de Agua</th>
              <th className="border border-gray-300 p-2">Temperaturas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="text-center">
                <td className="border border-gray-300 p-2">{row.id}</td>
                {["entrada", "salida", "caudal", "temperatura"].map((key) => (
                  <td
                    key={key}
                    className={`border border-gray-300 p-2 ${
                      !validateValue(row[key], key) && row[key]
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={row[key]}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-300"
                      placeholder={`${
                        RANGES[key].min
                      }-${RANGES[key].max}`}
                      onChange={(e) =>
                        e.target.value.length < 6 ? handleInputChange(row.id, key, e.target.value) : null
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón Confirmar */}
      <div className="flex justify-start mt-5">
        <Button
          disabled={!canProceed}
          className={`${
            canProceed ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
          } text-white font-bold px-5 py-2 rounded-md text-sm md:text-base`}
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}