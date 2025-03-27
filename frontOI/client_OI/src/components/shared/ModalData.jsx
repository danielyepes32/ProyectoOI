import React from "react";import {  
    Modal,   
    ModalContent,   
    ModalHeader,   
    ModalBody,   
    ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Textarea } from "@nextui-org/react";
import Banco from "../modalData/banco";
import Instruments from "../modalData/instruments";
import InstrumentsNew from "../modalData/InstrumenstNew";
import Meter_nc from "../modalData/Meter_nc";
import Meter_c from "../modalData/Meter_c";
import OrderSelection from "../modalData/OrderSelection";
import PartialMeterSelection from "../modalData/PartialMeters";
import { useNavigate } from "react-router-dom";

export default function ModalData(
    {
        isOpen, 
        onOpenChange, 
        popUpData,
        dataBanco,
        dataInstrumentos,
        dataPartialMeters,
        selectedMeterKeys, 
        sortDescriptor, 
        setSelectedMeterKeys, 
        setSortDescriptor,
        headerColumns,
        meters,
        loadingState,
        selectedKeys,
        pruebas,
        pruebaCapacity,
        selectedPruebaKey,
        onConfirmSelection,
        selectedMeter,
        removeKey,
        handleOnClose,
        maxCapacity
    }
    ) {

    const navigate = useNavigate()

    const getPopUpTitle = (popUpData) => {
        switch (popUpData) {
            case 'banco':
                return 'Banco';
            case 'meter_nc':
                return 'Selección No Correlativos';
            case 'meter_c':
                return 'Selección Correlativos';
            case 'order':
                return 'Ordenes seleccionadas';
            case 'meter_partial':
                return 'Selección de medidores';
            case 'details':
                return 'Detalles del medidor'
            case 'cancelForm':
                return 'Formulario de Cancelación de prueba';
            case 'recover':
                return 'Retornar acceso';
            default:
                return 'Instrumentos';
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            placement="center"
            onOpenChange={onOpenChange}
            onClose={()=>{
                handleOnClose? handleOnClose() : console.log("Se cerró")
            }}
            className="mx-5"
            size="sm"
            scrollBehavior="outside"
        >
            <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader 
                    className="flex flex-col gap-1 text-center font-mulish font-bold"
                >
                    {getPopUpTitle(popUpData)}
                </ModalHeader>
                <ModalBody>
                {React.useMemo(() => {
                    if(popUpData === 'banco'){
                        return (
                            <Banco
                                nBanco={dataBanco?.nBanco}
                                capacidad={dataBanco?.capacidad}
                                marca={dataBanco?.marca}
                                modelo={dataBanco?.modelo}
                                habilitado={dataBanco?.habilitado}
                                cert={dataBanco?.cert}
                            />
                        )
                    }else if(popUpData === 'instrument'){
                        return (
                            <Instruments/>
                        )
                    }else if(popUpData === 'instrumentNew'){
                        return (
                            <InstrumentsNew
                                instrumentos={dataInstrumentos}
                            />
                        )
                    }else if(popUpData === 'meter_nc'){
                        return(
                            <Meter_nc
                                selectedMeterKeys= {selectedMeterKeys}
                                sortDescriptor = {sortDescriptor}
                                setSelectedMeterKeys = {setSelectedMeterKeys}
                                setSortDescriptor = {setSortDescriptor}
                                headerColumns = {headerColumns}
                                meters = {meters}
                                loadingState = {loadingState}
                                selectedKeys={selectedKeys}
                                maxCapacity={maxCapacity}
                            />
                        )
                    }else if(popUpData === 'meter_c'){
                        return(
                            <Meter_c
                                meters={meters}
                            />
                        )
                    }else if(popUpData === 'order'){
                        return(
                            <OrderSelection/>
                        )
                    }else if(popUpData === 'meter_partial'){
                        return(
                            <PartialMeterSelection
                                meters={meters}
                                selectedMeterKeys={selectedMeterKeys}
                                setSelectedMeterKeys={setSelectedMeterKeys}
                                sortDescriptor={sortDescriptor}
                                setSortDescriptor={setSortDescriptor}
                                headerColumns={headerColumns}
                                pruebas={pruebas}
                                selectedPruebaKey={selectedPruebaKey}
                                onConfirmSelection={onConfirmSelection} // Callback al confirmar selección
                                pruebaCapacity={pruebaCapacity}
                            />
                        )
                    }else if(popUpData === 'recover'){
                        console.log("Medidor seleccionado: ", selectedMeter)
                        return(
                            <div className="flex flex-col w-full space-y-3 h-full place-items-center justify-center mb-3">
                                <span>Si desea reiniciar el valor ingresado del medidor <span className="font-bold">{selectedMeter.meter_id}</span> porfavor llame a su supervisor e ingrese sus credenciales</span>
                                <Input className="max-w-xs" label="Usuario" placeholder="Ingrese su usuario" />
                                <Input className="max-w-xs" label="Contraseña" placeholder="Ingrese su contraseña" />
                                <Button 
                                    className="bg-custom-blue text-white"
                                    onPress={()=>{
                                        onClose()
                                        removeKey(selectedMeter.meter_id)
                                    }}
                                    >
                                        Confirmar
                                </Button>
                            </div>
                        )
                    }else if(popUpData === 'details'){
                        console.log("Medidor seleccionado: ", selectedMeter)
                        return(
                            <div className="flex flex-col w-full space-y-3 h-full place-items-center justify-center mb-3">
                                <div className="w-full flex justify-between h-auto space-x-2">
                                    <div className="w-1/2 flex place-items-center">
                                        <span>Detalles de Inspección</span> 
                                    </div>
                                    <div className="w-1/2 flex justify-end place-items-center">
                                        <span className="text-right">{selectedMeter.state}</span>
                                    </div> 
                                </div>
                                <div className="w-full flex justify-between h-auto space-x-2">
                                    <div className="w-1/2 flex place-items-center">
                                        <span>Detalles de Fugas</span> 
                                    </div>
                                    <div className="w-1/2 flex justify-end place-items-center">
                                        <span className="text-right">{selectedMeter.drain}</span>
                                    </div> 
                                </div>
                                <div className="w-full flex justify-between h-auto space-x-2">
                                    <div className="w-1/2 flex place-items-center">
                                        <span>Volumen de referencia</span> 
                                    </div>
                                    <div className="w-1/2 flex justify-end place-items-center">
                                        <span className="text-right">{selectedMeter.q1.reference_volume}</span>
                                    </div> 
                                </div>
                                <div className="w-full flex justify-between h-auto space-x-2">
                                    <div className="w-1/2">
                                        <span>Estado final del medidor</span> 
                                    </div>
                                    <div className="w-1/2 flex justify-end place-items-center">
                                        <span className="text-right">{selectedMeter.state}</span>
                                    </div> 
                                </div>
                            </div>
                        )
                    } else if(popUpData === 'cancelForm'){
                        return(
                            <div className="flex flex-col w-full space-y-3 h-full place-items-center justify-center mb-3">
                                <Textarea className="max-w-xs" label="Por favor agrega detalles de la operación" placeholder="Ingresa el motivo de cancelación" />
                            </div>
                        )
                    }
                }, [popUpData, selectedMeterKeys])
                }
                </ModalBody>  
                <ModalFooter className={`${popUpData === 'cancelForm' ? 'flex': 'hidden'} w-full justify-center place-items-center`}>
                  <Button 
                    color="danger" 
                    variant="solid" 
                    onPress={()=>{
                        onClose()
                        navigate("/client/")
                    }}>
                    Cancelar prueba
                  </Button>
                </ModalFooter>
            </>
            )}
            </ModalContent>
        </Modal> 
    )
}