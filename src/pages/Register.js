import React from "react";

import COVER_IMAGE from "../assets/img/login-cover.jpg";
import {
  MdOutlineEmail,
  MdOutlinePassword,
  MdOutlinePersonOutline,
  MdOutlinePhoneAndroid,
} from "react-icons/md";

import { Link } from "react-router-dom";
import { useState } from "react";
import { fetchApi } from "../cases/fetch-api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";

import { BiMap } from "react-icons/bi";

const Register = () => {
  const navigate = useNavigate();

  const { setMessageModal } = useContext(AlojamientoContext);

  const [identificacion, setIdentificacion] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [clave, setClave] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [pais, setPais] = useState("");
  const [direccionResidencia, setDireccionResidencia] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [telefonoPrincipal, setTelefonoPrincipal] = useState("");
  const [telefonoSecundario, setTelefonoSecundario] = useState("");

  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [paises, setPaises] = useState([]);

  const fetchTiposDocumentos = async () => {
    try {
      const tiposDocumentosData = await fetchApi(
        "/general/tipos-documentos",
        {}
      );
      setTiposDocumentos([...tiposDocumentosData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPaises = async () => {
    try {
      const paisesData = await fetchApi("/general/paises", {});
      setPaises([...paisesData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRegister = async () => {
    try {
      const registerData = await fetchApi("/auth/register", {
        id_usuario: identificacion,
        correo_electronico: correoElectronico,
        clave,
        primer_nombre: primerNombre,
        direccion_residencia: direccionResidencia,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        id_tipo_documento: Number(tipoDocumento),
        id_pais: Number(pais),
        id_rol: 2,
        telefonos: [telefonoPrincipal, telefonoSecundario],
      });

      if (registerData.statusCode === 400) {
        if (registerData.message === "UsuarioAlreadyExists") {
          setMessageModal(
            "Acceso denegado, el identificador ya se encuentra registrado"
          );
        }

        if (registerData.message === "CorreoElectronicoAlreadyExists") {
          setMessageModal(
            "Acceso denegado, el correo electrónico ya se encuentra registrado"
          );
        }

        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTiposDocumentos();
    fetchPaises();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchRegister();
  };

  return (
    <div className="container-fluid grid md:grid-cols-2 w-full items-start">
      <div className="relative w-full h-full flex flex-col">
        <div className="absolute top-[30%] left-[10%] flex flex-col">
          <h1 className="text-4xl font-bold text-white my-4">
            Vuelve tus ideas una realidad
          </h1>
          <p className="text-base text-white font-normal">
            Registrate gratis y obtén atractivas ofertas de la comunidad
          </p>
        </div>

        <img
          className="w-full max-h-[80vh] min-h-[80vh] object-cover"
          src={COVER_IMAGE}
        ></img>
      </div>

      <div className="w-1/2 w-full h-full bg-[#f5f5f5 ] flex items-center p-10">
        <div className="w-full flex flex-col max-w-[650px]">
          <h1 className="text-3xl flex flex-col justify-center h-100 my-5 text-slate-700">
            Cabana
          </h1>

          <div className="w-full flex flex-col mb-2">
            <h1 className="text-3xl font-semibold mb-4">Sign up</h1>
            <p className="text-base  mb-2">
              ¡Bienvenido! Por favor ingrese sus datos.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="w-full h-full flex flex-row">
              <label className="flex flex-col align-middle pr-2">
                <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
              </label>
              <input
                type="text"
                placeholder="Identificación"
                required
                onChange={(e) => {
                  setIdentificacion(e.target.value);
                }}
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-full h-full flex flex-row">
              <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlineEmail className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  required
                  onChange={(e) => {
                    setCorreoElectronico(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
              <div className="w-full h-full flex flex-row  md:w-1/2 md:pl-2">
                <div className="w-full h-full flex flex-row">
                  <label className="flex flex-col align-middle pr-2">
                    <MdOutlinePassword className="flex-auto text-3xl text-gray-400" />
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    required
                    onChange={(e) => {
                      setClave(e.target.value);
                    }}
                    className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-full flex flex-row">
              <label className="flex flex-col align-middle pr-2">
                <BiMap className="flex-auto text-3xl text-gray-400" />
              </label>
              <input
                type="text"
                placeholder="Dirección Residencia"
                required
                onChange={(e) => {
                  setDireccionResidencia(e.target.value);
                }}
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-full h-full flex flex-row">
              <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <select
                  required
                  onChange={(e) => {
                    setTipoDocumento(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Tipo documento</option>
                  {tiposDocumentos.map((tipoDocumento) => (
                    <option
                      key={tipoDocumento.id}
                      value={tipoDocumento.id_tipo_documento}
                    >
                      {tipoDocumento.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full h-full flex flex-row  md:w-1/2 md:pl-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <select
                  required
                  onChange={(e) => {
                    setPais(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option value="">País</option>
                  {paises.map((pais) => (
                    <option key={pais.id} value={pais.id_pais}>
                      {pais.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full h-full flex flex-row">
              <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Primer Nombre"
                  required
                  onChange={(e) => {
                    setPrimerNombre(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>

              <div className="w-full h-full flex flex-row md:w-1/2 md:pl-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Segundo Nombre"
                  required
                  onChange={(e) => {
                    setSegundoNombre(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full h-full flex flex-row">
              <div className="w-full  h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Primer Apellido"
                  required
                  onChange={(e) => {
                    setPrimerApellido(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>

              <div className="w-full h-full flex flex-row  md:w-1/2 md:pl-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Segundo Apellido"
                  required
                  onChange={(e) => {
                    setSegundoApellido(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full h-full flex flex-row">
              <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePhoneAndroid className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Teléfono Principal"
                  required
                  onChange={(e) => {
                    setTelefonoPrincipal(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>

              <div className="w-full h-full flex flex-row md:w-1/2 md:pl-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePhoneAndroid className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Teléfono Adicional"
                  required
                  onChange={(e) => {
                    setTelefonoSecundario(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full flex flex-col my-4">
              <button
                type="submit"
                className="w-full
            
           hover:bg-pink-800 transition
            bg-pink-600 font-semibold my-2 text-white rounded-md p-4 text-center flex items-center justify-center"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
