import React from "react";

import SimpleTable from "../components/SimpleTable";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../cases/fetch-api";
import dayjs from "dayjs";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";

const Usuarios = () => {
  const { session, setSession } = useContext(AlojamientoContext);
  const [usuarios, setUsuarios] = useState([]);

  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    try {
      let usuariosData = await fetchApi(
        "/usuarios/search",
        {},
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      usuariosData = usuariosData.map((usuario) => {
        return {
          ...usuario,
          nombre:
            usuario.primer_nombre +
            " " +
            usuario.segundo_nombre +
            " " +
            usuario.primer_apellido +
            " " +
            usuario.segundo_apellido,
        };
      });

      setUsuarios([...usuariosData]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
    fetchUsuarios();
  }, []);

  const columns = [
    {
      header: "Identificador",
      accessorKey: "id_usuario",
    },
    {
      header: "Tipo documento",
      accessorKey: "tipo_documento.codigo",
    },
    {
      header: "Correo electrónico",
      accessorKey: "correo_electronico",
    },
    {
      header: "Nombre completo",
      accessorKey: "nombre",
    },
    {
      header: "Dirección residencia",
      accessorKey: "direccion_residencia",
    },
    {
      header: "Fecha creación",
      accessorKey: "fecha_creacion",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      header: "Fecha actualización",
      accessorKey: "fecha_actualizacion",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div className="min-h-[700px]">
      <SimpleTable
        data={usuarios}
        columns={columns}
        name="Usuarios"
        id="id_usuario"
        createForm={"/usuarios/form"}
        getForm={"/usuarios/form/"}
        updateForm={"/usuarios/update/"}
      />
    </div>
  );
};

export default Usuarios;
