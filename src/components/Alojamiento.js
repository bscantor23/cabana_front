import React from "react";

import { BiBed, BiBath, BiArea } from "react-icons/bi";
import { MdPets } from "react-icons/md";
import { TiWeatherSunny } from "react-icons/ti";
import { SlPeople } from "react-icons/sl";
import { Link } from "react-router-dom";
import { RiMapPin2Line } from "react-icons/ri";
import { useContext } from "react";
import { AlojamientoContext } from "../cases/AlojamientoContext";

const Alojamiento = ({ alojamiento }) => {
  const { session } = useContext(AlojamientoContext);

  let {
    fotografias,
    tipo_alojamiento,
    centro_poblado,
    address,
    numero_habitaciones,
    titulo,
    descripcion,
    numero_banos,
    permite_mascotas,
    tiene_calefaccion,
    valor_hospedaje,
    direccion_fisica,
    cupo_persona,
  } = alojamiento;

  valor_hospedaje = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(valor_hospedaje));

  return (
    <div className="bg-white shadow-1 p-5 h-full rounded-lg rounded-tl-[90px] w-full mx-auto cursor-pointer hover:shadow-2xl transition">
      <img
        className="mb-8 min-h-[300px] rounded-tl-[70px] w-full object-cover max-h-[300px]"
        src={fotografias[0]?.uri}
      ></img>
      <hr className="mb-3" />

      <div className="text-lg font-semibold mb-4">{titulo}</div>
      <div className="mb-4 flex flex-wrap justify-start text-sm gap-3">
        <span className="bg-green-500 rounded-full text-white px-3">
          {tipo_alojamiento.nombre}
        </span>
        <span className=" bg-orange-500 rounded-full text-white px-3">
          {centro_poblado.ciudad.departamento.nombre}
        </span>
        <span className=" bg-violet-500 rounded-full text-white px-3">
          {centro_poblado.ciudad.nombre}
        </span>
        <span className=" bg-blue-500 rounded-full text-white px-3">
          {centro_poblado.nombre}
        </span>
      </div>
      <div className="flex gap-x-4 my-4">
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <SlPeople />
          </div>
          <div>{cupo_persona}</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <BiBed />
          </div>
          <div>{numero_habitaciones}</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <BiBath />
          </div>
          <div>{numero_banos}</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <MdPets className={permite_mascotas ? "text-pink-600" : ""} />
          </div>
        </div>

        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <TiWeatherSunny
              className={tiene_calefaccion ? "text-pink-600" : ""}
            />
          </div>
        </div>

        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <RiMapPin2Line />
          </div>
          <div>{direccion_fisica}</div>
        </div>
      </div>
      <div className="text-lg font-semibold text-pink-600 mb-4">
        <span className="text-black">Precio noche: </span>
        {valor_hospedaje}
      </div>
      <div className="text-lg mb-4">{descripcion}</div>
      <hr className="mb-3" />
      <div className="flex flex-row justify-center align-middle">
        <Link
          to={`/alojamientos/${alojamiento.id_alojamiento}`}
          key={alojamiento.id_alojamiento}
          className={
            "min-w-48 text-center *:self-center bg-pink-600 text-white py-2 px-4 rounded-lg"
          }
        >
          {session ? "Reservar" : "Ver más"}
        </Link>
      </div>
    </div>
  );
};

export default Alojamiento;
