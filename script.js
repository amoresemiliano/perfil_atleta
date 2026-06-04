const app = {
    // 1. ESTADO DE LA APP (Con Persistencia)
    state: {
        totalKm: parseFloat(localStorage.getItem('totalKm')) || 0.0,
        racha: parseInt(localStorage.getItem('racha')) || 0,
        sessions: parseInt(localStorage.getItem('sessions')) || 0,
        currentWorkout: JSON.parse(localStorage.getItem('currentWorkout')) || {
            type: "Pasadas", bloques: 3, vueltas: 4, dist: 800, pace: "2:10", zone: "Z4"
        },
        students: [
            { name: "Juan Pérez", progress: 85, lastKm: "12.5k", status: "Validado" },
            { name: "Ana Gomez", progress: 40, lastKm: "5.0k", status: "Pendiente" },
            { name: "Luis Sosa", progress: 0, lastKm: "0.0k", status: "Ausente" }
        ]
    },

    init() {
        this.renderAll();
        this.updateValidationKm();
    },

    // 2. NAVEGACIÓN
    navigateTo(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');

        const nav = document.getElementById('bottom-nav');
        const isAthleteView = viewId.startsWith('view-athlete') || viewId === 'view-metrics' || viewId === 'view-community' || viewId === 'view-profile';
        
        if (isAthleteView) {
            nav.classList.remove('hidden');
            nav.classList.add('flex');
        } else {
            nav.classList.remove('hidden');
            nav.classList.add('hidden');
        }

        // Marcar icono activo
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `nav-${viewId}`) btn.classList.add('active');
        });

        this.renderAll(); // Refrescar datos al cambiar de vista
    },

    // 3. LÓGICA DE NEGOCIO (Validar y Sumar)
    updateValidationKm() {
        const w = this.state.currentWorkout;
        const totalMeters = w.bloques * w.vueltas * w.dist;
        const totalKm = (totalMeters / 1000).toFixed(2);
        document.getElementById('input-km').value = totalKm;
    },

    validateActivity() {
        const kmToAdd = parseFloat(document.getElementById('input-km').value);
        
        // Actualizar Estado
        this.state.totalKm += kmToAdd;
        this.state.sessions += 1;
        this.state.racha += 1;

        // Persistir en LocalStorage
        localStorage.setItem('totalKm', this.state.totalKm);
        localStorage.setItem('sessions', this.state.sessions);
        localStorage.setItem('racha', this.state.racha);

        alert(`¡Entrenamiento guardado! Sumaste ${kmToAdd} km.`);
        this.navigateTo('view-metrics');
    },

    createWorkout() {
        const newWorkout = {
            type: document.getElementById('coach-type').value,
            bloques: parseInt(document.getElementById('coach-bloques').value) || 1,
            vueltas: parseInt(document.getElementById('coach-vueltas').value) || 1,
            dist: parseInt(document.getElementById('coach-dist').value) || 0,
            pace: "Calculado", zone: "Z4"
        };
        this.state.currentWorkout = newWorkout;
        localStorage.setItem('currentWorkout', JSON.stringify(newWorkout));
        alert("Plan publicado para los alumnos.");
    },

    // 4. RENDERIZADO DINÁMICO
    renderAll() {
        // Home Atleta
        const w = this.state.currentWorkout;
        document.getElementById('stat-racha').innerText = `🔥 ${this.state.racha}`;
        document.getElementById('active-workout-card').innerHTML = `
            <span class="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">${w.type}</span>
            <h3 class="text-xl font-black mt-2">${w.bloques} x ${w.vueltas} x ${w.dist} mts</h3>
            <p class="text-sm text-slate-400 font-bold">Ritmo: ${w.pace} | Zona: ${w.zone}</p>
        `;

        // Métricas
        document.getElementById('total-km-display').innerText = this.state.totalKm.toFixed(1);
        document.getElementById('total-sessions-display').innerText = this.state.sessions;

        // Ranking Comunidad
        const leaderboard = document.getElementById('leaderboard');
        const runners = [
            { name: "Corredor #77", km: 65, racha: 15 },
            { name: "Tú (Martín)", km: this.state.totalKm, racha: this.state.racha },
            { name: "Corredor #12", km: 32, racha: 4 }
        ].sort((a, b) => b.km - a.km);

        leaderboard.innerHTML = runners.map((r, i) => `
            <div class="flex justify-between items-center p-4 ${r.name.includes('Tú') ? 'bg-orange-50' : ''}">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-black text-slate-300">#${i+1}</span>
                    <div>
                        <p class="text-sm font-bold">${r.name}</p>
                        <p class="text-[10px] text-slate-400 font-bold">🔥 ${r.racha} DÍAS</p>
                    </div>
                </div>
                <p class="font-black text-orange-600">${r.km.toFixed(1)} km</p>
            </div>
        `).join('');

        // Coach: Seguimiento Alumnos
        const studentList = document.getElementById('coach-student-list');
        studentList.innerHTML = this.state.students.map(s => `
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <p class="font-bold text-sm">${s.name}</p>
                    <div class="w-32 bg-slate-100 h-1.5 rounded-full mt-1">
                        <div class="bg-blue-500 h-1.5 rounded-full" style="width: ${s.progress}%"></div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs font-black text-slate-800">${s.lastKm}</p>
                    <p class="text-[9px] font-bold ${s.status === 'Validado' ? 'text-green-500' : 'text-orange-400'} uppercase">${s.status}</p>
                </div>
            </div>
        `).join('');
    }
};

window.onload = () => app.init();