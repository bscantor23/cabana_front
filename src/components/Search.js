import React, { useContext } from "react";

import DepartamentoDropdown from "./DepartamentoDropdown";
import CiudadDropdown from "./CiudadDropdown";
import CentroPobladoDropdown from "./CentroPobladoDropdown";
import TipoAlojamientoCheckGroup from "./TipoAlojamientoCheckGroup";

import { RiSearch2Line } from "react-icons/ri";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";
import { PiCurrencyCircleDollar } from "react-icons/pi";

const Search = () => {
  const {
    handleClick,
    setCupoPersona,
    setNumeroHabitaciones,
    setValorHospedaje,
  } = useContext(AlojamientoContext);

  return (
    <div className="px-[30px] py-6 max-w-[1250px] mt-6 mx-auto flex md:grid lg:grid-cols-3 flex-col justify-between gap-4 lg:-top-4 lg:shadow-1 bg-white lg:bg-transparent lg:backdrop-blur rounded-lg w-full">
      <DepartamentoDropdown />
      <CiudadDropdown />
      <CentroPobladoDropdown />
      <TipoAlojamientoCheckGroup />

      <div className="flex flex-col md:flex-row items-center justify-evenly border px-5 border-gray-200 rounded md:col-span-2">
        <div className="flex flex-row justify-center align-center my-4 md:my-6">
          <SlPeople className=" dropdown-icon-primary" />
          <label
            for="bordered-checkbox-1"
            className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
          >
            Cupo
          </label>
          <input
            type="number"
            placeholder="3"
            onChange={(event) => {
              setCupoPersona(event.target.value);
            }}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-3 border-b-2 rounded text-black-900 border-gray-200 max-w-8"
          />
        </div>
        <div className="flex flex-row justify-center align-center my-4 md:my-6">
          <MdOutlineMeetingRoom className=" dropdown-icon-primary" />
          <label
            for="bordered-checkbox-1"
            className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
          >
            Habitaciones
          </label>
          <input
            type="number"
            placeholder="3"
            onChange={(event) => {
              setNumeroHabitaciones(event.target.value);
            }}
            min="1"
            max="10"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-3 border-b-2 rounded text-black-900 border-gray-200 max-w-8"
          />
        </div>
        <div className="flex flex-row justify-center align-center my-4 md:my-6">
          <PiCurrencyCircleDollar className=" dropdown-icon-primary" />
          <label
            for="bordered-checkbox-1"
            className="text-[15px] mt-1 inline-block align-middle font-medium leading-tight "
          >
            Precio Máximo
          </label>
          <input
            type="number"
            placeholder="$100000"
            onChange={(event) => {
              setValorHospedaje(event.target.value);
            }}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-3 border-b-2 rounded text-black-900 border-gray-200 max-w-24"
          />
        </div>
      </div>
      <div className="col-span-3 flex justify-center">
        <button
          onClick={() => handleClick()}
          className="bg-pink-700 hover:bg-pink-800 transition w-80 h-16 rounded-lg flex justify-center items-center text-white text-lg"
        >
          <RiSearch2Line className="text-2xl mx-2" />
          Búsqueda
        </button>
      </div>
    </div>
  );
};

export default Search;
