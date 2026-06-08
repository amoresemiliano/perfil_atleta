import { state } from "./state.js";
import { renderHeader, renderBottomNav, navigateTo } from "./ui.js";
import { renderAthleteHome } from "./athlete.js";
import { renderCoachPlan } from "./coach.js";
import { renderAdminDashboard } from "./admin.js";

export function login(role, email = null) {
  let user = null;

  // Admin siempre loguea directo por ahora
  if (role === "admin" || email === "vegendigital@gmail.com") {
    user = state.users.find((u) => u.role === "admin");
  }

  if (!user) return;
  loginUserObj(user);
}

export function loginById(id) {
  const user = state.users.find((u) => u.id === id);
  if (user) loginUserObj(user);
}

function loginUserObj(user) {
  state.currentUser = user;

  // 1. Quitar cuadro de login
  document.getElementById("view-login").classList.add("hidden");
  document.getElementById("view-login").classList.remove("active");

  // 2. Mostrar Header
  renderHeader();

  // 3. Nav Inferior y Navegar
  renderBottomNav(user.role);

  if (user.role === "athlete") {
    navigateTo("view-athlete-home");
  } else if (user.role === "coach") {
    navigateTo("view-coach-plan");
  } else if (user.role === "admin") {
    navigateTo("view-admin");
  }
}

export function logout() {
  state.currentUser = null;
  document.getElementById("app-header").classList.add("hidden");
  document.getElementById("bottom-nav").classList.add("hidden");
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));

  document.getElementById("view-login").classList.remove("hidden");
  document.getElementById("view-login").classList.add("active");
}
