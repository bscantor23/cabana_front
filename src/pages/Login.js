import React, { useState } from "react";

import COVER_IMAGE from "../assets/img/login-cover.jpg";

import { Link, useNavigate } from "react-router-dom";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";
import { fetchApi } from "../cases/fetch-api";

const Login = () => {
  const { session, setSession, setMessageModal } =
    useContext(AlojamientoContext);

  setMessageModal("Credenciales fallidas, por favor intente de nuevo");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const fetchLogin = async (correo_electronico, clave) => {
    try {
      const loginData = await fetchApi("/auth/login", {
        correo_electronico,
        clave,
      });

      if (loginData.statusCode === 404) {
        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        setSession({
          ...loginData,
        });
        window.localStorage.setItem("session", JSON.stringify(loginData));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchLogin(email, password);
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
        <div className="w-full flex flex-col max-w-[550px]">
          <h1 className="text-3xl flex flex-col justify-center h-100 my-5 text-slate-700">
            Cabana
          </h1>

          <div className="w-full flex flex-col mb-2">
            <h1 className="text-3xl font-semibold mb-4">Login</h1>
            <p className="text-base  mb-2">
              ¡Bienvenido de nuevo! Por favor ingrese sus datos.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>

            <input
              type="password"
              name="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Contraseña"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
            />

            <div className="w-full flex items-center justify-between">
              <div className="w-full flex">
                <input type="checkbox" className="mr-2" />
                <p className="text-sm">Recuerdame</p>
              </div>

              <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2">
                ¿Olvidaste tu contraseña?
              </p>
            </div>
            <div className="w-full flex flex-col my-4">
              <button
                type="submit"
                className="w-full
            
           hover:bg-pink-800 transition
            bg-pink-600 font-semibold my-2 text-white rounded-md p-4 text-center flex items-center justify-center"
              >
                Iniciar Sesión
              </button>
              <Link to="/register">
                <button className="w-full bg-white font-semibold my-2 text-[#060606] border-2 boder-black rounded-md p-4 text-center flex items-center justify-center">
                  Registrarse
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
