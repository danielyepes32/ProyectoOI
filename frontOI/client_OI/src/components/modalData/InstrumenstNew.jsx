import React, { useState, useEffect } from "react";

export default function InstrumentsNew({ instrumentos }) {
    if (!Array.isArray(instrumentos)) {
      return null; // O muestra un mensaje de error si lo prefieres
    }
  
    return (
      <div className="w-full h-full grid grid-cols-2 gap-4 mb-10">
        {instrumentos.map((instrumento) => (
          <React.Fragment key={instrumento.id}>
            <div className="col-span-1 w-full h-full space-y-5 flex flex-col justify-start items-left">
              <p className="font-semibold">{instrumento.nombre}</p>
            </div>
            <div className="col-span-1 w-full h-full space-y-2 flex flex-col justify-end">
              <p className="text-left">
                Vigencia (De: {instrumento.fecha_ultima_calibracion}, hasta {instrumento.fecha_vencimiento_certificado})
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }