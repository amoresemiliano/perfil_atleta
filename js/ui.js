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
    ?.addEventListener("click", () => openLoginModal("athlete"));
  document
    .getElementById("btn-login-coach")
    ?.addEventListener("click", () => openLoginModal("coach"));
  document
    .getElementById("btn-login-admin")
    ?.addEventListener("click", () =>
      import("./auth.js").then((m) => m.login("admin")),
    );
  document
    .getElementById("btn-logout")
    ?.addEventListener("click", () => logout());

  document
    .getElementById("btn-close-login-modal")
    ?.addEventListener("click", () => {
      document.getElementById("login-select-modal").classList.add("hidden");
    });
}

function openLoginModal(role) {
  const modal = document.getElementById("login-select-modal");
  const title = document.getElementById("login-modal-title");
  const list = document.getElementById("login-modal-list");

  if (!modal || !title || !list) return;

  title.innerText =
    role === "athlete" ? "Ingresar como Atleta" : "Ingresar como Entrenador";

  const usersOfRole = state.users.filter((u) => u.role === role);

  if (usersOfRole.length === 0) {
    list.innerHTML = `<p class="text-center text-slate-400 text-sm mt-4">No hay perfiles registrados aún.</p>`;
  } else {
    list.innerHTML = usersOfRole
      .map(
        (u) => `
            <button data-login-id="${u.id}" class="btn-login-specific w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors text-left active:scale-95">
                <img src="${u.img}" class="w-12 h-12 rounded-full border-2 border-white shadow-sm">
                <div>
                    <p class="font-black text-slate-800">${u.name}</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">${u.role_desc || (role === "athlete" ? "Deportista" : "Entrenador")}</p>
                </div>
            </button>
        `,
      )
      .join("");

    // Bind events
    list.querySelectorAll(".btn-login-specific").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-login-id");
        modal.classList.add("hidden");
        import("./auth.js").then((m) => m.loginById(id));
      });
    });
  }

  modal.classList.remove("hidden");
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
