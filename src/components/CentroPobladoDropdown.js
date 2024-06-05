import React, { useState, useContext } from "react";

import { Menu } from "@headlessui/react";

import { RiMapPinLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

import { AlojamientoContext } from "../cases/AlojamientoContext";

const CentroPobladoDropdown = () => {
  const { setCentroPoblado, centrosPoblados, centroPoblado, ciudad } =
    useContext(AlojamientoContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button
        onClick={() => {
          if (ciudad.id_ciudad != 0) {
            setIsOpen(!isOpen);
          }
        }}
        className={
          "dropdown-btn w-full text-left " +
          (ciudad.id_ciudad == 0 ? "cursor-not-allowed opacity-60" : "")
        }
      >
        <RiMapPinLine className="dropdown-icon-primary" />
        <div>
          <div className="text-[15px] font-medium leading-tight">
            {centroPoblado.nombre}
          </div>
          <div className="text-[13px]">Selecciona un centro poblado</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}

        {ciudad.id_ciudad != 0 && (
          <Menu.Items className="dropdown-menu overflow-auto max-h-64 top-16 right-0.5">
            {centrosPoblados.map((centroPoblado) => {
              return (
                <Menu.Item
                  onClick={() => setCentroPoblado(centroPoblado)}
                  className="cursor-pointer hover:text-pink-700 transtion"
                  as="li"
                  key={centroPoblado.id_centro_poblado}
                >
                  {centroPoblado.nombre}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        )}
      </Menu.Button>
    </Menu>
  );
};

export default CentroPobladoDropdown;
