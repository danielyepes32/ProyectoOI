import React from "react";
import { FaCheck } from "react-icons/fa";
import {
  Chip,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  Button,
  DropdownItem,
  Input,
} from "@nextui-org/react";

const statusColorMap = {
  active: "green",
  inactive: "gray",
  pending: "yellow",
};

const renderCell = (
  user,
  columnKey,
  setSelectedMeter,
  setActionKey,
  onOpen,
  visualInspection,
  updateResult,
  updateValue,
  addKey,
  updateValidate,
  meters,
  handleValidateErrorInput,
  location,
  handleEnterAction,
  Q = "q3" // Clave dinámica para seleccionar el registro de medición
) => {
  const cellValue = user[columnKey];

  // Obtiene dinámicamente el valor desde Q
  const getValueFromQ = (meter, field) => {
    return meter[Q] && meter[Q][field] !== undefined ? meter[Q][field] : "";
  };

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
          >
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                <FaCheck className="text-default-400" />
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
              <DropdownItem key="details">Ver Detalles</DropdownItem>
              <DropdownItem key="edit">Editar Datos</DropdownItem>
              <DropdownItem key="delete" color="danger">
                Eliminar Status
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );

    case "record_li":
      return (
        <Input
          className="flex justify-center text-center w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none"
          value={getValueFromQ(user, "record_li")} // Obtiene dinámicamente el valor de record_li
          variant="underlined"
          type="number"
          placeholder="-"
          classNames={{
            input: "text-center bg-green-100",
          }}
          onValueChange={(value) => {
            updateResult(user.meter_id, value);
            updateValidate(user.meter_id, value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const inputValue = e.target.value;
              handleEnterAction(user.meter_id, inputValue);
            }
          }}
        />
      );

    case "record_lf":
      return (
        <Input
          className="flex justify-center text-center w-full whitespace-pre-wrap z-[0] border-none px-0 shadow-none"
          value={getValueFromQ(user, "record_lf")} // Obtiene dinámicamente el valor de record_lf
          variant="underlined"
          type="number"
          placeholder="-"
          classNames={{
            input: "text-center bg-green-100",
          }}
          onValueChange={(value) => {
            updateResult(user.meter_id, value);
            updateValidate(user.meter_id, value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const inputValue = e.target.value;
              handleEnterAction(user.meter_id, inputValue);
            }
          }}
        />
      );

    case "reference_volume":
      return (
        <span className="text-center">
          {getValueFromQ(user, "reference_volume") || "-"} {/* Dinámico */}
        </span>
      );

    case "meter_id":
      return <span className={"text-custom-blue"}>{cellValue}</span>;

    case "checkbox":
      return (
        <div className="h-auto w-auto flex justify-center place-items-center">
          <div className={handleValidateErrorInput(user.meter_id)}>
            <FaCheck className="p-0.5 text-white" />
          </div>
        </div>
      );

    default:
      return cellValue || "NO DATA";
  }
};

export default renderCell;
