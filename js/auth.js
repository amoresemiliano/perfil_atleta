import { state } from './state.js';
import { renderHeader, renderBottomNav, navigateTo } from './ui.js';

export function login(role, email = null) {
    let user = null;
    
    if (role === 'admin' || email === 'vegendigital@gmail.com') {
        user = state.users.find(u => u.role === 'admin');
    } else if (role === 'athlete') {
        user = state.users.find(u => u.role === 'athlete'); // Loguea el primero para MVP
    } else if (role === 'coach') {
        user = state.users.find(u => u.role === 'coach'); // Loguea el primero para MVP
    }

    if (!user) return;
    
    state.currentUser = user;

    // 1. Quitar cuadro de login
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-login').classList.remove('active');
    
    // 2. Mostrar Header
    renderHeader();

    // 3. Nav Inferior y Navegar
    renderBottomNav(user.role);
    
    if (user.role === 'athlete') {
        navigateTo('view-athlete-home');
    } else if (user.role === 'coach') {
        navigateTo('view-coach-plan');
    } else if (user.role === 'admin') {
        navigateTo('view-admin');
    }
}

export function logout() {
    state.currentUser = null;
    document.getElementById('app-header').classList.add('hidden');
    document.getElementById('bottom-nav').classList.add('hidden');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    document.getElementById('view-login').classList.remove('hidden');
    document.getElementById('view-login').classList.add('active');
}