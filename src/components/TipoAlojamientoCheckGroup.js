import React from "react";

import { BsHouse } from "react-icons/bs";
import { PiWarehouseDuotone } from "react-icons/pi";
import { useState } from "react";
import { useContext } from "react";
import { AlojamientoContext } from "../cases/AlojamientoContext";

const TipoAlojamientoCheckGroup = () => {
  const {
    setIsCasaChecked,
    isCasaChecked,
    setIsCabanaChecked,
    isCabanaChecked,
  } = useContext(AlojamientoContext);

  const handleCasaCheckboxChange = () => {
    setIsCasaChecked(!isCasaChecked);
  };

  const handleCabanaCheckboxChange = () => {
    setIsCabanaChecked(!isCabanaChecked);
  };

  return (
    <div className="flex items-center py-5 justify-evenly border px-5 border-gray-200 rounded ">
      <div className="flex flex-row justify-center align-center">
        <BsHouse className="dropdown-icon-primary" />
        <label
          for="bordered-checkbox-1"
          className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
        >
          Casa
        </label>
        <input
          id="bordered-checkbox-1"
          type="checkbox"
          checked={isCasaChecked}
          onChange={handleCasaCheckboxChange}
          value=""
          className="mx-3 accent-pink-600"
        />
      </div>
      <div className="flex flex-row justify-center align-center">
        <PiWarehouseDuotone className="dropdown-icon-primary" />
        <label
          for="bordered-checkbox-1"
          className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
        >
          Cabaña
        </label>
        <input
          id="bordered-checkbox-1"
          type="checkbox"
          checked={isCabanaChecked}
          onChange={handleCabanaCheckboxChange}
          value=""
          className="mx-3 accent-pink-600"
        />
      </div>
    </div>
  );
};

export default TipoAlojamientoCheckGroup;
