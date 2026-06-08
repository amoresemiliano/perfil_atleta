import { state } from "./state.js";

export function renderAthleteHome() {
  const pendingContainer = document.getElementById("athlete-pending-workouts");
  const sportSelect = document.getElementById("athlete-manual-sport");

  // 1. Mostrar entrenamientos asignados pendientes
  const myId = state.currentUser.id;
  const pendingWorkouts = state.activities.filter(
    (a) => a.athleteId === myId && a.status === "pending",
  );

  if (pendingContainer) {
    if (pendingWorkouts.length === 0) {
      pendingContainer.innerHTML = `<p class="text-center text-slate-400 text-sm mt-4">No tienes entrenamientos asignados pendientes.</p>`;
    } else {
      pendingContainer.innerHTML = pendingWorkouts
        .map((w) => {
          const coach = state.users.find((u) => u.id === w.coachId);
          const sport = state.sports.find((s) => s.id === w.sport);
          return `
                <header class="header-gradient text-white p-6 rounded-3xl shadow-xl mb-6 mt-2">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-black italic uppercase">Próximo Plan</h2>
                        <div class="bg-white/20 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest"><i class="fas ${sport?.icon || "fa-running"}"></i> ${sport?.name || "Deporte"}</div>
                    </div>
                    <div class="bg-white text-slate-800 p-5 rounded-2xl shadow-lg mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md uppercase italic">${w.type}</span>
                            <span class="text-[10px] font-bold text-slate-400 italic">${w.place}</span>
                        </div>
                        <h3 class="text-xl font-black text-slate-800">${w.title}</h3>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Asignado por: ${coach ? coach.name : "Desconocido"}</p>
                        <p class="text-xs font-bold text-slate-500 mt-2">${w.bloques}x${w.vueltas}x${w.dist}m | Ritmo: ${w.pace} | ${w.zone}</p>
                    </div>
                    <button data-act-id="${w.id}" class="btn-complete-assigned w-full bg-slate-900 text-white py-3 rounded-2xl font-black shadow-lg text-xs tracking-widest uppercase active:scale-95">
                        Marcar como Completado
                    </button>
                </header>`;
        })
        .join("");

      // Asignar eventos de completado
      pendingContainer
        .querySelectorAll(".btn-complete-assigned")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const actId = e.currentTarget.getAttribute("data-act-id");
            completeAssignedActivity(actId);
          });
        });
    }
  }

  // 2. Llenar select de deportes para autocarga
  if (sportSelect) {
    sportSelect.innerHTML = state.sports
      .map((s) => `<option value="${s.id}">${s.name}</option>`)
      .join("");
  }

  // 3. Evento de carga manual
  const btnManual = document.getElementById("btn-manual-activity");
  if (btnManual) {
    // Remover eventos previos si hubiere (para evitar duplicados al re-renderizar)
    const newBtn = btnManual.cloneNode(true);
    btnManual.parentNode.replaceChild(newBtn, btnManual);

    newBtn.addEventListener("click", saveManualActivity);
  }
}

function completeAssignedActivity(actId) {
  const act = state.activities.find((a) => a.id === actId);
  if (act) {
    act.status = "completed";
    act.dateCompleted = new Date().toISOString();
    // Calculamos distancia básica si no tiene
    if (!act.distance) {
      act.distance = parseFloat(
        ((act.bloques * act.vueltas * act.dist) / 1000).toFixed(2),
      );
    }
    import("./state.js").then(async ({ API }) => {
      await API.updateActivityStatus(act);
      alert("¡Entrenamiento marcado como completado!");
      renderAthleteHome(); // Refrescar vista
    });
  }
}

