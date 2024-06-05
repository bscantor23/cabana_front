import React, { useState, useEffect, createContext } from "react";
import { fetchApi } from "./fetch-api";

export const AlojamientoContext = createContext();

const AlojamientoContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  if (localStorage.getItem("session") && !session) {
    setSession(JSON.parse(localStorage.getItem("session")));
  }

  const [cupoPersona, setCupoPersona] = useState(0);
  const [numeroHabitaciones, setNumeroHabitaciones] = useState(0);
  const [valorHospedaje, setValorHospedaje] = useState(0);

  const [isCasaChecked, setIsCasaChecked] = useState(true);
  const [isCabanaChecked, setIsCabanaChecked] = useState(true);

  const [isPropietarioChecked, setIsPropietarioChecked] = useState(true);
  const [isArrendatarioChecked, setIsArrendatarioChecked] = useState(false);

  const [messageModal, setMessageModal] = useState(false);

  const [alojamientos, setAlojamientos] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

  const [tipoAlojamiento, setTipoAlojamiento] = useState({
    id_tipo_alojamiento: 0,
    nombre: "Tipos de Alojamientos (todos)",
  });

  const [departamento, setDepartamento] = useState({
    id_departamento: 0,
    nombre: "Departamentos (todos)",
  });

  const [ciudad, setCiudad] = useState({
    id_ciudad: 0,
    nombre: "Ciudades (todos)",
  });

  const [centroPoblado, setCentroPoblado] = useState({
    id_centro_poblado: 0,
    nombre: "Centros Poblados (todos)",
  });

  const [tiposAlojamientos, setTiposAlojamientos] = useState([tipoAlojamiento]);
  const [departamentos, setDepartamentos] = useState([departamento]);
  const [ciudades, setCiudades] = useState([ciudad]);
  const [centrosPoblados, setCentrosPoblados] = useState([centroPoblado]);

  const fetchAlojamientos = async () => {
    try {
      const alojamientosData = await fetchApi("/alojamientos/search");
      setAlojamientos([...alojamientosData]);
      await setTimeout(() => {
        return setLoading(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSearchAlojamientos = async () => {
    try {
      let where = {};
      if (departamento.id_departamento !== 0) {
        where.centro_poblado = {
          ciudad: {
            id_departamento: departamento.id_departamento,
          },
        };
      }

      if (ciudad.id_ciudad !== 0) {
        where.centro_poblado = {
          id_ciudad: ciudad.id_ciudad,
        };
      }

      if (centroPoblado.id_centro_poblado !== 0) {
        where.centro_poblado = {
          id_centro_poblado: centroPoblado.id_centro_poblado,
        };
      }

      if (cupoPersona !== 0) {
        where.cupo_persona = Number(cupoPersona);
      }

      if (numeroHabitaciones !== 0) {
        where.numero_habitaciones = Number(numeroHabitaciones);
      }

      if (valorHospedaje !== 0) {
        where.valor_hospedaje = {
          lte: Number(valorHospedaje),
        };
      }

      if (isCasaChecked || isCabanaChecked) {
        where.tipo_alojamiento = {
          OR: [],
        };

        if (isCasaChecked) {
          where.tipo_alojamiento.OR.push({
            nombre: "Casa",
          });
        }

        if (isCabanaChecked) {
          where.tipo_alojamiento.OR.push({
            nombre: "Cabaña",
          });
        }
      }

      const alojamientosData = await fetchApi("/alojamientos/search", {
        where,
      });
      setAlojamientos([...alojamientosData]);

      await setTimeout(() => {
        return setLoading(false);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const departamentosData = await fetchApi("/general/departamentos");
      setDepartamentos([departamentos[0], ...departamentosData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCiudades = async (id_departamento) => {
    try {
      const ciudadesData = await fetchApi("/general/ciudades", {
        where: {
          id_departamento,
        },
      });
      setCiudades([ciudades[0], ...ciudadesData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTemporadas = async (id_temporada) => {
    try {
      const temporadasData = await fetchApi("/general/temporadas", {});
      setTemporadas([...temporadasData]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCentrosPoblados = async (id_ciudad) => {
    try {
      const centrosPobladosData = await fetchApi("/general/centros-poblados", {
        where: {
          id_ciudad,
        },
      });
      setCentrosPoblados([centrosPoblados[0], ...centrosPobladosData]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAlojamientos();
    fetchDepartamentos();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    fetchSearchAlojamientos();
  };

  return (
    <AlojamientoContext.Provider
      value={{
        alojamientos,
        setTipoAlojamiento,
        tipoAlojamiento,
        tiposAlojamientos,
        setDepartamento,
        departamento,
        departamentos,
        setCiudad,
        ciudad,
        ciudades,
        temporadas,
        setCentroPoblado,
        centroPoblado,
        centrosPoblados,
        loading,
        handleClick,
        fetchCiudades,
        fetchCentrosPoblados,
        fetchTemporadas,
        setCupoPersona,
        setNumeroHabitaciones,
        setValorHospedaje,
        setIsCasaChecked,
        isCasaChecked,
        setIsCabanaChecked,
        isCabanaChecked,
        setIsPropietarioChecked,
        isPropietarioChecked,
        setIsArrendatarioChecked,
        isArrendatarioChecked,
        session,
        setSession,
        setMessageModal,
        messageModal,
      }}
    >
      {children}
    </AlojamientoContext.Provider>
  );
};

export default AlojamientoContextProvider;
