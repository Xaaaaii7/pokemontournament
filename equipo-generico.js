// equipo-generico.js
import { cargarDatos, calcularKC } from './data-loader.js';

export async function renderEquipo(entrenadorId) {
  try {
    const data = await cargarDatos();
    const entrenador = data.entrenadores[entrenadorId];
    
    if (!entrenador) {
      throw new Error(`No se encontró el entrenador con ID: ${entrenadorId}`);
    }

    /* Header ------------------------------------------------------------- */
    const header = document.querySelector('.entrenador-header');
    if (header) {
      header.querySelector('img').src = entrenador.imagen;
      header.querySelector('h1').textContent = `Equip de ${entrenador.nombre}`;
    }

    /* Bloc 1 – tots els Pokémon ----------------------------------------- */
    const container = document.getElementById('pokemon-container');
    if (container) {
      container.innerHTML = entrenador.equipo.map(renderCard).join('');
    }

    /* Bloc 2 – només inscrits ------------------------------------------ */
    const inscritsContainer = document.getElementById('inscrits-container');
    if (inscritsContainer) {
      inscritsContainer.innerHTML = entrenador.equipo
        .filter(p => p.inscrito)
        .map(renderCard)
        .join('');
    }

    /* Funció reutilitzable --------------------------------------------- */
    function renderCard(p) {
      return `
        <div class="pokemon-horizontal">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3><a href="https://www.wikidex.net/wiki/${p.nombre}">${p.nombre}</a></h3>
          <div class="stats">
            <span><span class="icon-stat">🗡️</span> ${p.kills}K</span>
            <span><span class="icon-stat">☠️</span> ${p.deaths}M</span>
            <span><span class="icon-stat">⚔️</span> ${p.battles}C</span>
            <span><span class="icon-stat">⚡</span> ${calcularKC(p)}K/C</span>
          </div>
          <div class="ataques-horizontal">
            ${p.ataques
              .map(t => {
                const tipoLower = t.toLowerCase();
                return `<img class="tipo-icon" src="img/${t}.png" alt="${t}">`;
              })
              .join('')}
          </div>
        </div>`;
    }
  } catch (error) {
    console.error('Error cargando los datos:', error);
    // Puedes añadir aquí manejo de errores visual
  }
}
