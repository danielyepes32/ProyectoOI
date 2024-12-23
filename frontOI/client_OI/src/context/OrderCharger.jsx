import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const OrderContext = createContext();

// Proveedor del contexto
export const OrderProvider = ({ children }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dataModal, setDataModal] = useState({});
  const [userData, setUserData] = useState({});

  // Cargar datos desde localStorage al inicializar
  useEffect(() => {
    const storedOrder = localStorage.getItem("selectedOrder");
    const storedModalData = localStorage.getItem("dataModal");
    const storedUserData = localStorage.getItem("userData");

    if (storedOrder) setSelectedOrder(JSON.parse(storedOrder));
    if (storedModalData) setDataModal(JSON.parse(storedModalData));
    if (storedUserData) setUserData(JSON.parse(storedUserData));
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (selectedOrder) localStorage.setItem("selectedOrder", JSON.stringify(selectedOrder));
    if (dataModal) localStorage.setItem("dataModal", JSON.stringify(dataModal));
    if (userData) localStorage.setItem("userData", JSON.stringify(userData));
  }, [selectedOrder, dataModal, userData]);

  return (
    <OrderContext.Provider value={{ selectedOrder, setSelectedOrder, dataModal, setDataModal, userData, setUserData }}>
      {children}
    </OrderContext.Provider>
  );
};
