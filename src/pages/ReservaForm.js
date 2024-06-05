import { fetchApi, fetchApiGet } from "../cases/fetch-api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import SimpleTable from "../components/SimpleTable";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import React, { useState } from "react";
import ModalEncuesta from "../components/ModalEncuesta";
import { HiOutlinePencilAlt, HiOutlineStar } from "react-icons/hi";

const ReservaForm = ({ methodForm }) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const { setMessageModal, session } = useContext(AlojamientoContext);
  const [pagos, setPagos] = useState([]);
  const [reserva, setReserva] = useState(null);

  const [openEncuesta, setOpenEncuesta] = useState(false);

  const [tiposPagos, setTiposPagos] = useState([]);
  const [tipoPago, setTipoPago] = useState(1);
  const [valorCancelado, setValorCancelado] = useState(0);

  const [calificacion, setCalificacion] = useState(1);
  const [comentario, setComentario] = useState("");

  const fetchReserva = async () => {
    try {
      console.log("buscar");
      let reservaData = await fetchApiGet("/reservas/" + id, {
        Authorization: `Bearer ${session.accessToken}`,
      });

      setReserva(reservaData);

      setValorCancelado(
        Number(reservaData.valor_hospedaje - reservaData.valor_cancelado)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPagos = async () => {
    try {
      console.log("hola?");
      let pagosData = await fetchApi(
        "/pagos/search",
        {
          where: {
            id_reserva: Number(id),
          },
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      setPagos([...pagosData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTiposPagos = async (id_tipo_pago) => {
    try {
      const tiposPagosData = await fetchApi("/general/tipos-pagos", {});
      setTiposPagos([...tiposPagosData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCreate = async () => {
    try {
      const registerData = await fetchApi(
        "/pagos/",
        {
          id_reserva: Number(id),
          id_tipo_pago: Number(tipoPago),
          fecha_historico: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          valor_cancelado: valorCancelado,
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      if (registerData.statusCode === 400) {
        if (registerData.message == "ReservaAlreadyPaid") {
          setMessageModal("La reserva ya ha sido pagada");
        }
        if (registerData.message == "ValorCanceladoExceeds") {
          setMessageModal("El pago excede el valor de la reserva");
        } else {
          setMessageModal("Problema en el servidor, contacte a soporte");
        }
        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        fetchPagos();
        fetchReserva();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEncuestaCreate = async () => {
    try {
      const registerData = await fetchApi(
        "/reservas/survey/" + id,
        {
          calificacion: Number(calificacion),
          comentario,
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      if (registerData.statusCode === 400) {
        if (registerData.message == "EncuestaAlreadyExists") {
          setMessageModal("La encuesta ya ha sido realizada");
        } else {
          setMessageModal("Problema en el servidor, contacte a soporte");
        }
        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        navigate("/reservas");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      header: "Identificador",
      accessorKey: "id_pago_reserva",
    },
    {
      header: "Tipo pago",
      accessorKey: "tipo_pago.nombre",
    },
    {
      header: "Fecha histórico",
      accessorKey: "fecha_historico",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      header: "Valor cancelado",
      accessorKey: "valor_cancelado",
      cell: (info) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(info.getValue()));
      },
    },
    {
      header: "Fecha creación",
      accessorKey: "fecha_creacion",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchCreate();
  };

  const handleSubmitEncuesta = (event) => {
    event.preventDefault();
    fetchEncuestaCreate();
  };

  useEffect(() => {
    fetchReserva();
    fetchPagos();
    fetchTiposPagos();
  }, []);

  return (
    <div className="container-fluid flex w-full items-start">
      <ModalEncuesta open={openEncuesta} onClose={() => setOpenEncuesta(false)}>
        <form onSubmit={handleSubmitEncuesta}>
          <div className="text-center w-[400px] h-[300px]">
            <div className="mx-auto my-4">
              <h3 className="text-lg font-black text-gray-800">
                Encuesta de satisfacción
              </h3>
            </div>
            <textarea
              placeholder="Comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full h-24 p-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
            />
            <div className="flex flex-row justify-center">
              <label className="self-center mx-2">Calificación</label>
              <AiOutlineStar className="self-center text-3xl mx-2" />
              <input
                type="number"
                placeholder="Calificación"
                name="calificacion"
                max={5}
                min={1}
                required
                value={calificacion}
                onChange={(e) => setCalificacion(Number(e.target.value))}
                className="text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>

            <button
              className=" py-4 rounded bg-pink-500 text-white w-full"
              onClick={() => setOpenEncuesta(false)}
            >
              Confirmar
            </button>
          </div>
        </form>
      </ModalEncuesta>

      <div className="relative w-full h-full flex flex-col">
        <SimpleTable
          data={pagos}
          columns={columns}
          name="Pagos"
          id="id_pago"
          notAllowCreate={true}
          notAllowDelete={true}
          notAllowUpdate={true}
          createForm={"/pagos/form"}
          getForm={"/pagos/form/"}
          updateForm={"/pagos/update/"}
          noActions={true}
        />
      </div>

      <div className="w-1/2 w-full h-full bg-[#f5f5f5 ] flex items-center p-10">
        <div className="w-full flex flex-col max-w-[700px]">
          <h1 className="text-4xl flex flex-col justify-center h-100 my-5 text-slate-700">
            Cabana
          </h1>
          <hr className="my-5" />

          <div className="w-full flex flex-col mb-2">
            <h1 className="text-2xl font-semibold mb-4">Crear pago</h1>
            <p className="text-2xl font-semibold text-pink-500 mb-4">
              Reserva:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(reserva?.valor_hospedaje))}{" "}
              -{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(reserva?.valor_cancelado))}
            </p>

            {reserva?.valor_hospedaje === reserva?.valor_cancelado && (
              <button
                type="button"
                className=" mx-2
                  hover:bg-pink-800 transition
                  bg-pink-600 font-semibold my-2 text-white rounded-md p-4 text-center flex items-center justify-center"
                onClick={() => setOpenEncuesta(true)}
              >
                <AiFillStar className="text-white text-3xl mx-2" />
                Calificar
                <AiFillStar className="text-white text-3xl mx-2" />
              </button>
            )}
            <hr className="my-5" />

            <p className="text-base  mb-2">Por favor ingrese los datos.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="w-full h-full flex flex-row justify-center gap-3">
              <div className="flex w-full flex-row self-center">
                <label className="self-center font-semibold pr-2">
                  <HiOutlineCurrencyDollar className="flex-auto text-3xl mx-2 text-gray-400" />
                </label>
                <select
                  required
                  value={tipoPago}
                  onChange={(e) => {
                    setTipoPago(Number(e.target.value));
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                >
                  <option>Tipo de pago</option>
                  {tiposPagos.map((tipoPago) => (
                    <option
                      key={tipoPago.id_tipo_pago}
                      value={tipoPago.id_tipo_pago}
                    >
                      {tipoPago.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full h-full flex flex-row justify-center gap-3">
              <div className="flex w-full flex-row self-center">
                <label className="flex flex-col align-middle pr-2">
                  <HiOutlineCurrencyDollar className="flex-auto text-3xl mx-2 text-gray-400" />
                </label>
                <input
                  type="number"
                  placeholder="Valor cancelado"
                  name="valor_cancelado"
                  required
                  value={valorCancelado}
                  onChange={(e) => {
                    setValorCancelado(e.target.value);
                  }}
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full flex flex-row justify-center my-4">
              <button
                type="submit"
                className="w-full mx-2
            
           hover:bg-pink-800 transition
            bg-pink-600 font-semibold my-2 text-white rounded-md p-4 text-center flex items-center justify-center"
              >
                Crear
              </button>
              <Link
                to="/reservas"
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

export default ReservaForm;
