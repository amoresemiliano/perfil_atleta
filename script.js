const app = {
    state: {
        role: null,
        totalKm: 145.8,
        racha: 12,
        currentWorkout: { title: "Pasadas Potencia 800m", type: "Pasadas", bloques: 3, vueltas: 4, dist: 800, pace: "2:10", zone: "Z4", place: "Pista Central" },
        students: [],
        logs: []
    },

    init() {
        this.generateData();
        this.render();
    },

    generateData() {
        // Alumnos (20)
        const names = ["Ricardo G.", "Ana Ponce", "Luis Sosa", "Marta M.", "Santi Q.", "Elena F.", "Marcos T.", "Julia V.", "Beto D.", "Carla X.", "Diego R.", "Fede H.", "Gaby L.", "Hugo M.", "Iara S.", "Juan K.", "Lola P.", "Mati N.", "Nico W.", "Pau B."];
        this.state.students = names.map(name => ({
            name, km: (Math.random()*60 + 10).toFixed(1), progress: Math.floor(Math.random()*100), status: 'Validado'
        }));
        // Logs historial (15)
        for(let i=0; i<15; i++) {
            this.state.logs.push({ date: `${15-i}/05`, km: (Math.random()*10+5).toFixed(1), type: 'Pasadas' });
        }
    },

    login(role) {
        this.state.role = role;
        // 1. Quitar cuadro de login
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('view-login').classList.remove('active');
        
        // 2. Mostrar Header
        document.getElementById('app-header').classList.remove('hidden');
        const userData = (role === 'athlete') ? 
            {name: "Martín Pérez", role: "Deportista Elite", img: "https://i.pravatar.cc/150?u=athlete"} : 
            {name: "Profe Sebastián", role: "Head Coach", img: "https://i.pravatar.cc/150?u=coach"};
        
        document.getElementById('header-user-name').innerText = userData.name;
        document.getElementById('header-user-role').innerText = userData.role;
        document.getElementById('header-user-img').src = userData.img;

        // 3. Nav Inferior y Navegar
        this.setupBottomNav(role);
        this.navigateTo(role === 'athlete' ? 'view-athlete-home' : 'view-coach-plan');
    },

    logout() {
        this.state.role = null;
        document.getElementById('app-header').classList.add('hidden');
        document.getElementById('bottom-nav').classList.add('hidden');
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-login').classList.remove('hidden');
        document.getElementById('view-login').classList.add('active');
    },

    setupBottomNav(role) {
        const nav = document.getElementById('bottom-nav');
        nav.classList.remove('hidden');
        nav.classList.add('flex');
        
        if(role === 'athlete') {
            nav.className = "fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t flex justify-around py-4 z-50";
            nav.innerHTML = `
                <button onclick="app.navigateTo('view-athlete-home')" class="nav-item active" id="nav-view-athlete-home"><i class="fas fa-calendar-day"></i></button>
                <button onclick="app.navigateTo('view-metrics')" class="nav-item" id="nav-view-metrics"><i class="fas fa-chart-line"></i></button>
                <button onclick="app.navigateTo('view-community')" class="nav-item" id="nav-view-community"><i class="fas fa-users"></i></button>
                <button onclick="app.navigateTo('view-profile')" class="nav-item" id="nav-view-profile"><i class="fas fa-id-card"></i></button>
            `;
        } else {
            nav.className = "fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around py-4 z-50 coach-nav";
            nav.innerHTML = `
                <button onclick="app.navigateTo('view-coach-plan')" class="nav-item active" id="nav-view-coach-plan"><i class="fas fa-pencil-alt"></i></button>
                <button onclick="app.navigateTo('view-coach-students')" class="nav-item" id="nav-view-coach-students"><i class="fas fa-address-book"></i></button>
            `;
        }
    },

    navigateTo(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.id === `nav-${viewId}`);
        });
        window.scrollTo(0, 0);
        this.render();
    },

    render() {
        const w = this.state.currentWorkout;
        // Workout Card
        const card = document.getElementById('active-workout-card');
        if(card) {
            card.innerHTML = `
                <div class="flex justify-between mb-2">
                    <span class="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md uppercase italic">${w.type}</span>
                    <span class="text-[10px] font-bold text-slate-400 italic">${w.place}</span>
                </div>
                <h3 class="text-xl font-black text-slate-800">${w.title}</h3>
                <p class="text-xs font-bold text-slate-500 mt-1">${w.bloques}x${w.vueltas}x${w.dist}m | Ritmo: ${w.pace} | ${w.zone}</p>
            `;
            document.getElementById('input-km').value = ((w.bloques * w.vueltas * w.dist)/1000).toFixed(2);
        }

        // Listas (Leaderboard, Historial, Coach Alumnos) se inyectan aquí igual que antes...
        const lb = document.getElementById('leaderboard-list');
        if(lb) lb.innerHTML = this.state.students.map((s, i) => `
            <div class="flex justify-between items-center p-5">
                <div class="flex items-center gap-4"><span class="text-xs font-black text-slate-300 w-4">#${i+1}</span><div><p class="text-sm font-bold text-slate-700">${s.name}</p><p class="text-[9px] text-slate-400 font-bold uppercase italic">🔥 10 días</p></div></div>
                <p class="font-black text-orange-600">${s.km}k</p>
            </div>
        `).join('');

        const hist = document.getElementById('history-list');
        if(hist) hist.innerHTML = this.state.logs.map(log => `
            <div class="bg-white p-4 rounded-2xl border-l-4 border-orange-500 flex justify-between shadow-sm">
                <div><p class="text-[9px] font-black text-slate-400 uppercase italic">${log.date} • ${log.type}</p><p class="text-xs font-bold">Completado</p></div>
                <p class="font-black text-orange-600">${log.km}k</p>
            </div>
        `).join('');

        const cl = document.getElementById('coach-student-list');
        if(cl) cl.innerHTML = this.state.students.map(s => `
            <div class="bg-white p-5 rounded-[2rem] border border-slate-100 flex justify-between items-center">
                <div class="flex-1"><p class="font-black text-sm text-slate-800">${s.name}</p><div class="w-full bg-slate-100 h-1.5 rounded-full mt-2"><div class="bg-blue-500 h-full" style="width: ${s.progress}%"></div></div></div>
                <div class="ml-6 text-right"><p class="text-xs font-black">${s.km}k</p><p class="text-[8px] uppercase text-slate-400 italic">${s.status}</p></div>
            </div>
        `).join('');
    },

    validateActivity() { alert("Kms validados!"); this.navigateTo('view-metrics'); },
    createWorkout() { alert("Plan publicado!"); this.navigateTo('view-coach-students'); }
};

window.onload = () => app.init();