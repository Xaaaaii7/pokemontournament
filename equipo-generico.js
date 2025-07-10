// equipo-generico.js (modificado)
import { cargarDatos, calcularKC } from './data-loader.js';

export async function renderEquipo(entrenadorId) {
  try {
    const data = await cargarDatos();
    const entrenador = data.entrenadores[entrenadorId];
    
    if (!entrenador) {
      throw new Error(`No se encontró el entrenador con ID: ${entrenadorId}`);
    }

    // Calcular estadísticas y filtrar Pokémon con battles > 0
    const pokemonsConBattles = entrenador.equipo
      .map(pokemon => ({
        ...pokemon,
        proporcion: calcularKC(pokemon)
      }))
      .filter(pokemon => pokemon.battles > 0);

    /* Header ------------------------------------------------------------- */
    const header = document.querySelector('.entrenador-header');
    if (header) {
      header.querySelector('img').src = entrenador.imagen;
      header.querySelector('h1').textContent = `Equip de ${entrenador.nombre}`;
    }

    /* Sección de Pokémon destacados -------------------------------------- */
    const destacadosContainer = document.createElement('div');
    destacadosContainer.className = 'destacados-container';
    
    // Verificar que hay Pokémon con battles > 0
    if (pokemonsConBattles.length > 0) {
      destacadosContainer.innerHTML = `
        <h2>Pokémon Destacats</h2>
        <div class="destacados-grid">
          ${renderPokemonDestacado(getPokemonMasKills(pokemonsConBattles), 'kills')}
          ${renderPokemonDestacado(getPokemonMenosMuertes(pokemonsConBattles), 'deaths')}
          ${renderPokemonDestacado(getPokemonMejorProporcion(pokemonsConBattles), 'proporcion')}
        </div>
      `;
    } else {
      destacadosContainer.innerHTML = `
        <h2>Pokémon Destacats</h2>
        <p class="no-destacados">No hi ha Pokémon amb combats registrats</p>
      `;
    }
    
    document.querySelector('main').prepend(destacadosContainer);

    /* Resto del código permanece igual... */
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

    /* Funciones auxiliares actualizadas --------------------------------- */
    function getPokemonMasKills(pokemons) {
      if (pokemons.length === 0) return null;
      return [...pokemons].sort((a, b) => {
        if (b.kills !== a.kills) return b.kills - a.kills;
        return b.proporcion - a.proporcion;
      })[0];
    }

    function getPokemonMenosMuertes(pokemons) {
      if (pokemons.length === 0) return null;
      return [...pokemons].sort((a, b) => {
        if (a.deaths !== b.deaths) return a.deaths - b.deaths;
        return b.proporcion - a.proporcion;
      })[0];
    }

    function getPokemonMejorProporcion(pokemons) {
      if (pokemons.length === 0) return null;
      return [...pokemons].sort((a, b) => {
        if (b.proporcion !== a.proporcion) return b.proporcion - a.proporcion;
        return b.kills - a.kills;
      })[0];
    }

    function renderPokemonDestacado(pokemon, tipo) {
      if (!pokemon) return '<div class="pokemon-destacado empty">No disponible</div>';
      
      const titulos = {
        kills: 'Més Kills',
        deaths: 'Menys Mortes',
        proporcion: 'Millor Proporció'
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
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error';
    errorContainer.innerHTML = `
      <p>⚠️ Error cargando los datos del equipo</p>
      <p>${error.message}</p>`;
    document.querySelector('main').prepend(errorContainer);
  }
}
