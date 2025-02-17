import axios from 'axios';
import Cookies from 'js-cookie';
const baseUrl = 'https://1743-181-56-8-48.ngrok-free.app/api/';

// Configuracion comun para las solicitudes para los headers y la informacion por fuera del payload
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Evitar advertencia de ngrok en el navegadors
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});


// Servicio general para obtener datos (GET) de todas las estructuras de datos
const getAll = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams({
      ...params,
      _t: new Date().getTime() // Agrega un parámetro para evitar caché
    }).toString();

    const response = await axiosInstance.get(`${endpoint}?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error en Get todos: ', error);
    throw error.response ? error.response.data : 'Network Error';
  }
};


// Servicio general para obtener datos por id para todas las estructuras de datos
export const getByKey = async (endpoint, key) => {
  try {
    const response = await axiosInstance.get(`${endpoint}/${key}/`)
    return response.data;
  } catch (error) {
    console.error('Error ocurrido en Get by key: ', error)
    throw error.response ? error.response.data : 'Network Error';
  }
};

// Servicio general de creacion de estructuras de datos post
export const create = async (endpoint, data) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error creating data:', error);
    throw error.response ? error.response.data : 'Network Error';
  }
};

// Servicio general para actualizar registros
export const updateData = async (endpoint, data, method = 'PUT') => {
  try {
    const response = await axiosInstance({
      method: method.toUpperCase(),
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error.response ? error.response.data : 'Network Error';
  }
};

// Servicio general para eliminar un registro
export const deleteData = async (endpoint, key) => {
  try {
    const response = await axiosInstance.delete(`${endpoint}/${key}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error.response ? error.response.data : 'Network Error';
  }
};


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
export const updateMetersPrueba = async (pruebaId, updates) => {
  try {
    const response = await axios.put(`${baseUrl}pruebas/pruebas/${pruebaId}/update-medidores/`, updates, {
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

// Servicio para actualizar los valores de un medidor
export const updatePrueba = async (pruebaId, updates) => {
  try {
    const response = await axios.patch(`${baseUrl}pruebas/pruebas/${pruebaId}/`, updates, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prueba:', error);
    throw error.response ? error.response : 'Network Error';
  }
};

// Servicio para actualizar los valores de un medidor
export const updateMetersData = async (pruebaId, updates) => {
  try {
    const response = await axios.put(`${baseUrl}medidores/med/${pruebaId}/`, updates, {
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

// Servicio para actualizar los valores de un medidor
export const postMetersPrueba = async (pruebaId, meters) => {
  try {
    const response = await axios.post(`${baseUrl}pruebas/pruebas/${pruebaId}/assign-medidores/`, meters, {
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

// Servicio para el login del usuario
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('usuarios/api/token/', credentials);
    
    // Guardar en cookies con opciones seguras
    Cookies.set('token', response.data.access, { expires: 1, secure: true, sameSite: 'Strict' });
    Cookies.set('refreshToken', response.data.refresh, { expires: 7, secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify({ id: response.data.id, name: response.data.name, lastName: response.data.lastname, email: response.data.email }), { expires: 1, secure: true, sameSite: 'Strict' });

    return {
      token: response.data.access,
      refreshToken: response.data.refresh,
      user: { id: response.data.id, name: response.data.name, lastName: response.data.lastname, email: response.data.email },
      roles: [response.data.rol],
    };
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response ? error.response.data : 'Network Error';
  }
};


export default {
  loginUser,
  getAll,
  updateMetersData,
  getByKey,
  create,
  updateData,
  deleteData,
  getOrdenes,
  getMedidoresPrueba,
  updateMetersPrueba,
  postMeters,
  postMetersPrueba,
  updatePrueba
};