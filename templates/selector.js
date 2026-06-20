// Decide qué plantilla usar según las respuestas del cliente

const { generarPlantillaReverente } = require('./plantilla-reverente');
const { generarPlantillaContemporanea } = require('./plantilla-contemporanea');
const { generarPlantillaAcogedora } = require('./plantilla-acogedora');
const { generarPlantillaCatedral } = require('./plantilla-catedral');
const { generarPlantillaTransmision } = require('./plantilla-transmision');
const { generarPlantillaMision } = require('./plantilla-mision');

function seleccionarPlantilla(respuestas) {
  const { estilo, audiencia, tono } = respuestas;

  // Catedral, Transmisión y Misión solo se acceden por selector manual.
  const puntajes = { reverente: 0, contemporanea: 0, acogedora: 0 };

  if (estilo === 'tradicional') puntajes.reverente += 3;
  if (estilo === 'contemporanea') puntajes.contemporanea += 3;
  if (estilo === 'familiar') puntajes.acogedora += 3;

  if (audiencia === 'adultos') puntajes.reverente += 2;
  if (audiencia === 'jovenes') puntajes.contemporanea += 2;
  if (audiencia === 'mixta') puntajes.acogedora += 2;

  if (tono === 'elegante') puntajes.reverente += 2;
  if (tono === 'cercano') puntajes.acogedora += 2;
  if (tono === 'energetico') puntajes.contemporanea += 2;

  const ganador = Object.keys(puntajes).reduce((a, b) =>
    puntajes[a] > puntajes[b] ? a : b
  );

  return ganador;
}

function generarHTML(plantilla, datos, contenido) {
  switch (plantilla) {
    case 'contemporanea':
      return generarPlantillaContemporanea(datos, contenido);
    case 'acogedora':
      return generarPlantillaAcogedora(datos, contenido);
    case 'catedral':
      return generarPlantillaCatedral(datos, contenido);
    case 'transmision':
      return generarPlantillaTransmision(datos, contenido);
    case 'mision':
      return generarPlantillaMision(datos, contenido);
    case 'reverente':
    default:
      return generarPlantillaReverente(datos, contenido);
  }
}

module.exports = { seleccionarPlantilla, generarHTML };