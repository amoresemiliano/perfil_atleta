import { state } from "./state.js";

export function renderAdminDashboard() {
  const cardsContainer = document.getElementById("admin-dashboard-cards");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = `
        <div data-modal="users" class="admin-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-users-cog text-4xl text-orange-600 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Gestión de Usuarios</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">${state.users.length} Usuarios Registrados</p>
        </div>
        <div data-modal="connections" class="admin-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-link text-4xl text-blue-500 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Vínculos Profes-Alumnos</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">${state.connections.length} Vínculos Activos</p>
        </div>
        <div data-modal="sports" class="admin-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-running text-4xl text-green-500 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Deportes y Actividades</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">${state.sports.length} Tipos de Deportes</p>
        </div>
    `;

  cardsContainer.querySelectorAll(".admin-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const modalType = e.currentTarget.getAttribute("data-modal");
      openAdminModal(modalType);
    });
  });

  const btnClose = document.getElementById("btn-close-admin-modal");
  if (btnClose) {
    // Clonar para evitar múltiples binds
    const newBtnClose = btnClose.cloneNode(true);
    btnClose.parentNode.replaceChild(newBtnClose, btnClose);
    newBtnClose.addEventListener("click", closeAdminModal);
  }
}

function openAdminModal(type) {
  const modal = document.getElementById("admin-modal");
  const content = document.getElementById("admin-modal-content");
  if (!modal || !content) return;

  modal.classList.remove("hidden");

  if (type === "users") {
    content.innerHTML = `
            <h3 class="text-xl font-black italic mb-4">Gestión de Usuarios</h3>
            <div class="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                ${state.users
                  .map(
                    (u) => `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div class="flex items-center gap-3">
                            <img src="${u.img}" class="w-8 h-8 rounded-full">
                            <div>
                                <p class="text-xs font-bold text-slate-800">${u.name}</p>
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${u.role}</p>
                            </div>
                        </div>
                        <button class="text-red-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <h4 class="text-xs font-black italic text-orange-600 mb-3">Nuevo Usuario</h4>
                <input type="text" placeholder="Nombre completo" class="w-full mb-2 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                <select class="w-full mb-3 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <option value="athlete">Atleta</option>
                    <option value="coach">Entrenador</option>
                </select>
                <button class="w-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl">Crear Usuario</button>
            </div>
        `;
  } else if (type === "connections") {
    content.innerHTML = `
            <h3 class="text-xl font-black italic mb-4">Vínculos Sistema</h3>
            <div class="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                ${state.connections
                  .map((c) => {
                    const coach = state.users.find((u) => u.id === c.coachId);
                    const athlete = state.users.find(
                      (u) => u.id === c.athleteId
                    );
                    return `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div class="text-xs">
                            <span class="font-bold text-blue-600">${coach?.name}</span>
                            <i class="fas fa-arrow-right text-slate-300 mx-1"></i>
                            <span class="font-bold text-slate-700">${athlete?.name}</span>
                        </div>
                        <button class="text-red-400 hover:text-red-600 text-xs"><i class="fas fa-unlink"></i></button>
                    </div>
                    `;
                  })
                  .join("")}
            </div>
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <h4 class="text-xs font-black italic text-blue-500 mb-3">Nuevo Vínculo</h4>
                <select class="w-full mb-2 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <option disabled selected>Seleccionar Profesor...</option>
                    ${state.users
                      .filter((u) => u.role === "coach")
                      .map((u) => `<option>${u.name}</option>`)
                      .join("")}
                </select>
                <select class="w-full mb-3 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <option disabled selected>Seleccionar Atleta...</option>
                    ${state.users
                      .filter((u) => u.role === "athlete")
                      .map((u) => `<option>${u.name}</option>`)
                      .join("")}
                </select>
                <button class="w-full bg-blue-500 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl">Vincular</button>
            </div>
        `;
  } else if (type === "sports") {
    content.innerHTML = `
            <h3 class="text-xl font-black italic mb-4">Deportes Base</h3>
            <div class="flex flex-wrap gap-2 mb-6">
                ${state.sports
                  .map(
                    (s) => `
                    <span class="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                        <i class="fas ${s.icon} mr-1"></i> ${s.name}
                    </span>
                `
                  )
                  .join("")}
            </div>
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <h4 class="text-xs font-black italic text-green-600 mb-3">Agregar Deporte</h4>
                <div class="flex gap-2">
                    <input type="text" placeholder="Ej: Natación" class="flex-1 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <button class="bg-green-500 px-4 text-white rounded-xl"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        `;
  }
}

function closeAdminModal() {
  const modal = document.getElementById("admin-modal");
  if (modal) modal.classList.add("hidden");
}