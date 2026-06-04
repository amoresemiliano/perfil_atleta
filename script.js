const app = {
    // 1. Datos iniciales de prueba (Mockup)
    data: {
        ranking: [
            { id: 101, name: "Corredor #101 (Tú)", km: 45.5, pos: 1 },
            { id: 202, name: "Corredor #202", km: 42.1, pos: 2 },
            { id: 303, name: "Corredor #303", km: 38.0, pos: 3 },
            { id: 404, name: "Corredor #404", km: 35.5, pos: 4 }
        ],
        students: [
            { name: "Juan Pérez", status: "Validado", color: "green", assist: "95%" },
            { name: "Ana Gomez", status: "Pendiente", color: "orange", assist: "80%" },
            { name: "Luis Sosa", status: "Ausente", color: "red", assist: "40%" }
        ],
        images: [
            'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1461896642303-90d6573baf9b?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?auto=format&fit=crop&q=80&w=1000'
        ]
    },

    // 2. Inicialización
    init() {
        console.log("App iniciada...");
        this.renderRanking();
        this.renderCoachStudents();
    },

    // 3. Router de navegación
    navigateTo(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        // Mostrar la vista objetivo
        const target = document.getElementById(viewId);
        if (target) target.classList.add('active');

        // Mostrar/Ocultar el Nav Inferior
        const nav = document.getElementById('bottom-nav');
        if (viewId === 'view-login' || viewId === 'view-coach-home') {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }

        // Actualizar UI del Login si es necesario
        if (viewId === 'view-login') this.changeLoginBg();
        
        window.scrollTo(0, 0);
    },

    // 4. Funciones de Renderizado
    renderRanking() {
        const container = document.getElementById('ranking-body');
        container.innerHTML = this.data.ranking.map(r => `
            <tr class="${r.id === 101 ? 'bg-orange-50 font-bold' : ''}">
                <td class="p-4 text-xs font-bold text-gray-400">#${r.pos}</td>
                <td class="p-4 italic text-sm">${r.name}</td>
                <td class="p-4 text-right font-black text-orange-600">${r.km} km</td>
            </tr>
        `).join('');
    },

    renderCoachStudents() {
        const container = document.getElementById('coach-student-list');
        container.innerHTML = this.data.students.map(s => `
            <div class="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border-l-4 border-${s.color}-500">
                <div>
                    <p class="font-bold text-sm">${s.name}</p>
                    <p class="text-[10px] text-gray-400 uppercase font-bold italic">${s.status}</p>
                </div>
                <div class="text-right">
                    <p class="font-black text-orange-600">${s.assist}</p>
                    <p class="text-[9px] text-gray-400">Asistencia</p>
                </div>
            </div>
        `).join('');
    },

    changeLoginBg() {
        const login = document.getElementById('view-login');
        const randomImg = this.data.images[Math.floor(Math.random() * this.data.images.length)];
        login.style.backgroundImage = `url('${randomImg}')`;
    }
};

// Arrancar app al cargar
window.onload = () => app.init();