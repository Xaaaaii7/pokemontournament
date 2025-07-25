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
    /* Cementerio: Pokémon con 3 muertes de aventura */
    const cementerioContainer = document.getElementById('cementerio');
    if (cementerioContainer) {
      const muertos = entrenador.equipo.filter(p => p.deathsAdventure >= 3);
      cementerioContainer.innerHTML = muertos.map(renderCard).join('');
    }
 /* Bloc 3 – destacados ---------------------------------------------- */
    const destacadosContainer = document.getElementById('destacados-container');
    if (destacadosContainer) {
      const equipo = entrenador.equipo.filter(p => p.battles > 0); // solo con combates

      if (equipo.length === 0) {
        destacadosContainer.innerHTML = '<p>No hay Pokémon con combates registrados.</p>';
        return;
      }

      const getProporcion = p => calcularKC(p);

      
const maxKills = equipo
  .slice()
  .sort((a, b) => {
    const diffA = a.kills - a.battles;
    const diffB = b.kills - b.battles;

    // Ordenar por mayor diferencia (mejor rendimiento ofensivo)
    if (diffA !== diffB) {
      return diffB - diffA;
    }

    // Si hay empate en diferencia, ordenar por más kills
    return b.kills - a.kills;
  })[0];
     const minMuertes = equipo
  .slice()
  .sort((a, b) => {
    const diffA = a.battles - a.deaths;
    const diffB = b.battles - b.deaths;

    // Ordenar por menor diferencia (mejor rendimiento)
    if (diffA !== diffB) {
      return diffB - diffA;
    }

    // Si hay empate en diferencia, ordenar por menos muertes
    return a.deaths - b.deaths;
  })[0];
 

      const mejorRatio = equipo
        .slice()
        .sort((a, b) => getProporcion(b) - getProporcion(a) || a.battles - b.battles)[0];

      destacadosContainer.innerHTML = `
        <div class="destacado">
          <h2>🥇 Mes Ofensiu: ${maxKills.kills}</h2>
          ${renderCardDestacados(maxKills)}
        </div>
        <div class="destacado">
          <h2>🛡️ Mes Defensiu: ${minMuertes.deaths}</h2>
          ${renderCardDestacados(minMuertes)}
        </div>
        <div class="destacado">
          <h2>⚖️ Mes equilibrat: ${calcularKC(mejorRatio)}</h2>
          ${renderCardDestacados(mejorRatio)}
        </div>`;
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
          <div class="muertes-aventura">
            ☠️ ${p.deathsAdventure} mort${p.deathsAdventure === 1 ? '' : 's'} a l'aventura
          </div>
        </div>`;
    }
     function renderCardDestacados(p) {
      return `
        <div class="pokemon-destacado">
          <h3>${p.nombre}</h3>
          <img src="${p.imagen}" alt="${p.nombre}">
        </div>`;
    }
  } catch (error) {
    console.error('Error cargando los datos:', error);
    // Puedes añadir aquí manejo de errores visual
  }
}
