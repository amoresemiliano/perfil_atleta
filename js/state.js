// API Base URL (Para desarrollo local usar ruta relativa, para prod la URL real)
const API_URL = "./api";

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

    return true;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    // Fallback a los datos MOCK si falla la BD (útil mientras no subas la BD a BlueHost)
    generateMockData();
    return false;
  }
}

// APIs Helper Functions para CRUD
export const API = {
  async addUser(userObj) {
    const res = await fetch(`${API_URL}/users.php`, {
      method: "POST",
      body: JSON.stringify(userObj),
    });
    return res.json();
  },
  async deleteUser(id) {
    const res = await fetch(`${API_URL}/users.php?id=${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
  async addConnection(coachId, athleteId) {
    const res = await fetch(`${API_URL}/connections.php`, {
      method: "POST",
      body: JSON.stringify({ coachId, athleteId }),
    });
    return res.json();
  },
  async deleteConnection(id) {
    const res = await fetch(`${API_URL}/connections.php?id=${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
  async addSport(sportObj) {
    const res = await fetch(`${API_URL}/sports.php`, {
      method: "POST",
      body: JSON.stringify(sportObj),
    });
    return res.json();
  },
  async saveActivity(actObj) {
    const res = await fetch(`${API_URL}/activities.php`, {
      method: "POST",
      body: JSON.stringify(actObj),
    });
    return res.json();
  },
  async updateActivityStatus(actObj) {
    const res = await fetch(`${API_URL}/activities.php`, {
      method: "PUT",
      body: JSON.stringify(actObj),
    });
    return res.json();
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
