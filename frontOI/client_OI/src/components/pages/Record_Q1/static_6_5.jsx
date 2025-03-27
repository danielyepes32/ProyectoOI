import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { LuEye } from "react-icons/lu";
import { useDisclosure } from "@nextui-org/modal";
import ModalData from "../../shared/ModalData";
import CustomAlert from "../../shared/CustomAlert";
import DateService from "../../../hook/services/dateService";
import VariationBar from "../../dataVariation/VariationBar";

export default function Static_6_5() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [popUpData, setPopUpData] = useState(null);
  const [isOpenCustomMessage, setIsOpenCustomMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState(null);

  const [maxDPIvar, setMaxDPIvar] = useState(10);
  const [maxDPOvar, setMaxDPOvar] = useState(10);
  const [maxFlowvar, setMaxFlowvar] = useState(5);
  const [maxTemp, setMaxTemp] = useState(5);

  const [validateDPIvar, setValidateDPIvar] = useState(true);
  const [validateDPOvar, setValidateDPOvar] = useState(true);
  const [validateFlowvar, setValidateFlowvar] = useState(true);
  const [validateTempvar, setValidateTemp] = useState(true);

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
    entrada: { min: 0.1, max: 10 },
    salida: { min: 0.1, max: 10 },
    caudal: { min: 5, max: 30 },
    temperatura: { min: 0.1, max: 30.0 },
  };

  const [canProceed, setCanProceed] = useState(false);

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

  const validateValue = (value, key) => {
    if (!value) return false;
    const numValue = parseFloat(value.replace(",", "."));
    return numValue >= RANGES[key].min && numValue <= RANGES[key].max;
  };

  const validRows = React.useMemo(() => {
    return data.filter(
      (row) =>
        validateValue(row.entrada, "entrada") &&
        validateValue(row.salida, "salida") &&
        validateValue(row.caudal, "caudal") &&
        validateValue(row.temperatura, "temperatura")
    );
  }, [data, RANGES]);
  
  React.useEffect(() => {
    setCanProceed(validRows.length >= 3);
  }, [validRows, setCanProceed]);

  const handleInputChange = (id, key, value) => {
    setData((prevData) =>
        prevData.map((row) => (row.id === id ? { ...row, [key]: value } : row))
      );
  };

  const calculateVariation = (data, field) => {
    const values = data
      .filter((d) => d[field] !== "" && d[field] !== "0") // Filtra valores vacíos o "0"
      .map((d) => parseFloat(d[field])); // Convierte a número
  
    if (values.length === 0) return 0; // Retorna 0 si no hay valores válidos
  
    const minValue = Math.min(...values); // Obtiene el menor valor
    const maxValue = Math.max(...values); // Obtiene el mayor valor
    const promedio = (minValue + maxValue) / 2;
    const diff = ((maxValue - minValue) / promedio) * 100; // Calcula la variación %

    switch (field) {
      case "entrada":
        if (diff > maxDPIvar) {
          setValidateDPIvar(false);
        } else {
          setValidateDPIvar(true);
        }
        break;
      case "salida":
        if (diff > maxDPOvar) {
          setValidateDPOvar(false);
        } else {
          setValidateDPOvar(true);
        }
        break;
      case "caudal":
        if (diff > maxFlowvar) {
          setValidateFlowvar(false);
        } else {
          setValidateFlowvar(true);
        }
        break;
      case "temperatura":
        const tempvar = maxValue - minValue;
        if (tempvar > maxTemp) {
          setValidateTemp(false);
        } else {
          setValidateTemp(true);
        }
        break;
      default:
        return; // O no hacer nada si no es uno de los casos
    }  
  
    return field === 'temperatura' ? maxValue - minValue : diff.toFixed(3); // Retorna con 3 decimales
  };

  const confirmationMessage = isOpenCustomMessage ? (
    <CustomAlert
      message={customMessage}
      isVisible={isOpenCustomMessage}
      setIsVisible={setIsOpenCustomMessage}
      routeRedirect={"/client/Q1/static_7"} // No redirige automáticamente
      handleConfirm={handleConfirmCM}
    />
  ) : null;

  const variationBar = React.useMemo(()=>{
    return(
      <>
      <tr className="text-center bg-custom-blue text-white font-inter">
        <td className="border border-gray-300 p-2 w-full" colSpan="100%">
            Variación (%)
        </td>
        </tr>
        <tr className="text-center text-gray-400 font-inter">
        <td className="border border-gray-300 p-2 w-1/4">
            {calculateVariation(data, "entrada")}
        </td>
        <td className="border border-gray-300 p-2 w-1/4">
            {calculateVariation(data, "salida")}
        </td>
        <td className="border border-gray-300 p-2 w-1/4">
            {calculateVariation(data, "caudal")}
        </td>
        <td className="border border-gray-300 p-2 w-1/3">
            {calculateVariation(data, "temperatura")}
        </td>
      </tr>
      </>
    )
  },[data])

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
      <div className="grid grid-cols-4 gap-4 my-4">
        <div className="col-span-3 bg-white shadow-lg px-4 flex justify-between items-center rounded-[30px]">
          <span className="font-inter text-center w-full pr-2">
            Usted se encuentra en la prueba
          </span>
          <span className="font-teko text-[48px] font-semibold text-right">
            Q2
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

      <VariationBar
        validateDPIvar={validateDPIvar}
        validateDPOvar={validateDPOvar}
        validateFlowvar={validateFlowvar}
        validateTempvar={validateTempvar}
        maxDPIvar={maxDPIvar}
        maxDPOvar={maxDPOvar}
        maxFlowvar={maxFlowvar}
        maxTemp={maxTemp}
      />

      {/* Tabla de medición */}
      <div className="mt-5 bg-gray-100 p-5 rounded-lg shadow-md">
      <table className="w-full text-sm md:text-base rounded-lg table-fixed h-full justify-center place-items-center border-collapse border border-gray-300 overflow-x-hidden">
          <thead className="bg-custom-blue text-white h-auto">
          <tr className="justify-center border place-items-center h-full">
              <th className="border-l border-r w-1/4 border-gray-300 p-2 text-center align-middle leading-none">
              <span className="flex items-center justify-center w-full h-full">
                  Presiones dinámicas (Entrada)
              </span>
              </th>
              <th className="border-l border-r w-1/4 border-gray-300 p-2 text-center align-middle leading-none">
              <span className="flex items-center justify-center w-full h-full">
              Presiones dinámicas (Salida)
              </span>
              </th>
              <th className="border-l border-r w-1/4 border-gray-300 p-2 text-center align-middle leading-none">
              <span className="flex items-center justify-center w-full h-full">
              Caudal de agua
              </span>
              </th>
              <th className="border-l border-r w-1/3 border-gray-300 p-2 h-full text-center align-middle leading-none">
              <div className="flex justify-center place-items-center">
                  <span className="text-center">Temperatura</span>
              </div>
              </th>
          </tr>
          </thead>
          <tbody className="flex-col justify-between flex-grow overflow-auto">
          {data.map((row) => (
              <tr key={row.id} className="text-center flex-col ">
              {["entrada", "salida", "caudal", "temperatura"].map((key) => (
                  <td
                  key={key}
                  className={`border border-gray-300 p-2 
                  ${key === "temperatura" ? "w-1/3" : "w-1/4"} 
                  ${
                      !validateValue(row[key], key) && row[key]
                      ? "bg-red-100"
                      : ""
                  }`}
                  >
                  <input
                      type="number"
                      max={RANGES[key].max}
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
          {variationBar}
          </tbody>
        </table>  
      </div>

      {/* Botón Confirmar */}
      <div className="flex justify-center mt-5">
        <Button
          disabled={!canProceed}
          className={`${
            canProceed ? "bg-custom-blue" : "bg-gray-300 cursor-not-allowed"
          } text-white font-bold px-5 py-2 text-sm md:text-base`}
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}