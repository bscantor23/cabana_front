import React from "react";

import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/img/logo.png";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";

import {
  MdOutlineBookmarks,
  MdOutlinePersonOutline,
  MdHouseSiding,
} from "react-icons/md";

const Header = () => {
  const { pathname } = useLocation();
  const { session, setSession } = useContext(AlojamientoContext);

  if (pathname === "/login" || pathname === "/register") {
    return (
      <header className="py-6 border-b">
        <div className="flex justify-center items-center">
          <Link to="/">
            <img className="w-24" src={Logo} alt="Cabana" />
          </Link>
          <h1 className="text-3xl flex flex-col justify-center h-100 text-slate-700 px-4">
            Cabana
          </h1>
        </div>
      </header>
    );
  }
  return (
    <header className="py-6  border-b">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-1 justify-start">
          <Link to="/">
            <img className="w-24" src={Logo} alt="Cabana" />
          </Link>
          <h1 className="text-3xl flex flex-col justify-center h-100 text-slate-700 px-4">
            Cabana
          </h1>
        </div>

        {!session ? (
          <div className="flex items-center gap-6">
            <Link className="hover:text-pink-900 transition" to="/login">
              Iniciar sesión
            </Link>
            <Link
              className="hover:bg-pink-800 bg-pink-700 text-white px-4 py-3 rounded-lg transition"
              to="/register"
            >
              Registrarse
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row mt-8 md:mt-0 items-center gap-6">
            {session.user?.id_rol === 1 && (
              <Link
                className={
                  "hover:text-pink-900 transition flex flex-row justify-center align-middle" +
                  (pathname === "/usuarios"
                    ? " text-pink-900 border-b-2 px-2 border-pink-700"
                    : "")
                }
                to="/usuarios"
              >
                <MdOutlinePersonOutline className="text-3xl text-center pr-2 pb-1" />
                Usuarios
              </Link>
            )}

            <Link
              className={
                "hover:text-pink-900 transition flex flex-row justify-center align-middle" +
                (pathname === "/propiedades"
                  ? " text-pink-900 border-b-2 px-2 border-pink-700"
                  : "")
              }
              to="/propiedades"
            >
              <MdHouseSiding className="text-3xl text-center pr-2 pb-1" />
              Propiedades
            </Link>

            <Link
              className={
                "hover:text-pink-900 transition flex flex-row justify-center align-middle" +
                (pathname === "/reservas"
                  ? " text-pink-900 border-b-2 px-2 border-pink-700"
                  : "")
              }
              to="/reservas"
            >
              <MdOutlineBookmarks className="text-3xl text-center pr-2 pb-1" />
              Reservas
            </Link>

            <Link
              className="hover:bg-pink-800 bg-pink-700 text-white px-4 py-3 rounded-lg transition"
              onClick={(event) => {
                setSession(null);
                window.localStorage.clear();
              }}
              to="/"
            >
              Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
