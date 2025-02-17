// renderCell.js
import React from 'react';
import { FaCheck } from "react-icons/fa";
import { Chip, Dropdown, DropdownMenu, DropdownTrigger, Button, DropdownItem, Input} from '@nextui-org/react';
import { HiDotsVertical } from "react-icons/hi";

// El mapa de colores de status
const statusColorMap = {
  // Define los colores según tus necesidades
  active: 'green',
  inactive: 'gray',
  pending: 'yellow',
};

const renderCell = (user, columnKey, setSelectedMeter, setActionKey, onOpen, visualInspection, updateResult, updateValue, addKey, updateValidate, meters, handleValidateErrorInput, location, handleEnterAction, selectedQ, selectedKeys, setPopUpData) => {
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
                <HiDotsVertical className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              id="dropdown-menu"
              aria-label="MenuActionKey"
              variant="bordered"
              onAction={(key) => {
                onOpen();
                setActionKey(key);
                setSelectedMeter(user);
              }}
            >
              <DropdownItem key="details" className="hover:bg-default-100">Ver Detalles</DropdownItem>
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
      const pointerMeter = meters.find(item => item.meter_id === user.meter_id);
      const isSelected = selectedKeys.has(user.meter_id);
      return (
        <Input
          className="flex justify-center text-center w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none"
          value={
            pointerMeter?.[selectedQ].record_li === 0
              ? ""
              : pointerMeter?.[selectedQ]?.record_li
          }
          maxLength={5}
          variant="underlined"
          type="number"
          isInvalid={pointerMeter?.isInvalid}
          placeholder="-"
          classNames={{
            input: "text-center bg-green-100",
          }}
          color={
            pointerMeter?.[selectedQ]?.record_li === ""
              ? "danger"
              : pointerMeter?.[selectedQ]?.record_li
              ? "primary"
              : "danger"
          }
          onValueChange={(value) => {
            !isSelected && value.length < 7 ? updateResult(user.meter_id, value) : null;
            !isSelected && value.length < 7 ? updateValidate(user.meter_id, value) : null;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const inputValue = e.target.value;
              console.log("Enter", inputValue);
              handleEnterAction(user.meter_id, inputValue);
            }
            if (e.key === "Backspace" && !isSelected) {
              console.log("Backspace", 0);
              updateResult(user.meter_id, 0);
              updateValidate(user.meter_id, 0);
            }
          }}
          onClick={() => {
          if (isSelected){
            onOpen();
            setSelectedMeter(user);
            setPopUpData("recover");
          }
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
        ></Input>
      );

    case "record_lf":
      const pointerRecordlf = meters.find(item => item.meter_id === user.meter_id);

      return (
        <Input
          className="flex justify-center text-center w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none"
          value={
            pointerRecordlf?.[selectedQ]?.record_lf === 0
              ? ""
              : pointerRecordlf?.[selectedQ]?.record_lf
          }
          variant="underlined"
          type="number"
          isInvalid={pointerRecordlf?.isInvalid}
          placeholder="-"
          classNames={{
            input: "text-center bg-green-100",
          }}
          color={
            pointerRecordlf?.[selectedQ]?.record_lf === ""
              ? "danger"
              : pointerRecordlf?.[selectedQ]?.record_lf
              ? "primary"
              : "danger"
          }
          onValueChange={(value) => {
            updateResult(user.meter_id, value);
            updateValidate(user.meter_id, value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const inputValue = e.target.value;
              console.log("Enter", inputValue);
              handleEnterAction(user.meter_id, inputValue);
            }
            if (e.key === "Backspace") {
              console.log("Backspace", 0);
              updateResult(user.meter_id, 0);
              updateValidate(user.meter_id, 0);
            }
          }}
        
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
        ></Input>
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
      
      const Q = 'q2';

      return(
        <span>{`${user[Q].error} %`}</span>
      );

    case "q1":
      return(
        <span>{`${user["q1"].error} %`}</span>
      );

    case "q2":
    
      return(
        <span>{`${user["q2"].error} %`}</span>
      );

    case "q3":
    
      return(
        <span>{`${user["q3"].error} %`}</span>
      );

    case "obs":

      return(
        <span>{user.result === "No apto" ? "No apto" : cellValue}</span>
      );
    case "resume":

    const conformanceStatus = (!user.q1.isInvalid || !user.q2.isInvalid || !user.q3.isInvalid) 
    ? "No conforme" 
    : "Conforme";

    // Separar la cadena en palabras
  const words = conformanceStatus.split(" ");

      return(
        <div>
        {words.map((word, index) => (
          <span key={index} className="block">{word}</span> // Cada palabra en un span con display: block
        ))}
      </div>
      )
    default:
      return cellValue || 'NO DATA';
  }
};

export default renderCell;
