import { state, generateMockData } from './state.js';
import { setupUI } from './ui.js';
import { login } from './auth.js';

function init() {
    generateMockData();
    setupUI();

    // Si queremos auto-login para desarrollo, descomentar:
    // login('admin');
}

window.addEventListener('DOMContentLoaded', init);