// Función Helper para parsear cualquier formato de tiempo a HH:MM:SS
function parseTimeToStandard(inputStr) {
  inputStr = inputStr
    .trim()
    .replace(/hs/gi, "")
    .replace(/m/gi, "")
    .replace(/s/gi, "");

  // Si contiene dos puntos (ej. 1:15 o 01:10:00)
  if (inputStr.includes(":")) {
    const parts = inputStr.split(":");
    if (parts.length === 2) {
      // Se asume MM:SS
      const m = parseInt(parts[0]) || 0;
      const s = parseInt(parts[1]) || 0;
      const h = Math.floor(m / 60);
      const rm = m % 60;
      return `${h.toString().padStart(2, "0")}:${rm.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    } else if (parts.length === 3) {
      // Se asume HH:MM:SS
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseInt(parts[2]) || 0;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
  }

  // Si es solo un número (ej. 45 o 90) se asume que son Minutos Totales
  if (!isNaN(inputStr) && inputStr !== "") {
    const totalMinutes = parseFloat(inputStr);
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const s = Math.round((totalMinutes - Math.floor(totalMinutes)) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return null; // Formato inválido
}

function saveManualActivity() {
  const sport = document.getElementById("athlete-manual-sport").value;
  const km = parseFloat(document.getElementById("athlete-manual-km").value);
  const rawTime = document.getElementById("athlete-manual-time").value;
  const rpe = document.getElementById("athlete-manual-rpe").value;

  if (!km || !rawTime) {
    alert("Por favor, ingresa distancia y tiempo.");
    return;
  }

  const standardTime = parseTimeToStandard(rawTime);
  if (!standardTime) {
    alert(
      "Formato de tiempo no válido. Usa minutos (ej: 45) o HH:MM:SS (ej: 01:10:00).",
    );
    return;
  }

  const newManualAct = {
    id: `auto_${Date.now()}`,
    athleteId: state.currentUser.id,
    coachId: null, // Autogenerada
    status: "completed",
    sport: sport,
    title: "Actividad Manual",
    distance: km,
    time: standardTime,
    rpe: rpe,
    dateCompleted: new Date().toISOString(),
  };

  import("./state.js").then(async ({ state, API }) => {
    await API.saveActivity(newManualAct);
    state.activities.push(newManualAct);
    alert("¡Actividad guardada con éxito!");
    // Limpiar form
    document.getElementById("athlete-manual-km").value = "";
    document.getElementById("athlete-manual-time").value = "";
    document.getElementById("athlete-manual-rpe").value = "7";
  });
}

export function renderMetrics() {
  const container = document.getElementById("view-metrics");
  if (!container) return;

  const myId = state.currentUser.id;
  const myActivities = state.activities.filter(
    (a) => a.athleteId === myId && a.status === "completed",
  );

  // Cálculos estadísticos
  let totalKm = 0;
  let totalMinutes = 0;

  myActivities.forEach((a) => {
    if (a.distance) totalKm += parseFloat(a.distance);
    if (a.time) {
      // Espera formato HH:MM:SS o MM:SS
      const parts = a.time.split(":").map(Number);
      if (parts.length === 3) {
        totalMinutes += parts[0] * 60 + parts[1] + parts[2] / 60;
      } else if (parts.length === 2) {
        totalMinutes += parts[0] + parts[1] / 60;
      }
    }
  });

  const avgPace = totalKm > 0 ? totalMinutes / totalKm : 0;
  const avgPaceMins = Math.floor(avgPace);
  const avgPaceSecs = Math.round((avgPace - avgPaceMins) * 60);
  const paceStr =
    totalKm > 0
      ? `${avgPaceMins}:${avgPaceSecs.toString().padStart(2, "0")} /km`
      : "0:00";

  container.innerHTML = `
        <h2 class="text-2xl font-black mb-6 italic uppercase">Análisis de Datos</h2>

        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 col-span-2 flex justify-between items-center">
                <div>
                    <p class="label-tiny">Volumen Histórico</p>
                    <p class="text-4xl font-black text-orange-600">${totalKm.toFixed(1)} <span class="text-sm text-slate-400 font-bold">km</span></p>
                </div>
                <div class="text-right">
                    <p class="label-tiny">Tiempo Acumulado</p>
                    <p class="text-2xl font-black text-slate-800">${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m</p>
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <p class="label-tiny">Sesiones Totales</p>
                <p class="text-3xl font-black text-slate-800">${myActivities.length}</p>
            </div>
            <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <p class="label-tiny">Ritmo Medio Global</p>
                <p class="text-2xl font-black text-blue-500">${paceStr}</p>
            </div>
        </div>

        <h3 class="label-tiny mb-4 tracking-widest italic">Historial de Actividades</h3>
        <div class="space-y-3 pb-10">
            ${
              myActivities
                .sort(
                  (a, b) =>
                    new Date(b.dateCompleted) - new Date(a.dateCompleted),
                )
                .map((log) => {
                  const sport = state.sports.find((s) => s.id === log.sport);
                  const d = new Date(log.dateCompleted);
                  const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
                  return `
                <div class="bg-white p-4 rounded-2xl border-l-4 border-orange-500 flex justify-between shadow-sm items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <i class="fas ${sport?.icon || "fa-running"}"></i>
                        </div>
                        <div>
                            <p class="text-[9px] font-black text-slate-400 uppercase italic">${dateStr} • ${sport?.name || "Deporte"}</p>
                            <p class="text-xs font-bold text-slate-800">${log.title || "Actividad"}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-black text-orange-600">${log.distance ? log.distance.toFixed(1) + "k" : "-"}</p>
                        <p class="text-[9px] font-bold text-slate-400">${log.time || "-"}</p>
                    </div>
                </div>
                `;
                })
                .join("") ||
              '<p class="text-xs text-slate-400 text-center">No hay actividades registradas.</p>'
            }
        </div>
    `;
}

export function renderCommunity() {
  // Para MVP rápido: Leaderboard basado en state.users que son atletas
  const container = document.getElementById("leaderboard-list");
  if (!container) return;

  // Calcular kms totales por atleta
  const leaderboardData = state.users
    .filter((u) => u.role === "athlete")
    .map((u) => {
      const acts = state.activities.filter(
        (a) => a.athleteId === u.id && a.status === "completed",
      );
      const km = acts.reduce((sum, a) => sum + (a.distance || 0), 0);
      return { name: u.name, km: km };
    })
    .sort((a, b) => b.km - a.km);

  container.innerHTML = leaderboardData
    .map(
      (s, i) => `
        <div class="flex justify-between items-center p-5">
            <div class="flex items-center gap-4">
                <span class="text-xs font-black ${i < 3 ? "text-orange-500" : "text-slate-300"} w-4">#${i + 1}</span>
                <div>
                    <p class="text-sm font-bold text-slate-700">${s.name}</p>
                    <p class="text-[9px] text-slate-400 font-bold uppercase italic">Activo</p>
                </div>
            </div>
            <p class="font-black text-orange-600">${s.km.toFixed(1)}k</p>
        </div>
    `,
    )
    .join("");
}

export function renderProfile() {
  // MVP: Por ahora dejamos el HTML estático de profile tal como está,
  // solo asegurando que la vista exista.
}
