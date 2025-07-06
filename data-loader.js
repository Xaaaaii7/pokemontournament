// Función  para cargar datos JSON
async function cargarDatos() {
  const response = await fetch('data.json');
  return await response.json();
}

// Función para calcular K/C
function calcularKC(pokemon) {
  return (pokemon.battles > 0 ? (pokemon.kills / pokemon.death).toFixed(2) : '0.00');
}

// Exporta funciones y datos necesarios
export { cargarDatos, calcularKC };
