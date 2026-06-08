// API Base URL (Para desarrollo local usar ruta relativa, para prod la URL real)
const API_URL = "./api";
let isMockMode = false;

export const state = {
  currentUser: null,
  users: [],
  sports: [],
  connections: [],
  activities: [],
};

// Cargar estado inicial desde MySQL vía PHP
export async function loadInitialState() {
  try {
    const [usersRes, sportsRes, connRes, actRes] = await Promise.all([
      fetch(`${API_URL}/users.php`),
      fetch(`${API_URL}/sports.php`),
      fetch(`${API_URL}/connections.php`),
      fetch(`${API_URL}/activities.php`),
    ]);

    if (!usersRes.ok) throw new Error("Network response was not ok");

    state.users = await usersRes.json();
    state.sports = await sportsRes.json();

    // Mapeo JS friendly de connections
    const dbConn = await connRes.json();
    state.connections = dbConn.map((c) => ({
      id: c.id,
      coachId: c.coach_id,
      athleteId: c.athlete_id,
    }));

    state.activities = await actRes.json();
    isMockMode = false;
    return true;
  } catch (error) {
    console.error("Error al conectar con la BD. Activando MOCK MODE:", error);
    alert("ADVERTENCIA DE BASE DE DATOS: No se pudo conectar al servidor PHP/MySQL. \n\nLa aplicación está funcionando en MODO DE PRUEBA (Memoria Local). Los cambios que hagas se perderán al recargar la página.\n\nPor favor, verifica tus credenciales en el archivo .env de BlueHost.");
    isMockMode = true;
    generateMockData();
    return false;
  }
}

// Wrapper para llamadas seguras a la BD
async function safeFetch(url, options = {}) {
  if (isMockMode) {
    // Si estamos en mock mode, simulamos éxito y no llamamos a PHP
    return { status: "success_mock", id: Date.now() };
  }
  try {
    const res = await fetch(url, options);
    return await res.json();
  } catch (error) {
    console.error(`API Error en ${url}:`, error);
    // Para que la UI no se rompa si falla la llamada
    return { error: true, message: error.message };
  }
}

// APIs Helper Functions para CRUD
export const API = {
  async addUser(userObj) {
    return safeFetch(`${API_URL}/users.php`, {
      method: "POST",
      body: JSON.stringify(userObj),
    });
  },
  async deleteUser(id) {
    return safeFetch(`${API_URL}/users.php?id=${id}`, {
      method: "DELETE",
    });
  },
  async addConnection(coachId, athleteId) {
    return safeFetch(`${API_URL}/connections.php`, {
      method: "POST",
      body: JSON.stringify({ coachId, athleteId }),
    });
  },
  async deleteConnection(id) {
    return safeFetch(`${API_URL}/connections.php?id=${id}`, {
      method: "DELETE",
    });
  },
  async addSport(sportObj) {
    return safeFetch(`${API_URL}/sports.php`, {
      method: "POST",
      body: JSON.stringify(sportObj),
    });
  },
  async saveActivity(actObj) {
    return safeFetch(`${API_URL}/activities.php`, {
      method: "POST",
      body: JSON.stringify(actObj),
    });
  },
  async updateActivityStatus(actObj) {
    return safeFetch(`${API_URL}/activities.php`, {
      method: "PUT",
      body: JSON.stringify(actObj),
    });
  },
};

function generateMockData() {
  console.warn("CARGANDO DATOS MOCK EN MEMORIA (Base de datos no encontrada)");
  state.users = [
    {
      id: "admin1",
      role: "admin",
      email: "vegendigital@gmail.com",
      name: "Super Admin",
      img: "https://i.pravatar.cc/150?u=admin",
    },
    {
      id: "athlete1",
      role: "athlete",
      email: "atleta@test.com",
      name: "Martín Pérez",
      roleDesc: "Deportista Elite",
      img: "https://i.pravatar.cc/150?u=athlete",
    },
    {
      id: "coach1",
      role: "coach",
      email: "coach1@test.com",
      name: "Profe Sebastián",
      roleDesc: "Head Coach",
      img: "https://i.pravatar.cc/150?u=coach",
    },
  ];
  state.sports = [{ id: "running", name: "Running", icon: "fa-running" }];
  state.connections = [{ id: 1, coachId: "coach1", athleteId: "athlete1" }];
  state.activities = [];
}
