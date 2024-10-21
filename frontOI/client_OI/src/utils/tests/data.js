const columns = [
  {name: "ID PRUEBA", uid: "test_id", sortable: true},
  {name: "ESTADO", uid: "state", sortable: true},
  {name: "CONCLUSION", uid: "result", sortable: true},
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
    "result": "En progreso"
  },
  {
    "test_id": "002",
    "state": "Completado",
    "result": "Aprobado"
  },
  {
    "test_id": "003",
    "state": "Completado",
    "result": "Rechazado"
  },
  {
    "test_id": "004",
    "state": "Pendiente",
    "result": "No iniciado"
  },
  {
    "test_id": "005",
    "state": "Pendiente",
    "result": "No iniciado"
  },  {
    "test_id": "006",
    "state": "Pendiente",
    "result": "No iniciado"
  }
]

export {columns, statusOptions, columnsAlarms, columnsStatus, columnsGateways, DataPrueba};
