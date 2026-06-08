import { state } from "./state.js";
import { logout } from "./auth.js";
import {
  renderAthleteHome,
  renderMetrics,
  renderCommunity,
  renderProfile,
} from "./athlete.js";
import { renderCoachPlan, renderCoachStudents } from "./coach.js";
import { renderAdminDashboard } from "./admin.js";

export function setupUI() {
  // Configurar eventos globales (botones de login/logout que no están en el DOM dinámico)
  document
    .getElementById("btn-login-athlete")
    ?.addEventListener("click", () =>
      import("./auth.js").then((m) => m.login("athlete")),
    );
  document
    .getElementById("btn-login-coach")
    ?.addEventListener("click", () =>
      import("./auth.js").then((m) => m.login("coach")),
    );
  document
    .getElementById("btn-login-admin")
    ?.addEventListener("click", () =>
      import("./auth.js").then((m) => m.login("admin")),
    );
  document
    .getElementById("btn-logout")
    ?.addEventListener("click", () => logout());
}

export function renderHeader() {
  document.getElementById("app-header").classList.remove("hidden");
  const user = state.currentUser;

  document.getElementById("header-user-name").innerText = user.name;
  document.getElementById("header-user-role").innerText =
    user.roleDesc || user.role;
  document.getElementById("header-user-img").src = user.img;
}

export function renderBottomNav(role) {
  const nav = document.getElementById("bottom-nav");
  nav.classList.remove("hidden");
  nav.classList.add("flex");

  if (role === "athlete") {
    nav.className =
      "fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t flex justify-around py-4 z-50";
    nav.innerHTML = `
            <button data-target="view-athlete-home" class="nav-item active"><i class="fas fa-calendar-day"></i></button>
            <button data-target="view-metrics" class="nav-item"><i class="fas fa-chart-line"></i></button>
            <button data-target="view-community" class="nav-item"><i class="fas fa-users"></i></button>
            <button data-target="view-profile" class="nav-item"><i class="fas fa-id-card"></i></button>
        `;
  } else if (role === "coach") {
    nav.className =
      "fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around py-4 z-50 coach-nav";
    nav.innerHTML = `
            <button data-target="view-coach-plan" class="nav-item active"><i class="fas fa-pencil-alt"></i></button>
            <button data-target="view-coach-students" class="nav-item"><i class="fas fa-address-book"></i></button>
        `;
  } else if (role === "admin") {
    nav.className =
      "fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around py-4 z-50";
    nav.innerHTML = `
            <button data-target="view-admin" class="nav-item active"><i class="fas fa-cogs"></i></button>
        `;
  }

  // Bind nav events
  nav.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget.getAttribute("data-target");
      navigateTo(target);
    });
  });
}

export function navigateTo(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById(viewId)?.classList.add("active");

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-target") === viewId);
  });

  window.scrollTo(0, 0);

  // Llamar al renderizador específico de la vista
  if (viewId === "view-athlete-home") renderAthleteHome();
  if (viewId === "view-metrics") renderMetrics();
  if (viewId === "view-community") renderCommunity();
  if (viewId === "view-profile") renderProfile();
  if (viewId === "view-coach-plan") renderCoachPlan();
  if (viewId === "view-coach-students") renderCoachStudents();
  if (viewId === "view-admin") renderAdminDashboard();
}
