const app = {
    state: {
        totalKm: parseFloat(localStorage.getItem('totalKm')) || 0.0,
        racha: parseInt(localStorage.getItem('racha')) || 0,
        sessions: parseInt(localStorage.getItem('sessions')) || 0,
        currentWorkout: JSON.parse(localStorage.getItem('currentWorkout')) || {
            title: "8x400m en Z4", type: "Pasadas", bloques: 2, vueltas: 4, dist: 400, pace: "1:30", zone: "Z4", place: "Pista Central"
        },
        logs: JSON.parse(localStorage.getItem('logs')) || []
    },

    init() {
        this.renderAll();
        this.updateValidationKm();
    },

    navigateTo(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');

        const nav = document.getElementById('bottom-nav');
        const isAppView = viewId.startsWith('view-athlete') || viewId === 'view-metrics' || viewId === 'view-community' || viewId === 'view-profile';
        
        nav.classList.toggle('hidden', !isAppView);
        nav.classList.toggle('flex', isAppView);

        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.id === `nav-${viewId}`);
        });

        this.renderAll();
        window.scrollTo(0, 0);
    },

    updateValidationKm() {
        const w = this.state.currentWorkout;
        const totalKm = ((w.bloques * w.vueltas * w.dist) / 1000).toFixed(2);
        document.getElementById('input-km').value = totalKm;
    },

    validateActivity() {
        const km = parseFloat(document.getElementById('input-km').value);
        const time = document.getElementById('input-time').value || "00:00:00";
        const rpe = document.getElementById('input-rpe').value || "7";

        this.state.totalKm += km;
        this.state.sessions++;
        this.state.racha++;
        this.state.logs.unshift({ date: new Date().toLocaleDateString(), km, time, rpe, type: this.state.currentWorkout.type });

        localStorage.setItem('totalKm', this.state.totalKm);
        localStorage.setItem('sessions', this.state.sessions);
        localStorage.setItem('racha', this.state.racha);
        localStorage.setItem('logs', JSON.stringify(this.state.logs));

        alert("¡Entrenamiento validado con éxito!");
        this.navigateTo('view-metrics');
    },

    createWorkout() {
        const newW = {
            title: document.getElementById('coach-title').value,
            type: document.getElementById('coach-type').value,
            bloques: parseInt(document.getElementById('coach-bloques').value) || 1,
            vueltas: parseInt(document.getElementById('coach-vueltas').value) || 1,
            dist: parseInt(document.getElementById('coach-dist').value) || 0,
            pace: document.getElementById('coach-pace').value,
            zone: document.getElementById('coach-zone').value,
            place: document.getElementById('coach-place').value
        };
        this.state.currentWorkout = newW;
        localStorage.setItem('currentWorkout', JSON.stringify(newW));
        alert("Nuevo plan publicado.");
        this.renderAll();
    },

    renderAll() {
        const w = this.state.currentWorkout;
        
        // Home Atleta
        document.getElementById('stat-racha').innerText = `🔥 ${this.state.racha}`;
        document.getElementById('active-workout-card').innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase italic">${w.type}</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase"><i class="fas fa-map-marker-alt"></i> ${w.place}</span>
            </div>
            <h3 class="text-xl font-black">${w.title}</h3>
            <p class="text-sm font-bold text-slate-500 mt-1">${w.bloques} x ${w.vueltas} x ${w.dist}mts a ${w.pace} (${w.zone})</p>
        `;

        // Métricas Atleta
        document.getElementById('total-km-display').innerText = this.state.totalKm.toFixed(1);
        document.getElementById('total-sessions-display').innerText = this.state.sessions;
        document.getElementById('history-list').innerHTML = this.state.logs.map(log => `
            <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-orange-500 flex justify-between items-center">
                <div><p class="text-xs font-black">${log.type} (${log.date})</p><p class="text-[10px] text-slate-400 font-bold uppercase">RPE: ${log.rpe}</p></div>
                <div class="text-right"><p class="font-black text-orange-600">${log.km} km</p><p class="text-[10px] font-bold">${log.time}</p></div>
            </div>
        `).join('') || '<p class="text-center text-slate-400 text-xs">Aún no hay actividades validadas.</p>';

        // Ranking
        document.getElementById('leaderboard').innerHTML = [
            { name: "Corredor #77 (Anónimo)", km: 65, racha: 15 },
            { name: "Martín Pérez (Tú)", km: this.state.totalKm, racha: this.state.racha },
            { name: "Corredor #12 (Anónimo)", km: 42, racha: 4 }
        ].sort((a, b) => b.km - a.km).map((r, i) => `
            <div class="flex justify-between items-center p-5 ${r.name.includes('Tú') ? 'bg-orange-50' : ''}">
                <div class="flex items-center gap-3"><span class="text-xs font-black text-slate-300">#${i+1}</span><div><p class="text-sm font-bold">${r.name}</p><p class="text-[9px] text-slate-400 font-bold uppercase">🔥 ${r.racha} Días</p></div></div>
                <p class="font-black text-orange-600">${r.km.toFixed(1)} km</p>
            </div>
        `).join('');

        // Seguimiento Coach
        document.getElementById('coach-student-list').innerHTML = [
            { name: "Martín Pérez", km: this.state.totalKm, status: "V", color: "green" },
            { name: "Ana Gomez", km: 45, status: "P", color: "orange" },
            { name: "Luis Sosa", km: 12, status: "A", color: "red" }
        ].map(s => `
            <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-${s.color}-500 flex justify-between items-center">
                <div><p class="font-bold text-sm">${s.name}</p><p class="text-[10px] text-slate-400 font-bold">${s.km.toFixed(1)} km esta semana</p></div>
                <div class="bg-${s.color}-100 text-${s.color}-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">${s.status}</div>
            </div>
        `).join('');
    }
};

window.onload = () => app.init();