const columns = [
  {name: "ID ORDEN", uid: "test_id", sortable: true},
  {name: "ESTADO", uid: "state", sortable: true},
  {name: "CONCLUSION", uid: "result", sortable: true},
];

const meterColumns = [
  {name: "", uid : "checkbox", sortable: true},
  {name: "SERIE", uid: "meter_id", sortable: true},
  {name: "ESTADO", uid: "state", sortable: true},
  {name: "ESTADO", uid: "drain", sortable: true},
  {name: "CONCLUSION", uid: "result", sortable: true},
  {name: "CONCLUSION", uid: "obs", sortable: true},
  {name: "NUMERO", uid: "num", sortable: true},
  {name: "LECTURA (Li)", uid: "record_li", sortable: true},
  {name: "LECTURA (Lf)", uid: "record_lf", sortable: true},
  {name: "ERROR", uid : "error", sortable: true},
  {name: "Q3", uid : "q3", sortable: true},
  {name: "Q2", uid : "q2", sortable: true},
  {name: "Q1", uid : "q1", sortable: true},
  {name: "CONCLUSION", uid: "resume", sortable: true},
  {name: "", uid : "actions", sortable: true},
];

const orderColumns = [
  {name: "", uid : "checkbox", sortable: true},
  {name: "SERIE", uid: "meter_id", sortable: true},
  {name: "ESTADO", uid: "state", sortable: true},
  {name: "CONCLUSION", uid: "result", sortable: true},
  {name: "CONCLUSION", uid: "obs", sortable: true},
  {name: "NUMERO", uid: "num", sortable: true},
  {name: "LECTURA (Li)", uid: "record_li", sortable: true},
  {name: "LECTURA (Lf)", uid: "record_lf", sortable: true},
  {name: "ERROR", uid : "error", sortable: true},
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
];

const columnsAlarms = [
  {name: "ID", uid: "id", sortable: true},
  {name: "CODIGO MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FECHA DE REPORTE", uid: "fecha", sortable: true},
  {name: "DESC. FALLA", uid : "falla_desc", sortable: true},
  {name: "CATEGORIA", uid : "tipo", sortable: true},
  {name: "TIPO FALLA", uid: "falla_type", sortable: true},
  {name: "ACCIONES", uid : "actions", sortable: true},
];

const columnsStatus = [
  {name: "ID ALARMA", uid: "alarm_pk", sortable: true},
  {name: "CODIGO MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FECHA DE ALARMA", uid: "alarm_date", sortable: true},
  {name: "DESC. FALLA", uid : "falla_desc", sortable: true},
  {name: "TIPO FALLA", uid : "falla_type", sortable: true},
];

const columnsGateways = [
  {name: "ID GATEWAY", uid: "equip_id", sortable: true},
  {name: "ESTATUS", uid: "online_status", sortable: true},
  {name: "LATITUDE", uid: "latitude", sortable: true},
  {name: "LONGITUDE", uid : "longitude", sortable: true},
  {name: "BASE", uid: "service_center", sortable : true},
  {name: "ACTUALIZACIÓN", uid: "last_update_time", sortable : true},
  {name: "ACCIONES", uid : "actions", sortable: true},
];

const DataPrueba = [
  {
    "test_id": "OI-PRUEBAS-0001",
    "state": "Pendiente",
    "result": "En progreso",
    "num": "1",
    "record_li": null
  },
  {
    "test_id": "OI-PRUEBAS-0002",
    "state": "Pendiente",
    "result": "Pendiente",
    "num": "2",
    "record_li": null
  }
]

const orderDataTest = [
  {
    "order_id": "VI-001-2024",
    "state": "Sin inspección",
    "obs" : "Conforme",
  },
  {

  },
  {

  },
  {

  }
]

const meterDataTest = [
  {
    "meter_id": "AA23099471",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "1",
    "Q1": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q2": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q3": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "record_li": 498.98,
    "record_lf": 504.02,
    "isInvalid": false,
    "error" : 3.22
  },
  {
    "meter_id": "AA23099472",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "2",
    "Q1": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q2": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q3": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "record_li": 498.98,
    "record_lf": 504.02,
    "isInvalid": false,
    "error" : 3.22
  },
  {
    "meter_id": "AA23099473",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "3",
    "Q1": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q2": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q3": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "record_li": 498.98,
    "record_lf": 504.02,
    "isInvalid": false,
    "error" : 3.22
  },
  {
    "meter_id": "AA23099474",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "4",
    "Q1": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q2": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q3": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "record_li": 498.98,
    "record_lf": 504.02,
    "isInvalid": false,
    "error" : 3.22
  },
  {
    "meter_id": "AA23099475",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "5",
    "Q1": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q2": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q3": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "record_li": 498.98,
    "record_lf": 504.02,
    "isInvalid": false,
    "error" : 3.22
  },
  {
    "meter_id": "AA23099476",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "6",
    "Q1": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q2": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "Q3": {
      "record_li": 498.98,
      "record_lf": 504.02,
      "error" : 3.22
    },
    "record_li": 498.98,
    "record_lf": 504.02,
    "isInvalid": false,
    "error" : 3.22
  },
]

export {columns, statusOptions, columnsAlarms, columnsStatus, columnsGateways, DataPrueba, meterColumns, meterDataTest};
