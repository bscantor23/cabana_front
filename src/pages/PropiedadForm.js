import React from "react";

import COVER_IMAGE from "../assets/img/form-cover.jpg";
import { BiBed, BiBath } from "react-icons/bi";
import { SlPeople } from "react-icons/sl";

import { useState } from "react";
import { fetchApi, fetchApiPut, fetchApiGet } from "../cases/fetch-api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BiMap } from "react-icons/bi";

const PropiedadForm = ({ methodForm }) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const { setMessageModal, session } = useContext(AlojamientoContext);

  const [actionMethod, setActionMethod] = useState("");

  const [alojamiento, setAlojamiento] = useState({});

  const [tipoAlojamiento, setTipoAlojamiento] = useState("");
  const [centroPoblado, setCentroPoblado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccionFisica, setDireccionFisica] = useState("");
  const [valorHospedaje, setValorHospedaje] = useState("");
  const [cupoPersona, setCupoPersona] = useState("");
  const [numeroHabitaciones, setNumeroHabitaciones] = useState("");
  const [numeroBanos, setNumeroBanos] = useState("");
  const [tieneCalefaccion, setTieneCalefaccion] = useState("");
  const [permiteMascotas, setPermiteMascotas] = useState("");

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [centrosPoblados, setCentrosPoblados] = useState([]);

  const fetchDepartamentos = async () => {
    try {
      const departamentosData = await fetchApi("/general/departamentos");
      setDepartamentos([...departamentosData]);

      if (methodForm == "GET") {
        fetchCiudades();
        fetchCentrosPoblados();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCiudades = async (id_departamento) => {
    try {
      const ciudadesData = await fetchApi("/general/ciudades", {
        where: {
          id_departamento,
        },
      });
      setCiudades([...ciudadesData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCentrosPoblados = async (id_ciudad) => {
    try {
      const centrosPobladosData = await fetchApi("/general/centros-poblados", {
        where: {
          id_ciudad,
        },
      });
      setCentrosPoblados([...centrosPobladosData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAlojamiento = async () => {
    try {
      const alojamientoData = await fetchApiGet("/alojamientos/" + id);
      console.log(alojamientoData);
      setAlojamiento([alojamientoData]);

      setTipoAlojamiento(alojamientoData.tipo_alojamiento.id_tipo_alojamiento);
      setCentroPoblado(alojamientoData.centro_poblado.id_centro_poblado);
      setCiudad(alojamientoData.centro_poblado.id_ciudad);
      setDepartamento(alojamientoData.centro_poblado.ciudad.id_departamento);
      setTitulo(alojamientoData.titulo);
      setDescripcion(alojamientoData.descripcion);
      setDireccionFisica(alojamientoData.direccion_fisica);
      setValorHospedaje(alojamientoData.valor_hospedaje);
      setCupoPersona(alojamientoData.cupo_persona);
      setNumeroHabitaciones(alojamientoData.numero_habitaciones);
      setNumeroBanos(alojamientoData.numero_banos);
      setTieneCalefaccion(alojamientoData.tiene_calefaccion);
      setPermiteMascotas(alojamientoData.permite_mascotas);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCreate = async () => {
    try {
      const registerData = await fetchApi(
        "/alojamientos/",
        {
          id_tipo_alojamiento: Number(tipoAlojamiento),
          id_centro_poblado: Number(centroPoblado),
          titulo,
          descripcion,
          direccion_fisica: direccionFisica,
          valor_hospedaje: valorHospedaje,
          cupo_persona: Number(cupoPersona),
          numero_habitaciones: Number(numeroHabitaciones),
          numero_banos: Number(numeroBanos),
          tiene_calefaccion: tieneCalefaccion == "on",
          permite_mascotas: permiteMascotas == "on",
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      if (registerData.statusCode === 400) {
        setMessageModal("Problema en el servidor, contacte a soporte");
        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        navigate("/propiedades");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUpdate = async () => {
    try {
      const registerData = await fetchApiPut(
        "/alojamientos/" + id,
        {
          id_tipo_alojamiento: Number(tipoAlojamiento),
          id_centro_poblado: Number(centroPoblado),
          titulo,
          descripcion,
          direccion_fisica: direccionFisica,
          valor_hospedaje: valorHospedaje,
          cupo_persona: Number(cupoPersona),
          numero_habitaciones: Number(numeroHabitaciones),
          numero_banos: Number(numeroBanos),
          tiene_calefaccion: tieneCalefaccion == "on",
          permite_mascotas: permiteMascotas == "on",
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      if (registerData.statusCode === 400) {
        setMessageModal("Problema en el servidor, contacte a soporte");
        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        navigate("/propiedades");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDepartamentos();

    if (methodForm !== "POST") {
      fetchAlojamiento();
    }

    if (methodForm == "POST") {
      setActionMethod("Crear");
    }

    if (methodForm == "PUT") {
      setActionMethod("Actualizar");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (methodForm === "PUT") {
      fetchUpdate();
    } else {
      fetchCreate();
    }
  };

  return (
    <div className="container-fluid flex w-full items-start">
      <div className="relative w-full h-full flex flex-col">
        <img
          className="w-full max-h-[80vh] min-h-[80vh] object-cover"
          src={COVER_IMAGE}
        ></img>
      </div>

      <div className="w-1/2 w-full h-full bg-[#f5f5f5 ] flex items-center p-10">
        <div className="w-full flex flex-col max-w-[700px]">
          <h1 className="text-4xl flex flex-col justify-center h-100 my-5 text-slate-700">
            Cabana
          </h1>
          <div className="w-full flex flex-col mb-2">
            <h1 className="text-2xl font-semibold mb-4">
              {actionMethod} propiedad
            </h1>
            <hr className="my-5" />

            <p className="text-base  mb-2">Por favor ingrese los datos.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="w-full h-full flex flex-row justify-center gap-3">
              <div className="flex w-full flex-row self-center">
                <label className="flex flex-col align-middle pr-2">
                  <BsHouse className="flex-auto text-3xl text-gray-400" />
                </label>
                <select
                  required
                  value={tipoAlojamiento}
                  disabled={methodForm == "GET"}
                  onChange={(e) => {
                    setTipoAlojamiento(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Tipo Alojamiento</option>
                  <option key={1} value={1}>
                    Cabaña
                  </option>
                  <option key={2} value={2}>
                    Casa
                  </option>
                </select>
              </div>
            </div>
            <div className="w-full h-full flex flex-row justify-center">
              <div className="flex w-full flex-row self-center">
                <label className="flex flex-col align-middle pr-2">
                  <HiOutlineCurrencyDollar className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="number"
                  placeholder="Valor hospedaje"
                  name="valor_hospedaje"
                  required
                  disabled={methodForm == "GET"}
                  value={valorHospedaje}
                  onChange={(e) => {
                    setValorHospedaje(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
              <div className="flex flex-row md:pl-2 self-center">
                <label className="self-center font-semibold">
                  <SlPeople className="flex-auto text-3xl mx-3 text-gray-400" />
                </label>

                <input
                  className="border border-gray-300 focus:border-pink-700 outline-none rounded px-4 h-14 text-sm"
                  type="number"
                  name="cupo_persona"
                  onChange={(e) => {
                    setCupoPersona(e.target.value);
                  }}
                  disabled={methodForm == "GET"}
                  max={10}
                  min={1}
                  value={cupoPersona}
                  placeholder="Personas"
                />
              </div>
              <div className="flex flex-row md:pl-2 self-center">
                <label className="self-center font-semibold">
                  <BiBed className="flex-auto text-3xl mx-3 text-gray-400" />
                </label>

                <input
                  className="border border-gray-300 focus:border-pink-700 outline-none rounded px-4 h-14 text-sm"
                  type="number"
                  name="numero_habitaciones"
                  onChange={(e) => {
                    setNumeroHabitaciones(e.target.value);
                  }}
                  disabled={methodForm == "GET"}
                  max={10}
                  min={1}
                  value={numeroHabitaciones}
                  placeholder="Habitaciones"
                />
              </div>
              <div className="flex flex-row md:pl-2 self-center">
                <label className="self-center font-semibold">
                  <BiBath className="flex-auto text-3xl mx-2 text-gray-400" />
                </label>

                <input
                  className="border border-gray-300 focus:border-pink-700 outline-none rounded px-4 h-14 text-sm"
                  type="number"
                  name="numero_banos"
                  onChange={(e) => {
                    setNumeroBanos(e.target.value);
                  }}
                  disabled={methodForm == "GET"}
                  max={10}
                  min={1}
                  value={numeroBanos}
                  placeholder="Baños"
                />
              </div>
            </div>
            <div className="w-full h-full flex flex-row justify-center gap-3">
              <div className="flex w-full flex-row self-center">
                <select
                  required
                  disabled={methodForm == "GET"}
                  value={departamento}
                  onChange={(e) => {
                    setDepartamento(Number(e.target.value));
                    setCentrosPoblados([]);
                    fetchCiudades(Number(e.target.value));
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Departamento</option>
                  {departamentos.map((departamento) => (
                    <option
                      key={departamento.id_departamento}
                      value={departamento.id_departamento}
                    >
                      {departamento.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex w-full flex-row self-center">
                <select
                  required
                  disabled={methodForm == "GET"}
                  value={ciudad}
                  onChange={(e) => {
                    setCiudad(Number(e.target.value));
                    setCentrosPoblados([]);
                    fetchCentrosPoblados(Number(e.target.value));
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Ciudad</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex w-full flex-row self-center">
                <select
                  required
                  disabled={methodForm == "GET"}
                  value={centroPoblado}
                  onChange={(e) => {
                    setCentroPoblado(Number(e.target.value));
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Centro Poblado</option>
                  {centrosPoblados.map((centroPoblado) => (
                    <option
                      key={centroPoblado.id_centro_poblado}
                      value={centroPoblado.id_centro_poblado}
                    >
                      {centroPoblado.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full h-full flex flex-row">
              <label className="flex flex-col align-middle pr-2">
                <BsHouse className="flex-auto text-3xl text-gray-400" />
              </label>
              <input
                type="text"
                placeholder="Título"
                name="titulo"
                required
                disabled={methodForm == "GET"}
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                }}
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-full h-full flex flex-row">
              <label className="flex flex-col align-middle pr-2">
                <BiMap className="flex-auto text-3xl text-gray-400" />
              </label>
              <input
                type="text"
                placeholder="Dirección física"
                name="direccion_fisica"
                required
                disabled={methodForm == "GET"}
                value={direccionFisica}
                onChange={(e) => {
                  setDireccionFisica(e.target.value);
                }}
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-full h-full flex flex-row">
              <textarea
                type="text"
                placeholder="Descripción"
                name="descripcion"
                required
                disabled={methodForm == "GET"}
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                }}
                className="w-full text-black py-2 my-2 min-h-[150px] bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-full h-full flex flex-row justify-center mt-3">
              <div className="h-full flex flex-row md:w-1/3 md:pl-2 self-center">
                <div className="flex flex-row gap-2 justify-start align-middle">
                  <input
                    className="form-checkbox text-pink-600 self-center"
                    disabled={methodForm == "GET"}
                    type="checkbox"
                    name="permite_mascotas"
                    checked={permiteMascotas}
                    onChange={(e) => {
                      setPermiteMascotas(e.target.value);
                    }}
                  ></input>
                  <span className="self-center">Permite mascotas</span>
                </div>
              </div>
              <div className="h-full flex flex-row md:w-1/3 md:pl-2 self-center">
                <div className="flex flex-row gap-2 justify-start align-middle">
                  <input
                    className="form-checkbox text-pink-600 self-center"
                    disabled={methodForm == "GET"}
                    type="checkbox"
                    name="tiene_calefaccion"
                    value={tieneCalefaccion}
                    onChange={(e) => {
                      setTieneCalefaccion(e.target.value);
                    }}
                  ></input>
                  <span className="self-center">Tiene calefacción</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row justify-center my-4">
              {methodForm != "GET" ? (
                <button
                  type="submit"
                  className="w-full mx-2
            
           hover:bg-pink-800 transition
            bg-pink-600 font-semibold my-2 text-white rounded-md p-4 text-center flex items-center justify-center"
                >
                  {actionMethod}
                </button>
              ) : (
                ""
              )}

              <Link
                to="/propiedades"
                className="w-full mx-2
      hover:bg-gray-300 transition
      bg-white font-semibold my-2 text-gray-700 rounded-md p-4 text-center flex items-center justify-center border border-gray-300"
              >
                Regresar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropiedadForm;
