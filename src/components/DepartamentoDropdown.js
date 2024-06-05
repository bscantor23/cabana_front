import React, { useState, useContext } from "react";

import { Menu } from "@headlessui/react";

import { RiMapPinLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

import { AlojamientoContext } from "../cases/AlojamientoContext";

const DepartamentoDropdown = () => {
  const {
    setDepartamento,
    setCiudad,
    setCentroPoblado,
    departamentos,
    departamento,
    ciudades,
    centrosPoblados,
    fetchCiudades,
  } = useContext(AlojamientoContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-btn w-full text-left"
      >
        <RiMapPinLine className="dropdown-icon-primary" />
        <div>
          <div className="text-[15px] font-medium leading-tight">
            {departamento.nombre}
          </div>
          <div className="text-[13px]">Selecciona un departamento</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}

        <Menu.Items className="dropdown-menu overflow-auto max-h-64 top-16 right-0.5">
          {departamentos.map((departamento) => {
            return (
              <Menu.Item
                onClick={() => {
                  setCiudad(ciudades[0]);
                  setCentroPoblado(centrosPoblados[0]);
                  fetchCiudades(departamento.id_departamento);
                  setDepartamento(departamento);
                }}
                className="cursor-pointer hover:text-pink-700 transtion"
                as="li"
                key={departamento.id_departamento}
              >
                {departamento.nombre}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Menu.Button>
    </Menu>
  );
};

export default DepartamentoDropdown;
