import { state } from './state.js';

export function renderAdminDashboard() {
    const cardsContainer = document.getElementById('admin-dashboard-cards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = `
        <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-users-cog text-4xl text-orange-600 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Gestión de Usuarios</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Crear Atletas y Entrenadores</p>
        </div>
        <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-link text-4xl text-blue-500 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Vínculos Profes-Alumnos</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Asignar quién ve a quién</p>
        </div>
        <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-running text-4xl text-green-500 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Deportes y Actividades</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Administrar tipos de deportes</p>
        </div>
        <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
            <i class="fas fa-database text-4xl text-purple-500 mb-3"></i>
            <h3 class="text-lg font-black text-slate-800">Datos del Sistema</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Métricas, perfiles y variantes</p>
        </div>
    `;

    // En el futuro (siguiente iteración MVP o final), aquí añadiríamos los eventListeners 
    // a estas tarjetas para que abran modales donde el admin modifique state.js.
    // Por ahora, como es MVP estructural, mostraremos alertas o dejaremos preparado.
    cardsContainer.querySelectorAll('.bg-white').forEach((card, index) => {
        card.addEventListener('click', () => {
            const modals = ['Usuarios', 'Vínculos', 'Deportes', 'Métricas'];
            alert(`Apertura del Modal de Configuración de: ${modals[index]}`);
            console.log(`Estado actual de usuarios:`, state.users);
            console.log(`Estado actual de vínculos:`, state.connections);
        });
    });
}