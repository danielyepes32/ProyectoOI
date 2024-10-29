import React from "react";import {  
    Modal,   
    ModalContent,   
    ModalHeader,   
    ModalBody,   
    ModalFooter,
} from "@nextui-org/modal";
import Banco from "../modalData/banco";
import Instruments from "../modalData/instruments";
import Meter_nc from "../modalData/Meter_nc";
import Meter_c from "../modalData/Meter_c";
import OrderSelection from "../modalData/OrderSelection";

export default function ModalData(
    {
        isOpen, 
        onOpenChange, 
        popUpData, 
        selectedMeterKeys, 
        sortDescriptor, 
        setSelectedMeterKeys, 
        setSortDescriptor,
        headerColumns,
        meters,
        loadingState
    }
    ) {

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
            default:
                return 'Instrumentos';
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            placement="center"
            onOpenChange={onOpenChange}
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
                            <Banco/>
                        )
                    }else if(popUpData === 'instrument'){
                        return (
                            <Instruments/>
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
                            />
                        )
                    }else if(popUpData === 'meter_c'){
                        return(
                            <Meter_c/>
                        )
                    }else if(popUpData === 'order'){
                        return(
                            <OrderSelection/>
                        )
                    }
                }, [popUpData, selectedMeterKeys])
                }
                </ModalBody>
                {/*   
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              */}
            </>
            )}
            </ModalContent>
        </Modal> 
    )
}