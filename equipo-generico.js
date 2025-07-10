// equipo-generico.js
import { cargarDatos, calcularKC } from './data-loader.js';

export async function renderEquipo(entrenadorId) {
  try {
    const data = await cargarDatos();
    const entrenador = data.entrenadores[entrenadorId];
    
    if (!entrenador) {
      throw new Error(`No se encontró el entrenador con ID: ${entrenadorId}`);
    }

    // Calcular estadísticas para cada Pokémon
    entrenador.equipo.forEach(pokemon => {
      pokemon.proporcion = calcularKC(pokemon);
    });

    /* Header ------------------------------------------------------------- */
    const header = document.querySelector('.entrenador-header');
    if (header) {
      header.querySelector('img').src = entrenador.imagen;
      header.querySelector('h1').textContent = `Equip de ${entrenador.nombre}`;
    }

    /* Sección de Pokémon destacados -------------------------------------- */
    const destacadosContainer = document.createElement('div');
    destacadosContainer.className = 'destacados-container';
    destacadosContainer.innerHTML = `
      <h2>Pokémon Destacats</h2>
      <div class="destacados-grid">
        ${renderPokemonDestacado(getPokemonMasKills(entrenador.equipo), 'kills')}
        ${renderPokemonDestacado(getPokemonMenosMuertes(entrenador.equipo), 'deaths')}
        ${renderPokemonDestacado(getPokemonMejorProporcion(entrenador.equipo), 'proporcion')}
      </div>
    `;
    document.querySelector('main').prepend(destacadosContainer);

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

    /* Funciones auxiliares --------------------------------------------- */
    function getPokemonMasKills(pokemons) {
      // Ordenar por kills (descendente) y luego por proporción (descendente)
      return [...pokemons].sort((a, b) => {
        if (b.kills !== a.kills) return b.kills - a.kills;
        return b.proporcion - a.proporcion;
      })[0];
    }

    function getPokemonMenosMuertes(pokemons) {
      // Ordenar por deaths (ascendente) y luego por proporción (descendente)
      return [...pokemons].sort((a, b) => {
        if (a.deaths !== b.deaths) return a.deaths - b.deaths;
        return b.proporcion - a.proporcion;
      })[0];
    }

    function getPokemonMejorProporcion(pokemons) {
      // Ordenar por proporción (descendente) y luego por kills (descendente)
      return [...pokemons].sort((a, b) => {
        if (b.proporcion !== a.proporcion) return b.proporcion - a.proporcion;
        return b.kills - a.kills;
      })[0];
    }

    function renderPokemonDestacado(pokemon, tipo) {
      const titulos = {
        kills: 'Més Kills',
        deaths: 'Menys Morts',
        proporcion: 'Pokemon Equilibrat'
      };
      
      const valores = {
        kills: pokemon.kills,
        deaths: pokemon.deaths,
        proporcion: pokemon.proporcion.toFixed(2)
      };
      
      const iconos = {
        kills: '🗡️',
        deaths: '☠️',
        proporcion: '⚡'
      };

      return `
        <div class="pokemon-destacado ${tipo}">
          <div class="destacado-header">
            <h3>${titulos[tipo]}</h3>
            <span class="valor-destacado">${iconos[tipo]} ${valores[tipo]}</span>
          </div>
          <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
          <h4>${pokemon.nombre}</h4>
          <div class="stats">
            <span>🗡️ ${pokemon.kills}K</span>
            <span>☠️ ${pokemon.deaths}M</span>
            <span>⚔️ ${pokemon.battles}C</span>
          </div>
        </div>`;
    }

    function renderCard(p) {
      return `
        <div class="pokemon-horizontal">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3><a href="https://www.wikidex.net/wiki/${p.nombre}">${p.nombre}</a></h3>
          <div class="stats">
            <span><span class="icon-stat">🗡️</span> ${p.kills}K</span>
            <span><span class="icon-stat">☠️</span> ${p.deaths}M</span>
            <span><span class="icon-stat">⚔️</span> ${p.battles}C</span>
            <span><span class="icon-stat">⚡</span> ${p.proporcion.toFixed(2)}K/C</span>
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
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error';
    errorContainer.innerHTML = `
      <p>⚠️ Error cargando los datos del equipo</p>
      <p>${error.message}</p>`;
    document.querySelector('main').prepend(errorContainer);
  }
}
