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
                        <button data-delete-user="${u.id}" class="btn-delete-user text-red-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <h4 class="text-xs font-black italic text-orange-600 mb-3">Nuevo Usuario</h4>
                <input id="new-user-name" type="text" placeholder="Nombre completo" class="w-full mb-2 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                <select id="new-user-role" class="w-full mb-3 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <option value="athlete">Atleta</option>
                    <option value="coach">Entrenador</option>
                </select>
                <button id="btn-add-user" class="w-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all">Crear Usuario</button>
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
                      (u) => u.id === c.athleteId,
                    );
                    return `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div class="text-xs">
                            <span class="font-bold text-blue-600">${coach?.name || "Desconocido"}</span>
                            <i class="fas fa-arrow-right text-slate-300 mx-1"></i>
                            <span class="font-bold text-slate-700">${athlete?.name || "Desconocido"}</span>
                        </div>
                        <button data-delete-conn="${c.id}" class="btn-delete-conn text-red-400 hover:text-red-600 text-xs"><i class="fas fa-unlink"></i></button>
                    </div>
                    `;
                  })
                  .join("")}
            </div>
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <h4 class="text-xs font-black italic text-blue-500 mb-3">Nuevo Vínculo</h4>
                <select id="new-conn-coach" class="w-full mb-2 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <option value="" disabled selected>Seleccionar Profesor...</option>
                    ${state.users
                      .filter((u) => u.role === "coach")
                      .map((u) => `<option value="${u.id}">${u.name}</option>`)
                      .join("")}
                </select>
                <select id="new-conn-athlete" class="w-full mb-3 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <option value="" disabled selected>Seleccionar Atleta...</option>
                    ${state.users
                      .filter((u) => u.role === "athlete")
                      .map((u) => `<option value="${u.id}">${u.name}</option>`)
                      .join("")}
                </select>
                <button id="btn-add-conn" class="w-full bg-blue-500 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl hover:bg-blue-600 active:scale-95 transition-all">Vincular</button>
            </div>
        `;
  } else if (type === "sports") {
    content.innerHTML = `
            <h3 class="text-xl font-black italic mb-4">Deportes Base</h3>
            <div class="flex flex-wrap gap-2 mb-6">
                ${state.sports
                  .map(
                    (s) => `
                    <span class="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 flex items-center gap-2">
                        <i class="fas ${s.icon}"></i> ${s.name}
                    </span>
                `,
                  )
                  .join("")}
            </div>
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <h4 class="text-xs font-black italic text-green-600 mb-3">Agregar Deporte</h4>
                <div class="flex gap-2">
                    <input id="new-sport-name" type="text" placeholder="Ej: Natación" class="flex-1 p-3 text-xs rounded-xl bg-white border border-slate-200 outline-none">
                    <button id="btn-add-sport" class="bg-green-500 px-4 text-white rounded-xl hover:bg-green-600 active:scale-95 transition-all"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        `;
  }

  // Bind Events after HTML injection
  bindModalEvents(type);
}

function bindModalEvents(type) {
  if (type === "users") {
    // Add User
    document
      .getElementById("btn-add-user")
      ?.addEventListener("click", async () => {
        const nameInput = document.getElementById("new-user-name");
        const roleInput = document.getElementById("new-user-role");
        if (!nameInput.value.trim()) return alert("El nombre es requerido.");

        const newId = `${roleInput.value}_${Date.now()}`;
        const newUser = {
          id: newId,
          role: roleInput.value,
          email: `${newId}@test.com`,
          name: nameInput.value.trim(),
          role_desc: roleInput.value === "coach" ? "Entrenador" : "Deportista",
          img: `https://i.pravatar.cc/150?u=${newId}`,
        };

        await API.addUser(newUser);
        state.users.push(newUser);
        refreshAdminUI(type);
      });

    // Delete User
    document.querySelectorAll(".btn-delete-user").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const userId = e.currentTarget.getAttribute("data-delete-user");
        if (state.users.find((u) => u.id === userId)?.role === "admin")
          return alert("No puedes borrar al admin.");

        await API.deleteUser(userId);
        state.users = state.users.filter((u) => u.id !== userId);
        state.connections = state.connections.filter(
          (c) => c.coachId !== userId && c.athleteId !== userId,
        );
        refreshAdminUI(type);
      });
    });
  } else if (type === "connections") {
    // Add Connection
    document
      .getElementById("btn-add-conn")
      ?.addEventListener("click", async () => {
        const coachId = document.getElementById("new-conn-coach").value;
        const athleteId = document.getElementById("new-conn-athlete").value;
        if (!coachId || !athleteId) return alert("Selecciona profe y atleta.");

        const exists = state.connections.find(
          (c) => c.coachId === coachId && c.athleteId === athleteId,
        );
        if (exists) return alert("Ese vínculo ya existe.");

        const res = await API.addConnection(coachId, athleteId);
        state.connections.push({ id: res.id, coachId, athleteId });
        refreshAdminUI(type);
      });

    // Delete Connection
    document.querySelectorAll(".btn-delete-conn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const connId = e.currentTarget.getAttribute("data-delete-conn");
        await API.deleteConnection(connId);
        state.connections = state.connections.filter((c) => c.id != connId);
        refreshAdminUI(type);
      });
    });
  } else if (type === "sports") {
    // Add Sport
    document
      .getElementById("btn-add-sport")
      ?.addEventListener("click", async () => {
        const nameInput = document.getElementById("new-sport-name");
        const val = nameInput.value.trim();
        if (!val) return alert("Ingresa un nombre.");

        const newSport = {
          id: `sport_${Date.now()}`,
          name: val,
          icon: "fa-trophy",
        };

        await API.addSport(newSport);
        state.sports.push(newSport);
        refreshAdminUI(type);
      });
  }
}

function refreshAdminUI(type) {
  // 1. Re-renderizar el modal actual para mostrar cambios
  openAdminModal(type);
  // 2. Re-renderizar las tarjetas del fondo para actualizar los contadores
  renderAdminDashboard();
}

function closeAdminModal() {
  const modal = document.getElementById("admin-modal");
  if (modal) modal.classList.add("hidden");
}
