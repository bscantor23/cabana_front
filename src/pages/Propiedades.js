import React from "react";

import SimpleTable from "../components/SimpleTable";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../cases/fetch-api";
import dayjs from "dayjs";

import { BiBath, BiBed } from "react-icons/bi";
import { MdOutlinePersonOutline, MdPets } from "react-icons/md";
import { BsHouse } from "react-icons/bs";
import { PiWarehouseDuotone } from "react-icons/pi";
import { TiWeatherSunny } from "react-icons/ti";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";

const Propiedades = () => {
  const { session, setSession } = useContext(AlojamientoContext);

  let notAllowCreate = false;
  let notAllowUpdate = false;
  let notAllowDelete = false;
  if (session && session.user.id_rol === 1) {
    notAllowCreate = true;
    notAllowUpdate = true;
    notAllowDelete = true;
  }

  const navigate = useNavigate();

  const [propiedades, setPropiedades] = useState([]);

  const fetchPropiedades = async () => {
    try {
      let where = {};
      if (session.user.id_rol !== 1) {
        where = {
          id_propietario: session.user.id_usuario,
        };
      }

      let propiedadesData = await fetchApi(
        "/alojamientos/search",
        {
          where,
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      propiedadesData = propiedadesData.map((propiedad) => {
        return {
          ...propiedad,
          id_alojamiento: String(propiedad.id_alojamiento),
          tiene_calefaccion: propiedad.tiene_calefaccion ? "SI" : "NO",
          permite_mascotas: propiedad.permite_mascotas ? "SI" : "NO",
          valor_hospedaje: Number(propiedad.valor_hospedaje),
          propietario_nombre:
            propiedad.propietario.primer_nombre +
            " " +
            propiedad.propietario.primer_apellido,
        };
      });

      setPropiedades([...propiedadesData]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
    fetchPropiedades();
  }, []);

  const columns = [
    {
      header: "Id",
      accessorKey: "id_alojamiento",
    },
    {
      header: "Propietario",
      accessorKey: "propietario_nombre",
    },
    {
      header: "Tipo alojamiento",
      accessorKey: "tipo_alojamiento.nombre",
      cell: (info) => {
        return (
          <div className="flex flex-row justify-center">
            <span className="self-center">{info.getValue()}</span>
            {info.getValue() == "Cabaña" ? (
              <PiWarehouseDuotone className="self-center text-3xl mx-2 text-center pr-2 pb-1" />
            ) : (
              <BsHouse className="self-center text-3xl text-center mx-2 pr-2 pb-1" />
            )}
          </div>
        );
      },
    },
    {
      header: "Departamento",
      accessorKey: "centro_poblado.ciudad.departamento.nombre",
    },
    {
      header: "Ciudad",
      accessorKey: "centro_poblado.ciudad.nombre",
    },
    {
      header: "Centro poblado",
      accessorKey: "centro_poblado.nombre",
    },
    {
      header: "Título",
      accessorKey: "titulo",
      cell: (info) => {
        return info.getValue().substring(0, 20) + "...";
      },
    },
    {
      header: "Habitaciones",
      accessorKey: "numero_habitaciones",
      meta: {
        filterVariant: "range",
      },
      cell: (info) => {
        return (
          <div className="flex flex-row justify-center">
            <span className="self-center min-w-5">{info.getValue()}</span>
            <BiBed className="self-center text-3xl text-center pr-2 pb-1" />
          </div>
        );
      },
    },
    {
      header: "Cupo",
      accessorKey: "cupo_persona",
      meta: {
        filterVariant: "range",
      },
      cell: (info) => {
        return (
          <div className="flex flex-row justify-center">
            <span className="self-center min-w-5">{info.getValue()}</span>
            <MdOutlinePersonOutline className="self-center text-3xl text-center pr-2 pb-1" />
          </div>
        );
      },
    },
    {
      header: "Baños",
      accessorKey: "numero_banos",
      meta: {
        filterVariant: "range",
      },
      cell: (info) => {
        return (
          <div className="flex flex-row justify-center">
            <span className="self-center min-w-5">{info.getValue()}</span>
            <BiBath className="self-center text-3xl text-center pr-2 pb-1" />
          </div>
        );
      },
    },
    {
      header: "Calefacción",
      accessorKey: "tiene_calefaccion",

      cell: (info) => {
        return (
          <div className="flex flex-row justify-center">
            <span className="self-center min-w-8">{info.getValue()}</span>
            <TiWeatherSunny className="self-center text-3xl text-center pr-2 pb-1" />
          </div>
        );
      },
    },
    {
      header: "Mascotas",
      accessorKey: "permite_mascotas",
      cell: (info) => {
        return (
          <div className="flex flex-row justify-center">
            <span className="self-center min-w-8">{info.getValue()}</span>
            <MdPets className="self-center text-3xl text-center pr-2 pb-1" />
          </div>
        );
      },
    },
    {
      header: "Valor hospedaje",
      accessorKey: "valor_hospedaje",
      meta: {
        filterVariant: "range",
        customSize: true,
      },
      cell: (info) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(info.getValue()));
      },
    },
    {
      header: "Fecha de creación",
      accessorKey: "fecha_creacion",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      header: "Fecha de actualización",
      accessorKey: "fecha_actualizacion",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div className="min-h-[700px]">
      {session && (
        <SimpleTable
          data={propiedades}
          columns={columns}
          name="Propiedades"
          id="id_alojamiento"
          createForm={"/propiedades/form"}
          getForm={"/propiedades/form/"}
          updateForm={"/propiedades/update/"}
          notAllowCreate={notAllowCreate}
          notAllowUpdate={notAllowUpdate}
          notAllowDelete={notAllowDelete}
        />
      )}
    </div>
  );
};

export default Propiedades;
