export const fetchApi = async (route, body, headers) => {
  try {
    const response = await fetch("http://localhost:4000" + route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al consumir la API:", error);
  }
};

export const fetchApiPut = async (route, body, headers) => {
  try {
    const response = await fetch("http://localhost:4000" + route, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al consumir la API:", error);
  }
};

export const fetchApiGet = async (route, headers) => {
  try {
    const response = await fetch("http://localhost:4000" + route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al consumir la API:", error);
  }
};
