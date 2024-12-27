import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/modal";

export default function ModalSelection({ 
  isOpen, 
  onOpenChange, 
  meters = [], // Lista de medidores disponibles
  selectedMedidores, // Estado principal de medidores seleccionados
  setSelectedMedidores, // Función para actualizar la selección
  setRangeStart, // Actualiza el rango de inicio (opcional)
  setRangeEnd // Actualiza el rango de fin (opcional)
}) {
  // Estado local para manejar los medidores seleccionados en el modal
  const [localSelection, setLocalSelection] = useState([]);

  // Sincroniza el estado local con los medidores seleccionados cuando se abre el modal
  useEffect(() => {
    if (selectedMedidores) {
      setLocalSelection(selectedMedidores);
    }
  }, [selectedMedidores]);

  // Maneja la selección/deselección de un medidor
  const toggleSelection = (id) => {
    if (localSelection.includes(id)) {
      setLocalSelection(localSelection.filter(m => m !== id)); // Remueve si ya está seleccionado
    } else {
      setLocalSelection([...localSelection, id]); // Agrega si no está seleccionado
    }
  };

  // Confirma la selección y actualiza el estado principal
  const handleConfirm = () => {
    setSelectedMedidores(localSelection);

    // Calcula el rango (si aplica)
    if (localSelection.length > 0) {
      const sortedMeters = meters
        .filter(m => localSelection.includes(m.id))
        .sort((a, b) => a.numero_serie.localeCompare(b.numero_serie));

      if (sortedMeters.length > 0) {
        setRangeStart(sortedMeters[0].numero_serie);
        setRangeEnd(sortedMeters[sortedMeters.length - 1].numero_serie);
      }
    } else {
      setRangeStart(null);
      setRangeEnd(null);
    }
    onOpenChange(false); // Cierra el modal
  };

  return (
    <Modal isOpen={true} onOpenChange={true} closeButton>
      <ModalHeader>
        <span className="font-mulish font-bold text-[22px]">
          Selección parcial de medidores
        </span>
      </ModalHeader>
      <ModalBody>
        {meters.length === 0 ? (
          <div className="text-center font-inter">
            <span>No hay medidores disponibles para esta orden.</span>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {meters.map(medidor => (
              <div
                key={medidor.id}
                className="flex justify-between items-center border-b border-gray-300 py-2"
              >
                <span className="font-teko text-[18px]">{medidor.numero_serie}</span>
                <input
                  type="checkbox"
                  checked={localSelection.includes(medidor.id)}
                  onChange={() => toggleSelection(medidor.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
            ))}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button auto color="error" onPress={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button auto color="primary" onPress={handleConfirm}>
          Confirmar selección
        </Button>
      </ModalFooter>
    </Modal>
  );
}
