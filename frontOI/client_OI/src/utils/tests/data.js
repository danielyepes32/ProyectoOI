const columns = [
  {name: "ID PRUEBA", uid: "test_id", sortable: true},
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
    "test_id": "001",
    "state": "Pendiente",
    "result": "En progreso",
    "num": "1",
    "record_li": null
  },
  {
    "test_id": "002",
    "state": "Completado",
    "result": "Aprobado",
    "num": "2",
    "record_li": null
  },
  {
    "test_id": "003",
    "state": "Completado",
    "result": "Rechazado",
    "num": "3",
    "record_li": null
  },
  {
    "test_id": "004",
    "state": "Pendiente",
    "result": "No iniciado",
    "num": "4",
    "record_li": null
  },
  {
    "test_id": "005",
    "state": "Pendiente",
    "result": "No iniciado",
    "num": "5",
    "record_li": null
  },  {
    "test_id": "006",
    "state": "Pendiente",
    "result": "No iniciado",
    "num": "6",
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
    "record_li": null,
    "record_lf": null,
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
    "record_li": null,
    "record_lf": null,
    "isInvalid": false,
    "error" : 6.22
  },
  {
    "meter_id": "AA23099473",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "3",
    "record_li": null,
    "record_lf": null,
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
    "record_li": null,
    "record_lf": null,
    "isInvalid": false,
    "error" : 4.57
  },
  {
    "meter_id": "AA23099475",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "5",
    "record_li": null,
    "record_lf": null,
    "isInvalid": false,
    "error" : 4.32
  },
  {
    "meter_id": "AA23099476",
    "state": "Sin inspección",
    "drain": "Sin inspección",
    "obs" : "Conforme",
    "result": "Apto",
    "num": "6",
    "record_li": null,
    "record_lf": null,
    "isInvalid": false,
    "error" : 3.22
  },
]

export {columns, statusOptions, columnsAlarms, columnsStatus, columnsGateways, DataPrueba, meterColumns, meterDataTest};
