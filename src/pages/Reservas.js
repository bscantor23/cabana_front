import React from "react";

import SimpleTable from "../components/SimpleTable";
import { useState, useEffect } from "react";
import { fetchApi } from "../cases/fetch-api";
import { MdOutlinePersonOutline, MdPets } from "react-icons/md";
import TipoReservaCheckGroup from "../components/TipoReservaCheckGroup";
import { useContext } from "react";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useNavigate } from "react-router-dom";

import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

const Reservas = () => {
  const { session, setSession, isPropietarioChecked, isArrendatarioChecked } =
    useContext(AlojamientoContext);

  let notAllowCreate = true;
  let notAllowUpdate = true;
  let notAllowDelete = true;
  if (session && session.user.id_rol === 1) {
    notAllowUpdate = true;
    notAllowDelete = true;
  }
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);

  const fetchReservas = async (propietarioChecked) => {
    try {
      let where = {};
      if (session.user.id_rol !== 1) {
        if (propietarioChecked) {
          where = {
            alojamiento: {
              propietario: {
                id_usuario: session.user.id_usuario,
              },
            },
          };
        } else {
          where = {
            arrendatario: {
              id_usuario: session.user.id_usuario,
            },
          };
        }
      }

      let reservasData = await fetchApi(
        "/reservas/search",
        { where },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      reservasData = reservasData.map((reserva) => {
        return {
          ...reserva,
          id_reserva: String(reserva.id_reserva),
          incluye_mascotas: reserva.incluye_mascotas ? "SI" : "NO",
          valor_hospedaje: Number(reserva.valor_hospedaje),
          valor_cancelado: Number(reserva.valor_cancelado),
          propietario_nombre:
            reserva.alojamiento.propietario.primer_nombre +
            " " +
            reserva.alojamiento.propietario.primer_apellido,
          arrendatario_nombre:
            reserva.arrendatario.primer_nombre +
            " " +
            reserva.arrendatario.primer_apellido,
          fecha_inicio: dayjs.utc(reserva.fecha_inicio).format("YYYY-MM-DD"),
          fecha_fin: dayjs.utc(reserva.fecha_fin).format("YYYY-MM-DD"),
          numero_personas: Number(reserva.numero_personas),
        };
      });

      setReservas([...reservasData]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
    fetchReservas(isPropietarioChecked);
  }, []);

  let filters = [];

  if (session.user.id_rol !== 1) {
    filters.push({
      label: "Tipo de reserva",
      component: <TipoReservaCheckGroup functionReserva={fetchReservas} />,
    });
  }

  const columns = [
    {
      header: "Id",
      accessorKey: "id_reserva",
    },
    {
      header: "Alojamiento",
      accessorKey: "alojamiento.titulo",
      cell: (info) => {
        return info.getValue().substring(0, 20) + "...";
      },
    },
    {
      header: "Propietario",
      accessorKey: "propietario_nombre",
    },
    {
      header: "Arrendatario",
      accessorKey: "arrendatario_nombre",
    },
    {
      header: "Centro Poblado",
      accessorKey: "alojamiento.centro_poblado.nombre",
    },
    {
      header: "Fecha de inicio",
      accessorKey: "fecha_inicio",
    },
    {
      header: "Fecha de fin",
      accessorKey: "fecha_fin",
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
      header: "Valor cancelado",
      accessorKey: "valor_cancelado",
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
      header: "Personas",
      accessorKey: "numero_personas",
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
      header: "Mascotas",
      accessorKey: "incluye_mascotas",
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
      <SimpleTable
        data={reservas}
        columns={columns}
        name="Reservas"
        id="id_reserva"
        getForm={"/reservas/form/"}
        filters={filters}
        notAllowCreate={notAllowCreate}
        notAllowUpdate={notAllowUpdate}
        notAllowDelete={notAllowDelete}
      />
    </div>
  );
};

export default Reservas;
