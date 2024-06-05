import React, { useContext } from "react";

import { AlojamientoContext } from "../cases/AlojamientoContext";

import Alojamiento from "./Alojamiento";

import { Link } from "react-router-dom";

import { ImSpinner2 } from "react-icons/im";

const AlojamientosList = () => {
  const { alojamientos, loading, session } = useContext(AlojamientoContext);

  if (loading) {
    return (
      <ImSpinner2 className="mx-auto animate-spin text-pink-700 text-4x1 mt-[200px]"></ImSpinner2>
    );
  }

  if (alojamientos.length < 1) {
    return (
      <div className="text-center text-3x1 text-gray-400 mt-72 mb-10">
        Lo sentimos, no se encontraron alojamientos
      </div>
    );
  }

  return (
    <section className="mb-20 pt-48 md:pt-0 lg:pt-40 ">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-4 lg:gap-14">
          {alojamientos.map((alojamiento) => {
            return (
              <Link
                to={`/alojamientos/${alojamiento.id_alojamiento}`}
                key={alojamiento.id_alojamiento}
              >
                <Alojamiento alojamiento={alojamiento}></Alojamiento>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AlojamientosList;
