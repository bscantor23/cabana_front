import React from "react";

import { BsHouse } from "react-icons/bs";
import { PiWarehouseDuotone } from "react-icons/pi";
import { useState } from "react";
import { useContext } from "react";
import { AlojamientoContext } from "../cases/AlojamientoContext";

import { GiHouseKeys } from "react-icons/gi";
import { MdLockOpen } from "react-icons/md";

const TipoReservaCheckGroup = ({ functionReserva }) => {
  const {
    setIsArrendatarioChecked,
    isArrendatarioChecked,
    setIsPropietarioChecked,
    isPropietarioChecked,
  } = useContext(AlojamientoContext);

  const handlePropietarioCheckboxChange = () => {
    setIsPropietarioChecked(!isPropietarioChecked);
    setIsArrendatarioChecked(isPropietarioChecked);
    functionReserva(!isPropietarioChecked);
  };

  const handleArrendatarioCheckboxChange = () => {
    setIsArrendatarioChecked(!isArrendatarioChecked);
    setIsPropietarioChecked(isArrendatarioChecked);
    functionReserva(!isPropietarioChecked);
  };

  return (
    <div className="flex items-center py-5 justify-evenly px-5 ">
      <div className="flex flex-row justify-center align-center">
        <GiHouseKeys className="dropdown-icon-primary" />
        <label
          for="bordered-checkbox-1"
          className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
        >
          Propietario
        </label>
        <input
          id="bordered-checkbox-1"
          type="checkbox"
          checked={isPropietarioChecked}
          onChange={handlePropietarioCheckboxChange}
          value=""
          className="mx-3 accent-pink-600"
        />
      </div>
      <div className="flex flex-row justify-center align-center">
        <MdLockOpen className="dropdown-icon-primary" />
        <label
          for="bordered-checkbox-1"
          className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
        >
          Arrendatario
        </label>
        <input
          id="bordered-checkbox-1"
          type="checkbox"
          checked={isArrendatarioChecked}
          onChange={handleArrendatarioCheckboxChange}
          value=""
          className="mx-3 accent-pink-600"
        />
      </div>
    </div>
  );
};

export default TipoReservaCheckGroup;
