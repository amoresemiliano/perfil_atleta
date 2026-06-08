import { loadInitialState } from "./state.js";
import { setupUI } from "./ui.js";

async function init() {
  // 1. Cargar datos de la Base de Datos primero
  await loadInitialState();

  // 2. Iniciar UI
  setupUI();
}

window.addEventListener("DOMContentLoaded", init);
