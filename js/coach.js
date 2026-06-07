import { state } from "./state.js";
import { navigateTo } from "./ui.js";

export function renderCoachPlan() {
  const athleteSelect = document.getElementById("coach-athlete-select");
  const sportSelect = document.getElementById("coach-sport-select");
  const btnCreate = document.getElementById("btn-create-workout");

  if (athleteSelect) {
    // Filtrar alumnos vinculados al coach actual
    const myId = state.currentUser.id;
    const linkedAthletesIds = state.connections
      .filter((c) => c.coachId === myId)
      .map((c) => c.athleteId);
    const athletes = state.users.filter((u) =>
      linkedAthletesIds.includes(u.id),
    );

    athleteSelect.innerHTML =
      athletes.length > 0
        ? athletes
            .map((a) => `<option value="${a.id}">${a.name}</option>`)
            .join("")
        : `<option disabled>No tienes alumnos asignados</option>`;
  }

  if (sportSelect) {
    sportSelect.innerHTML = state.sports
      .map((s) => `<option value="${s.id}">${s.name}</option>`)
      .join("");
  }

  if (btnCreate) {
    // Evitar duplicar listeners
    const newBtn = btnCreate.cloneNode(true);
    btnCreate.parentNode.replaceChild(newBtn, btnCreate);
    newBtn.addEventListener("click", publishWorkout);
  }
}

function publishWorkout() {
  const athleteId = document.getElementById("coach-athlete-select").value;
  const sport = document.getElementById("coach-sport-select").value;
  const title = document.getElementById("coach-title").value;
  const type = document.getElementById("coach-type").value;
  const bloques = parseInt(document.getElementById("coach-bloques").value);
  const vueltas = parseInt(document.getElementById("coach-vueltas").value);
  const dist = parseInt(document.getElementById("coach-dist").value);
  const pace = document.getElementById("coach-pace").value;
  const zone = document.getElementById("coach-zone").value;
  const place = document.getElementById("coach-place").value;

  if (!title || !athleteId) {
    alert("El título y el alumno son obligatorios");
    return;
  }

  state.activities.push({
    id: `assigned_${Date.now()}`,
    athleteId: athleteId,
    coachId: state.currentUser.id,
    status: "pending",
    sport: sport,
    title: title,
    type: type,
    bloques: bloques,
    vueltas: vueltas,
    dist: dist,
    pace: pace,
    zone: zone,
    place: place,
    dateAssigned: new Date().toISOString(),
  });

  alert("¡Entrenamiento publicado con éxito!");
  navigateTo("view-coach-students");
}

export function renderCoachStudents() {
  const container = document.getElementById("coach-student-list");
  if (!container) return;

  const myId = state.currentUser.id;
  const linkedAthletesIds = state.connections
    .filter((c) => c.coachId === myId)
    .map((c) => c.athleteId);
  const athletes = state.users.filter((u) => linkedAthletesIds.includes(u.id));

  if (athletes.length === 0) {
    container.innerHTML = `<p class="text-center text-slate-400 text-sm mt-4">No tienes alumnos asignados.</p>`;
    return;
  }

  container.innerHTML = athletes
    .map((s) => {
      // Calcular estadísticas solo de este alumno
      const acts = state.activities.filter(
        (a) => a.athleteId === s.id && a.status === "completed",
      );
      const totalKm = acts.reduce((sum, a) => sum + (a.distance || 0), 0);

      // Simular progreso (en un entorno real sería contra un objetivo)
      const progress = Math.min(100, Math.max(0, (totalKm / 50) * 100)); // Ejemplo: objetivo 50km

      const lastAct = acts.sort(
        (a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted),
      )[0];
      const statusText = lastAct ? "Activo" : "Sin actividad";

      return `
        <div class="bg-white p-5 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm mb-4">
            <div class="flex items-center gap-4 flex-1">
                <img src="${s.img}" class="w-10 h-10 rounded-full border border-slate-200">
                <div class="flex-1">
                    <p class="font-black text-sm text-slate-800">${s.name}</p>
                    <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                        <div class="bg-blue-500 h-full rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
            <div class="ml-6 text-right">
                <p class="text-xs font-black text-orange-600">${totalKm.toFixed(1)}k</p>
                <p class="text-[8px] uppercase text-slate-400 italic font-bold tracking-widest">${statusText}</p>
            </div>
        </div>
        `;
    })
    .join("");
}
