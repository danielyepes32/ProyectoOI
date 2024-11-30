import axios from 'axios';
const baseUrl = 'https://2647-181-60-112-158.ngrok-free.app/api/';

//servicio para hacerle get a los valores de los medidores
const getOrdenes = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`ordenes/get/?format=json${queryString}`,{
      headers: {
        'ngrok-skip-browser-warning': 'true' // Agregar este encabezado
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

//servicio para hacerle get a los valores de los medidores
const getMedidoresPrueba = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`pruebas/get/?format=json${queryString}`,{
      headers: {
        'ngrok-skip-browser-warning': 'true' // Agregar este encabezado
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Servicio para actualizar los valores de un medidor
export const updateMetersPrueba = async (meterId, updates) => {
  try {
    const response = await axios.put(`${baseUrl}pruebas/update/${meterId}/`, updates, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating meter:', error);
    throw error.response ? error.response : 'Network Error';
  }
};



// Servicio para crear una nueva incidencia
export const postMeters = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}pruebas/update/6/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating incidencia:', error);
    throw error.response ? error.response.data : 'Network Error';
  }
};


export default {
  getOrdenes,
  getMedidoresPrueba,
  updateMetersPrueba, 
};
