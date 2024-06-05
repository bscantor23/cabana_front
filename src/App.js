import React from "react";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Alojamiento from "./pages/Alojamiento";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Usuario from "./pages/Usuarios";
import Propiedad from "./pages/Propiedades";
import Reserva from "./pages/Reservas";
import Modal from "./components/Modal";
import UsuarioForm from "./pages/UsuarioForm";
import PropiedadForm from "./pages/PropiedadForm";
import ReservaForm from "./pages/ReservaForm";

const App = () => {
  return (
    <div className="max-w-[1700px] mx-auto bg-white">
      <Header />
      <Modal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alojamientos/:id" element={<Alojamiento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/propiedades" element={<Propiedad />} />
        <Route path="/reservas" element={<Reserva />} />
        <Route
          path="/usuarios/form"
          element={<UsuarioForm methodForm={"POST"} />}
        />
        <Route
          path="/usuarios/form/:id"
          element={<UsuarioForm methodForm={"GET"} />}
        />
        <Route
          path="/usuarios/update/:id"
          element={<UsuarioForm methodForm={"PUT"} />}
        />
        <Route
          path="/propiedades/form"
          element={<PropiedadForm methodForm={"POST"} />}
        />
        <Route
          path="/propiedades/form/:id"
          element={<PropiedadForm methodForm={"GET"} />}
        />
        <Route
          path="/propiedades/update/:id"
          element={<PropiedadForm methodForm={"PUT"} />}
        />
        <Route
          path="/reservas/form/:id"
          element={<ReservaForm methodForm={"GET"} />}
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
