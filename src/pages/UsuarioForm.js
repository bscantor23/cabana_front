import React from "react";

import COVER_IMAGE from "../assets/img/form-cover.jpg";
import {
  MdOutlineEmail,
  MdOutlinePassword,
  MdOutlinePersonOutline,
  MdOutlinePhoneAndroid,
} from "react-icons/md";

import { useState } from "react";
import { fetchApi, fetchApiPut, fetchApiGet } from "../cases/fetch-api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { BiMap } from "react-icons/bi";
import { Link } from "react-router-dom";

const UsuarioForm = ({ methodForm }) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const { setMessageModal, session } = useContext(AlojamientoContext);

  const [actionMethod, setActionMethod] = useState("");
  const [usuario, setUsuario] = useState({});
  const [identificacion, setIdentificacion] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [clave, setClave] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [rol, setRol] = useState("");
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

  const fetchUsuario = async () => {
    try {
      console.log("entra?");
      const usuarioData = await fetchApiGet("/usuarios/" + id, {
        Authorization: `Bearer ${session.accessToken}`,
      });

      console.log(usuarioData);
      setUsuario([usuarioData]);

      setIdentificacion(usuarioData.id_usuario);
      setCorreoElectronico(usuarioData.correo_electronico);
      setTipoDocumento(usuarioData.tipo_documento.id_tipo_documento);
      setRol(usuarioData.rol.id_rol);
      setPais(usuarioData.pais.id_pais);
      setDireccionResidencia(usuarioData.direccion_residencia);
      setPrimerNombre(usuarioData.primer_nombre);
      setSegundoNombre(usuarioData.segundo_nombre);
      setPrimerApellido(usuarioData.primer_apellido);
      setSegundoApellido(usuarioData.segundo_apellido);
      setTelefonoPrincipal(usuarioData.telefonos[0]?.telefono);
      setTelefonoSecundario(usuarioData.telefonos[1]?.telefono);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCreate = async () => {
    try {
      const registerData = await fetchApi(
        "/usuarios/",
        {
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
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

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
        navigate("/usuarios");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUpdate = async () => {
    try {
      const registerData = await fetchApiPut(
        "/usuarios/" + id,
        {
          correo_electronico: correoElectronico,
          primer_nombre: primerNombre,
          direccion_residencia: direccionResidencia,
          segundo_nombre: segundoNombre,
          primer_apellido: primerApellido,
          segundo_apellido: segundoApellido,
          id_tipo_documento: Number(tipoDocumento),
          id_pais: Number(pais),
          telefonos: [telefonoPrincipal, telefonoSecundario],
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

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
        navigate("/usuarios");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTiposDocumentos();
    fetchPaises();

    if (methodForm !== "POST") {
      fetchUsuario();
    }

    if (methodForm == "POST") {
      setActionMethod("Crear");
    }

    if (methodForm == "PUT") {
      setActionMethod("Actualizar");
    }

    if (methodForm == "GET") {
      setActionMethod("Consultar");
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
        <div className="w-full flex flex-col max-w-[650px]">
          <h1 className="text-4xl flex flex-col justify-center h-100 my-5 text-slate-700">
            Cabana
          </h1>
          <div className="w-full flex flex-col mb-2">
            <h1 className="text-2xl font-semibold mb-4">
              {actionMethod} usuario
            </h1>
            <hr className="my-5" />

            <p className="text-base  mb-2">Por favor ingrese los datos.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="w-full h-full flex flex-row">
              <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Identificación"
                  required
                  disabled={methodForm == "GET" || methodForm == "PUT"}
                  value={identificacion}
                  onChange={(e) => {
                    setIdentificacion(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
              <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlinePersonOutline className="flex-auto text-3xl text-gray-400" />
                </label>
                <select
                  required
                  disabled={methodForm == "GET" || methodForm == "PUT"}
                  value={rol}
                  onChange={(e) => {
                    setRol(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Rol</option>
                  <option key={1} value={1}>
                    Administrador
                  </option>
                  <option key={2} value={2}>
                    Usuario
                  </option>
                </select>
              </div>
            </div>

            {methodForm === "POST" ? (
              <div className="w-full h-full flex flex-row">
                <div className="w-full h-full flex flex-row md:w-1/2 md:pr-2">
                  <label className="flex flex-col align-middle pr-2">
                    <MdOutlineEmail className="flex-auto text-3xl text-gray-400" />
                  </label>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    required
                    disabled={methodForm == "GET"}
                    value={correoElectronico}
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
                      disabled={methodForm == "GET"}
                      value={clave}
                      onChange={(e) => {
                        setClave(e.target.value);
                      }}
                      className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-row">
                <label className="flex flex-col align-middle pr-2">
                  <MdOutlineEmail className="flex-auto text-3xl text-gray-400" />
                </label>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  required
                  disabled={methodForm == "GET"}
                  value={correoElectronico}
                  onChange={(e) => {
                    setCorreoElectronico(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
            )}
            <div className="w-full h-full flex flex-row">
              <label className="flex flex-col align-middle pr-2">
                <BiMap className="flex-auto text-3xl text-gray-400" />
              </label>
              <input
                type="text"
                placeholder="Dirección Residencia"
                required
                disabled={methodForm == "GET"}
                value={direccionResidencia}
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
                  disabled={methodForm == "GET"}
                  value={tipoDocumento}
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
                  disabled={methodForm == "GET"}
                  value={pais}
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
                  disabled={methodForm == "GET"}
                  value={primerNombre}
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
                  disabled={methodForm == "GET"}
                  value={segundoNombre}
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
                  disabled={methodForm == "GET"}
                  value={primerApellido}
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
                  value={segundoApellido}
                  disabled={methodForm == "GET"}
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
                  disabled={methodForm == "GET"}
                  value={telefonoPrincipal}
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
                  disabled={methodForm == "GET"}
                  value={telefonoSecundario}
                  onChange={(e) => {
                    setTelefonoSecundario(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
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
                to="/usuarios"
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

export default UsuarioForm;
