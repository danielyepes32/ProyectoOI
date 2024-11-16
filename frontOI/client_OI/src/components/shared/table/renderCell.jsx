// renderCell.js
import React from 'react';
import { FaCheck } from "react-icons/fa";
import { Chip, Dropdown, DropdownMenu, DropdownTrigger, Button, DropdownItem, Input} from '@nextui-org/react';
//import { VerticalDotsIcon } from "react-icons/your-icons"; // Asegúrate de importar tus íconos correctamente
// El mapa de colores de status
const statusColorMap = {
  // Define los colores según tus necesidades
  active: 'green',
  inactive: 'gray',
  pending: 'yellow',
};

const renderCell = (user, columnKey, setSelectedMeter, setActionKey, onOpen, visualInspection, updateResult, updateValue, addKey, updateValidate, meters, handleValidateErrorInput, location, handleEnterAction, Q) => {
  const cellValue = user[columnKey];
  switch (columnKey) {
    case "status":
      return (
        <Chip
          variant="dot"
          size="sm"
          classNames={{
            base: "w-auto h-auto px-1",
            content: "px-1",
            dot: `p-1 bg-${statusColorMap[user.status]}`,
          }}
          className="capitalize gap-4"
        >
          {cellValue}
        </Chip>
      );

    case "actions":
      return (
        <div className="relative flex justify-center items-center text-center gap-5">
          <Dropdown 
            className="bg-background border-1 border-default-200"
            backdrop="blur"
            onOpenChange={(isOpen) => {
              const dropdownMenu = document.getElementById('dropdown-menu');
              if (dropdownMenu) {
                dropdownMenu.inert = !isOpen;
              }
            }}
          >
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                <VerticalDotsIcon className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              id="dropdown-menu"
              aria-label="MenuActionKey"
              variant="bordered"
              onAction={(key) => {
                setActionKey(key);
                setSelectedMeter(user);
                onOpen();
              }}
            >
              <DropdownItem key="details" className="hover:bg-default-100">Ver Detalles</DropdownItem>
              <DropdownItem key="edit" className="hover:bg-default-100">Editar Datos</DropdownItem>
              <DropdownItem key="delete" className="text-danger hover:bg-red-200" color="danger">Eliminar Status</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
      case "state":
        return (

          <Dropdown
            key={user.meter_id}
          >
          <DropdownTrigger>
              <Button 
              variant="bordered" 
              className="flex justify-center w-full whitespace-pre-wrap mt-2 z-[0] border-none px-0"
              >
              <div className="flex justify-center w-full h-full place-items-center">
                  <span className="font-inter text-black text-[12px] font-semibold w-full text-center whitespace-pre-wrap h-auto">{visualInspection[user.meter_id] ? visualInspection[user.meter_id].value : null}</span>
              </div>
              </Button>
          </DropdownTrigger>
          <DropdownMenu 
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              className="flex justify-center place-items-center"
              selectionMode="single"
              selectedKeys={visualInspection[user.meter_id] ? visualInspection[user.meter_id].value : null}
              onSelectionChange={(keys)=>{
                updateValue(user.meter_id, keys.anchorKey);
                keys.anchorKey !== 'Sin observaciones' ? updateResult(user.meter_id, 'No apto') : updateResult(user.meter_id, 'Apto');
                addKey(user.meter_id);
              }
              }
          >
              <DropdownItem key="Sin observaciones">Sin observaciones</DropdownItem>
              <DropdownItem key="Punteros no sincronizados">Punteros no sincronizados</DropdownItem>
              <DropdownItem key="Cuerpo roto">Cuerpo roto</DropdownItem>
              <DropdownItem key="Rosca dañada">Rosca dañada</DropdownItem>
              <DropdownItem key="Polarizado">Polarizado</DropdownItem>
              <DropdownItem key="Sin tapa">Sin tapa</DropdownItem>
              <DropdownItem key="Mal grabado">Mal grabado</DropdownItem>
              <DropdownItem key="Sil filtro">Sil filtro</DropdownItem>
              <DropdownItem key="Sin tapa 2">Sin tapa 2</DropdownItem>
              <DropdownItem key="Registro roto">Registro roto</DropdownItem>
              <DropdownItem key="Elementos extraños">Elementos extraños</DropdownItem>
              <DropdownItem key="Marcas erróneas">Marcas erróneas</DropdownItem>
              <DropdownItem key="Puntero roto">Puntero roto</DropdownItem>
              <DropdownItem key="Otros">Otros</DropdownItem>
          </DropdownMenu>
      </Dropdown>
    );
    case "drain":
      return (

        <Dropdown
          key={user.meter_id}
        >
        <DropdownTrigger>
            <Button 
            variant="bordered" 
            className="flex justify-center w-full whitespace-pre-wrap mt-2 z-[0] border-none px-0"
            >
            <div className="flex justify-center w-full h-full place-items-center">
                <span className="font-inter text-black text-[14px] w-full text-center whitespace-pre-wrap h-auto">{visualInspection[user.meter_id] ? visualInspection[user.meter_id].value : null}</span>
            </div>
            </Button>
        </DropdownTrigger>
        <DropdownMenu 
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            className="flex justify-center place-items-center"
            selectionMode="single"
            selectedKeys={visualInspection[user.meter_id] ? visualInspection[user.meter_id].value : null}
            onSelectionChange={(keys)=>{
              updateValue(user.meter_id, keys.anchorKey);
              keys.anchorKey !== 'Sin fuga' ? updateResult(user.meter_id, 'No conforme') : updateResult(user.meter_id, 'Conforme');
              addKey(user.meter_id);
            }
            }
        >
            <DropdownItem key="Sin fuga">Sin fuga</DropdownItem>
            <DropdownItem key="Picado">Picado</DropdownItem>
            <DropdownItem key="Registro con daños">Registro con daños</DropdownItem>
            <DropdownItem key="Otros">Otros</DropdownItem>
        </DropdownMenu>
    </Dropdown>
    );
    case "record_li":
      const pointerMeter = meters.find(item => item.meter_id === user.meter_id)  
      
      return (
        <Input 
          className="flex justify-center text-center w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none" 
          //placeholder={cellValue}
          value={pointerMeter.q3.record_li === 0  ? '' : pointerMeter.q3.record_li}
          variant = "underlined"
          type='number'
          isInvalid = {pointerMeter.isInvalid}
          placeholder = '-'
          classNames={{
            input: "text-center bg-green-100"
          }}
          color={pointerMeter.q3.record_li === '' ? "danger" : pointerMeter.q3.record_li ? "primary" : "danger"} //Aquí hay un error, el isInbvalid debe actualizarse por fuera de este reenderizado para funcionar porque los sets no actualizan hasta el proximo reanderizado, pero por ahora no tengo tiempo :P
          onValueChange={(value)=>{
            updateResult(user.meter_id, value)
            updateValidate(user.meter_id, value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const inputValue = e.target.value; // Obtiene el valor actual del input
              console.log("Enter", inputValue);
              handleEnterAction(user.meter_id, inputValue);
            }
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
        >
        </Input>
      );
      case "record_lf":
        const pointerRecordlf = meters.find(item => item.meter_id === user.meter_id)  
        
        return (
          <Input
            className="flex justify-center text-center w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none" 
            //placeholder={cellValue}
            value={pointerRecordlf.q3.record_lf === 0  ? '' : pointerRecordlf.q3.record_lf}
            variant = "underlined"
            type='number'
            isInvalid = {pointerRecordlf.isInvalid}
            placeholder = '-'
            classNames={{
              input: "text-center bg-green-100"
            }}
            color={pointerRecordlf.q3.record_lf === '' ? "danger" : pointerRecordlf.q3.record_lf ? "primary" : "danger"} //Aquí hay un error, el isInbvalid debe actualizarse por fuera de este reenderizado para funcionar porque los sets no actualizan hasta el proximo reanderizado, pero por ahora no tengo tiempo :P
            onValueChange={(value)=>{
              updateResult(user.meter_id, value)
              updateValidate(user.meter_id, value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const inputValue = e.target.value; // Obtiene el valor actual del input
                console.log("Enter", inputValue);
                handleEnterAction(user.meter_id, inputValue);
              }
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
          >
          </Input>
        );
    case "meter_id":
      
      return (
        <span className={ 'text-custom-blue'}>
          {cellValue}
        </span>
      );
      case "checkbox":
        return(
          <div className="h-auto w-auto flex justify-center place-items-center">
            <div className={handleValidateErrorInput(user.meter_id)}>
              <FaCheck className="p-0.5 text-white"/>
            </div>
          </div>
        );
      case "error":
        
        return(
          <span>{`${user.q3.error} %`}</span>
        )
    default:
      return cellValue || 'NO DATA';
  }
};

export default renderCell;
