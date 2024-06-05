import React from "react";

import { useParams } from "react-router-dom";
import { BiBed, BiBath } from "react-icons/bi";
import { useContext } from "react";
import { AlojamientoContext } from "../cases/AlojamientoContext";
import { MdPets } from "react-icons/md";
import { TiWeatherSunny } from "react-icons/ti";
import { SlPeople } from "react-icons/sl";
import { ImSpinner2 } from "react-icons/im";
import "rsuite/dist/rsuite-no-reset.min.css";
import "../styles.css";
import { DatePicker } from "rsuite";
import { InputGroup } from "rsuite";
import { useEffect } from "react";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdBookmarks } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { useState } from "react";
import { FaMapPin } from "react-icons/fa6";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useNavigate } from "react-router-dom";
import { fetchApiGet } from "../cases/fetch-api";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { fetchApi } from "../cases/fetch-api";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

const Alojamiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, setMessageModal, session, temporadas, fetchTemporadas } =
    useContext(AlojamientoContext);

  const [alojamiento, setAlojamiento] = useState(null);
  const [images, setImages] = useState([]);
  const [encuestas, setEncuestas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [comentarios, setComentarios] = useState(0);
  const [satisfechos, setSatisfechos] = useState(0);

  const [cupoPersonas, setCupoPersonas] = useState(1);
  const [incluyeMascotas, setIncluyeMascotas] = useState(false);

  const [temporadaBaja, setTemporadaBaja] = useState({
    valor: 0,
    dias: 0,
  });
  const [temporadaAlta, setTemporadaAlta] = useState({
    valor: 0,
    dias: 0,
  });
  const [totalAPagar, setTotalAPagar] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const calculateBooking = (startDate, endDate, valorHospedaje) => {
    setTimeout(() => {
      valorHospedaje = Number(valorHospedaje);

      let start = dayjs.utc(dayjs.utc(startDate).format("YYYY-MM-DD"));
      let end = dayjs.utc(dayjs.utc(endDate).format("YYYY-MM-DD"));

      let temporadaBaja = 0;
      let temporadaBajaDias = 0;

      let temporadaAlta = 0;
      let temporadaAltaDias = 0;

      let totalAPagar = 0;

      for (let day = start; day.isSameOrBefore(end); day = day.add(1, "day")) {
        let temporada = temporadas.find((temporada) => {
          let fechaInicio = dayjs.utc(
            dayjs.utc(temporada.fecha_inicio).format("YYYY-MM-DD")
          );
          let fechaFin = dayjs.utc(
            dayjs.utc(temporada.fecha_fin).format("YYYY-MM-DD")
          );

          return day.isSameOrAfter(fechaInicio) && day.isSameOrBefore(fechaFin);
        });

        if (temporada) {
          temporadaAlta += Number(valorHospedaje) * 1.3;
          temporadaAltaDias += 1;
          totalAPagar += Number(valorHospedaje) * 1.3;
        } else {
          temporadaBaja += Number(valorHospedaje) * 1.1;
          temporadaBajaDias += 1;
          totalAPagar += Number(valorHospedaje) * 1.1;
        }
      }

      setTemporadaBaja({
        valor: temporadaBaja,
        dias: temporadaBajaDias,
      });

      setTemporadaAlta({
        valor: temporadaAlta,
        dias: temporadaAltaDias,
      });

      setTotalAPagar(totalAPagar);
    }, 1000);
  };

  const markDates = (endDateMark) => {
    const start = dayjs(startDate);
    let end = dayjs(endDateMark instanceof Date ? endDateMark : endDate);

    for (let day = start; day.isSameOrBefore(end); day = day.add(1, "day")) {
      const elements = document.querySelectorAll(
        `[aria-label="${day.format("DD MMM YYYY")}"]`
      );
      elements.forEach((element) => {
        element.classList.add("rs-calendar-table-cell-selected");
      });
    }
  };

  const controlMonth = () => {
    markDatesMonths();
  };

  const markDatesMonths = () => {
    setTimeout(() => {
      const start = dayjs(startDate);
      let end = dayjs(endDate);

      for (let day = start; day.isSameOrBefore(end); day = day.add(1, "day")) {
        const elements = document.querySelectorAll(
          `[aria-label="${day.format("DD MMM YYYY")}"]`
        );
        elements.forEach((element) => {
          element.classList.add("rs-calendar-table-cell-selected");
        });
      }
    }, 100);
  };

  const holidays = (date) => {
    const day = date.getDate();
    let dateHoliday = dayjs.utc(date).format("YYYY-MM-DD");
    let startDateCalendar = dayjs
      .utc(startDate)
      .subtract(1, "day")
      .format("YYYY-MM-DD");

    if (dayjs(dateHoliday).isSame(dayjs(startDateCalendar))) {
      return (
        <div className="flex flex-col justify-center">
          <span className="block self-center">{day}</span>
          <span className="self-center">
            <FaMapPin className="text-pink-400" />
          </span>
        </div>
      );
    }

    if (alojamiento.reservas) {
      for (let reserva of alojamiento.reservas) {
        let fechaInicio = dayjs.utc(reserva.fecha_inicio).format("YYYY-MM-DD");
        let fechaFin = dayjs.utc(reserva.fecha_fin).format("YYYY-MM-DD");
        if (
          dayjs(dateHoliday).isSameOrAfter(fechaInicio) &&
          dayjs(dateHoliday).isSameOrBefore(fechaFin)
        ) {
          return (
            <div className="flex flex-col justify-center">
              <span className="block self-center">{day}</span>
              <span className="self-center">
                <MdBookmarks className="text-pink-400" />
              </span>
            </div>
          );
        }
      }
    }

    if (temporadas) {
      for (let temporada of temporadas) {
        let fechaInicio = dayjs
          .utc(temporada.fecha_inicio)
          .format("YYYY-MM-DD");
        let fechaFin = dayjs.utc(temporada.fecha_fin).format("YYYY-MM-DD");
        if (
          dayjs(dateHoliday).isSameOrAfter(fechaInicio) &&
          dayjs(dateHoliday).isSameOrBefore(fechaFin)
        ) {
          return (
            <div className="flex flex-col justify-center">
              <span className="block self-center">{day}</span>
              <span className="self-center">
                <FaUmbrellaBeach className="text-pink-400" />
              </span>
            </div>
          );
        }
      }
    }

    return (
      <div className="flex flex-col justify-center">
        <span className="block self-center">{day}</span>
        <span className="self-center">
          <TbPointFilled />
        </span>
      </div>
    );
  };

  const bookeds = (date) => {
    let dateHoliday = dayjs.utc(date).format("YYYY-MM-DD");

    if (dayjs.utc(dateHoliday).isBefore(dayjs().format("YYYY-MM-DD"))) {
      return true;
    }

    if (alojamiento.reservas) {
      for (let reserva of alojamiento.reservas) {
        let fechaInicio = dayjs.utc(reserva.fecha_inicio).format("YYYY-MM-DD");
        let fechaFin = dayjs.utc(reserva.fecha_fin).format("YYYY-MM-DD");
        if (
          dayjs.utc(dateHoliday).isSameOrAfter(fechaInicio) &&
          dayjs.utc(dateHoliday).isSameOrBefore(fechaFin)
        ) {
          return true;
        }
      }
    }
  };

  const secondBookeds = (date) => {
    let dateHoliday = dayjs.utc(date).format("YYYY-MM-DD");

    if (dayjs(dateHoliday).isBefore(dayjs(startDate).format("YYYY-MM-DD"))) {
      return true;
    }

    if (alojamiento.reservas) {
      for (let reserva of alojamiento.reservas) {
        let fechaInicio = dayjs.utc(reserva.fecha_inicio).format("YYYY-MM-DD");
        let fechaFin = dayjs.utc(reserva.fecha_fin).format("YYYY-MM-DD");
        if (
          dayjs(dateHoliday).isSameOrAfter(fechaInicio) &&
          dayjs(dateHoliday).isSameOrBefore(fechaFin)
        ) {
          return true;
        }
      }
    }
  };

  const fetchAlojamiento = async (id) => {
    try {
      const alojamientoData = await fetchApiGet("/alojamientos/" + id);
      setAlojamiento(alojamientoData);

      let imagesData = [];
      let encuestasData = [];
      let promedioData = 0;
      let comentariosData = 0;
      let satisfechosData = 0;

      alojamientoData.fotografias.forEach((foto) => {
        imagesData.push({ original: foto.uri, thumbnail: foto.uri });
      });

      alojamientoData.reservas.forEach((reserva) => {
        if (reserva.encuesta) {
          encuestasData.push({
            id_encuesta: reserva.id_encuesta,
            fecha: dayjs.utc(reserva.fecha_creacion).format("YYYY-MM-DD"),
            calificacion: reserva.calificacion,
            comentario: reserva.comentario,
          });

          promedioData += reserva.encuesta.calificacion;
          comentariosData += 1;
          if (Number(reserva.encuesta.calificacion) >= 4) {
            satisfechosData += 1;
          }
        }
      });

      if (encuestasData.length > 0) {
        promedioData = promedioData / encuestasData.length;
      }

      setImages(imagesData);
      setEncuestas(encuestasData);
      setPromedio(promedioData.toFixed(1));
      setComentarios(comentariosData);
      setSatisfechos(satisfechosData);

      calculateBooking(new Date(), new Date(), alojamientoData.valor_hospedaje);
    } catch (err) {
      console.log(err);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchAlojamiento(id);
    fetchTemporadas();
  }, []);

  const fetchReserva = async () => {
    try {
      const registerData = await fetchApi(
        "/reservas/",
        {
          fecha_inicio: dayjs.utc(startDate).format("YYYY-MM-DD"),
          fecha_fin: dayjs.utc(endDate).format("YYYY-MM-DD"),
          id_alojamiento: alojamiento.id_alojamiento,
          incluye_mascotas: incluyeMascotas,
          numero_personas: cupoPersonas,
        },
        {
          Authorization: `Bearer ${session.accessToken}`,
        }
      );

      if (registerData.statusCode === 400) {
        if (registerData.message == "ArrendatarioIsOwner") {
          setMessageModal(
            "Petición fallida, el arrendatario no puede reservar su propio alojamiento"
          );
        } if(registerData.message == "ReservaAlreadyExists"){
          setMessageModal(
            "Petición fallida, ya existe una reserva en las fechas seleccionadas"
          );
        } else {
          setMessageModal(
            "Petición fallida, contacte a soporte para continuar"
          );
        }

        document.getElementById("popup-modal").classList.remove("hidden");
      } else {
        navigate("/reservas");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (session.user.id_rol === 1) {
      setMessageModal("Permiso denegado, no puedes reservar alojamientos");
      document.getElementById("popup-modal").classList.remove("hidden");
    }
    fetchReserva();
  };

  return (
    <section>
      {!alojamiento && (
        <ImSpinner2 className="mx-auto animate-spin text-pink-700 text-4x1 mt-[200px]"></ImSpinner2>
      )}
      {alojamiento && (
        <div className="container-fluid mx-20 min-h-[800px] mb-14 mt-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="w-1/3">
              <h2 className="text-2xl font-semibold">{alojamiento.titulo}</h2>
              <h3 className="text-lg mb-4">{alojamiento.direccion_fisica}</h3>
            </div>
            <div className="w-1/3 text-3xl text-end font-semibold text-pink-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(alojamiento.valor_hospedaje))}
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row w-full">
            <div className="md:min-w-[800px] max-w-[800px]">
              <div className="mb-8">
                <ImageGallery
                  className="mb-8"
                  items={images}
                  autoPlay
                  slideDuration={1000}
                  slideInterval={5000}
                />
              </div>
              <div className="mb-4 flex flex-wrap justify-start text-sm gap-3">
                <span className="bg-green-500 rounded-full text-white px-3">
                  {alojamiento.tipo_alojamiento.nombre}
                </span>
                <span className=" bg-orange-500 rounded-full text-white px-3">
                  {alojamiento.centro_poblado.ciudad.departamento.nombre}
                </span>
                <span className=" bg-violet-500 rounded-full text-white px-3">
                  {alojamiento.centro_poblado.ciudad.nombre}
                </span>
                <span className=" bg-blue-500 rounded-full text-white px-3">
                  {alojamiento.centro_poblado.nombre}
                </span>
              </div>
              <div className="flex gap-x-4 my-4">
                <div className="flex items-center text-gray-600 gap-1">
                  <div className="text-[20px]">
                    <SlPeople />
                  </div>
                  <div>{alojamiento.cupo_persona}</div>
                </div>
                <div className="flex items-center text-gray-600 gap-1">
                  <div className="text-[20px]">
                    <BiBed />
                  </div>
                  <div>{alojamiento.numero_habitaciones}</div>
                </div>
                <div className="flex items-center text-gray-600 gap-1">
                  <div className="text-[20px]">
                    <BiBath />
                  </div>
                  <div>{alojamiento.numero_banos}</div>
                </div>
                <div className="flex items-center text-gray-600 gap-1">
                  <div className="text-[20px]">
                    <MdPets
                      className={
                        alojamiento.permite_mascotas ? "text-pink-600" : ""
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center text-gray-600 gap-1">
                  <div className="text-[20px]">
                    <TiWeatherSunny
                      className={
                        alojamiento.tiene_calefaccion ? "text-pink-600" : ""
                      }
                    />
                  </div>
                </div>
              </div>
              <div>{alojamiento.descripcion}</div>
              <hr className="my-5" />
              <div className="mt-8 w-full flex-column">
                <h4 className="text-lg font-semibold mb-4 text-center">
                  Información de Satisfacción
                </h4>
                <div className="grid md:grid-cols-3">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold">{comentarios}</span>
                    <span className="text-sm">Comentarios</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold">{promedio}</span>
                    <span className="text-sm">Promedio acumulado</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold">{satisfechos}</span>
                    <span className="text-sm">Clientes satisfechos</span>
                  </div>
                </div>
              </div>
              <hr className="my-5" />
              <div className="w-full">
                <h4 className="text-lg font-semibold mb-4">Calificaciones</h4>
                {encuestas.length === 0 && (
                  <div className="text-center">
                    "No se encuentran calificaciones registradas"
                  </div>
                )}

                {alojamiento.reservas.map((reserva) => {
                  return (
                    reserva.encuesta && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center text-pink-600 font-semibold">
                          <span className="mr-5">
                            {reserva.arrendatario.primer_nombre +
                              " " +
                              reserva.arrendatario.primer_apellido}
                          </span>
                          {Array.from({ length: 5 }, (_, index) => (
                            <span key={index}>
                              {index < reserva.encuesta.calificacion ? (
                                <AiFillStar className="text-pink-600" />
                              ) : (
                                <AiOutlineStar />
                              )}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center">
                          {reserva.encuesta.comentario}
                        </div>
                        <hr className="my-5" />
                      </div>
                    )
                  );
                })}
              </div>
            </div>
            <div className="flex-1 bg-white w-full h-full mb-8 border border-gray-300 rounded-lg px-6 py-6 ">
              <div className="flex items-center gap-x-4 mb-8">
                <div className="flex flex-row w-full justify-between">
                  <span className="font-bold text-lg">
                    {alojamiento.propietario.primer_nombre +
                      " " +
                      alojamiento.propietario.primer_apellido}
                  </span>
                  <div className="font-sm ml-5 flex flex-row">
                    <BsFillTelephoneFill className="mx-3 self-center" />

                    <span className="font-semibold self-center">
                      {" "}
                      {alojamiento.propietario.telefonos[0]?.telefono}
                    </span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                <InputGroup className="flex flex-row justify-between">
                  <DatePicker
                    id="DatePicker1"
                    className="w-full"
                    placeholder="Fecha inicio"
                    shouldDisableDate={bookeds}
                    block
                    renderCell={holidays}
                    showWeekNumbers
                    size="lg"
                    required
                    value={startDate}
                    appearance="subtle"
                    oneTap
                    onChange={(value) => {
                      setStartDate(value);
                      if (dayjs(value).isAfter(dayjs(endDate))) {
                        setEndDate(value);
                        calculateBooking(
                          value,
                          value,
                          alojamiento.valor_hospedaje
                        );
                      } else {
                        calculateBooking(
                          value,
                          endDate,
                          alojamiento.valor_hospedaje
                        );
                      }
                    }}
                  />
                  <InputGroup.Addon>to</InputGroup.Addon>
                  <DatePicker
                    id="DatePicker2"
                    className="w-full"
                    placeholder="Fecha fin"
                    shouldDisableDate={secondBookeds}
                    block
                    renderCell={holidays}
                    showWeekNumbers
                    size="lg"
                    required
                    value={endDate}
                    appearance="subtle"
                    onChange={(value) => {
                      setEndDate(value);
                      calculateBooking(
                        startDate,
                        value,
                        alojamiento.valor_hospedaje
                      );
                    }}
                    oneTap
                    onNextMonth={controlMonth}
                    onPrevMonth={controlMonth}
                    onEnter={markDates}
                  />
                </InputGroup>
                <hr />
                <div className="flex flex-row gap-3">
                  <label className="self-center font-semibold">
                    Arrendatario:{" "}
                  </label>
                  <input
                    className="border border-gray-300 focus:border-pink-700 outline-none rounded w-full px-4 h-14 text-sm"
                    type="text"
                    value={
                      session
                        ? session.user.primer_nombre +
                          " " +
                          session.user.segundo_nombre +
                          " " +
                          session.user.primer_apellido +
                          " " +
                          session.user.segundo_apellido
                        : ""
                    }
                    placeholder="Nombre completo"
                    disabled
                  ></input>
                </div>

                <div className="flex flex-row gap-3">
                  <label className="self-center font-semibold">
                    Identificación:{" "}
                  </label>
                  <input
                    className="border border-gray-300 focus:border-pink-700 outline-none rounded px-4 h-14 text-sm"
                    type="text"
                    value={session ? session.user.id_usuario : ""}
                    placeholder="Identificación"
                    disabled
                  ></input>
                  <label className="self-center font-semibold">
                    Teléfono:{" "}
                  </label>
                  <input
                    className="border border-gray-300 w-full focus:border-pink-700 outline-none rounded px-4 h-14 text-sm"
                    type="text"
                    value={session ? session.user.telefonos[0]?.telefono : ""}
                    placeholder="Teléfono"
                    disabled
                  ></input>
                </div>

                <div className="flex flex-row gap-3">
                  <label className="self-center font-semibold">
                    Cupo de Personas:
                  </label>

                  <input
                    className="border border-gray-300 focus:border-pink-700 outline-none rounded px-4 h-14 text-sm"
                    type="number"
                    name="cupo_personas"
                    onChange={(e) => {
                      setCupoPersonas(e.target.value);
                    }}
                    max={alojamiento.cupo_persona}
                    min={1}
                    value={cupoPersonas}
                    placeholder="Personas"
                  />
                  {alojamiento.permite_mascotas && (
                    <div className="flex flex-row gap-2 justify-start align-middle">
                      <input
                        className="form-checkbox text-pink-600 self-center"
                        type="checkbox"
                        name="incluye_mascotas"
                        onChange={(e) => {
                          setIncluyeMascotas(e.target.value);
                        }}
                      ></input>
                      <span className="self-center">Incluye mascotas</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-x-2">
                  {session ? (
                    <button
                      type="submit"
                      className="bg-pink-700 hover:bg-pink-800 text-white rounded p-4 text-sm w-full transition"
                    >
                      ¡Reserva ya!
                    </button>
                  ) : (
                    <Link
                      to={`/login`}
                      className="bg-pink-700 text-center hover:bg-pink-800 text-white rounded p-4 text-sm w-full transition"
                    >
                      Inicia sesión
                    </Link>
                  )}
                </div>
                <hr />
                <div className="flex flex-col gap-2 mt-4">
                  <div className="grid md:grid-cols-3 justify-between">
                    <span className="w-full">Temporada Baja: +10%</span>
                    <span className="flex justify-end">
                      {temporadaBaja.dias} días
                    </span>
                    <span className="flex justify-end">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        alojamiento.valor_hospedaje * temporadaBaja.dias
                      )}
                    </span>
                  </div>
                  <span className="flex text-sm justify-end">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      alojamiento.valor_hospedaje * 0.1 * temporadaBaja.dias
                    )}
                  </span>
                  <hr />
                  <div className="grid md:grid-cols-3 justify-between">
                    <span>Temporada Alta: +30%</span>
                    <span className="flex justify-end">
                      {temporadaAlta.dias} días
                    </span>
                    <span className="flex justify-end">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        alojamiento.valor_hospedaje * temporadaAlta.dias
                      )}
                    </span>
                  </div>

                  <span className="flex text-sm justify-end">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      alojamiento.valor_hospedaje * 0.3 * temporadaAlta.dias
                    )}
                  </span>

                  <hr />
                  <div className="grid md:grid-cols-3 justify-between">
                    <span>Número de personas: </span>
                    <span className="flex justify-end">
                      {cupoPersonas} personas
                    </span>
                    <span className="flex justify-end">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(totalAPagar * cupoPersonas)}
                    </span>
                  </div>
                  <span className="flex text-sm justify-end">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalAPagar)}
                  </span>
                  <hr />
                  <div className="grid md:grid-cols-3 justify-between">
                    <span></span>
                    <span className="flex justify-end font-semibold">
                      Total a pagar:
                    </span>
                    <span className="flex justify-end font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(totalAPagar * cupoPersonas)}
                    </span>
                  </div>
                </div>
                <hr />
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Alojamiento;
