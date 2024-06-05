import React, { useState, useContext } from "react";

import { Menu } from "@headlessui/react";

import { RiMapPinLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

import { AlojamientoContext } from "../cases/AlojamientoContext";

const CiudadDropdown = () => {
  const {
    setCiudad,
    setCentroPoblado,
    fetchCentrosPoblados,
    ciudades,
    centrosPoblados,
    ciudad,
    departamento,
  } = useContext(AlojamientoContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button
        onClick={() => {
          if (departamento.id_departamento != 0) {
            setIsOpen(!isOpen);
          }
        }}
        className={
          "dropdown-btn w-full text-left " +
          (departamento.id_departamento == 0
            ? "cursor-not-allowed opacity-60"
            : "")
        }
      >
        <RiMapPinLine className="dropdown-icon-primary" />
        <div>
          <div className="text-[15px] font-medium leading-tight">
            {ciudad.nombre}
          </div>
          <div className="text-[13px]">Selecciona una ciudad</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}

        {departamento.id_departamento != 0 && (
          <Menu.Items className="dropdown-menu overflow-auto max-h-64 top-16 right-0.5">
            {ciudades.map((ciudad) => {
              return (
                <Menu.Item
                  onClick={() => {
                    setCentroPoblado(centrosPoblados[0]);
                    fetchCentrosPoblados(ciudad.id_ciudad);
                    setCiudad(ciudad);
                  }}
                  className="cursor-pointer hover:text-pink-700 transtion"
                  as="li"
                  key={ciudad.id_ciudad}
                >
                  {ciudad.nombre}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        )}
      </Menu.Button>
    </Menu>
  );
};

export default CiudadDropdown;
