// Decide qué plantilla usar según las respuestas del cliente

const { generarPlantillaReverente } = require('./plantilla-reverente');
const { generarPlantillaContemporanea } = require('./plantilla-contemporanea');
const { generarPlantillaAcogedora } = require('./plantilla-acogedora');
const { generarPlantillaCatedral } = require('./plantilla-catedral');
const { generarPlantillaTransmision } = require('./plantilla-transmision');

function seleccionarPlantilla(respuestas) {
  // respuestas = { estilo, audiencia, tono }
  // estilo: 'tradicional' | 'contemporanea' | 'familiar'
  // audiencia: 'adultos' | 'jovenes' | 'mixta'
  // tono: 'elegante' | 'cercano' | 'energetico'

  const { estilo, audiencia, tono } = respuestas;

  // Sistema de puntajes — cada respuesta aporta puntos a una plantilla
  // NOTA: Catedral no participa en la asignación automática.
  // Solo está disponible vía el selector manual del paso 2 (preview).
  const puntajes = { reverente: 0, contemporanea: 0, acogedora: 0 };

  // Estilo de iglesia
  if (estilo === 'tradicional') puntajes.reverente += 3;
  if (estilo === 'contemporanea') puntajes.contemporanea += 3;
  if (estilo === 'familiar') puntajes.acogedora += 3;

  // Audiencia
  if (audiencia === 'adultos') puntajes.reverente += 2;
  if (audiencia === 'jovenes') puntajes.contemporanea += 2;
  if (audiencia === 'mixta') puntajes.acogedora += 2;

  // Tono
  if (tono === 'elegante') puntajes.reverente += 2;
  if (tono === 'cercano') puntajes.acogedora += 2;
  if (tono === 'energetico') puntajes.contemporanea += 2;

  // Encuentra la plantilla con más puntos
  const ganador = Object.keys(puntajes).reduce((a, b) =>
    puntajes[a] > puntajes[b] ? a : b
  );

  return ganador; // 'reverente' | 'contemporanea' | 'acogedora'
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
    case 'reverente':
    default:
      return generarPlantillaReverente(datos, contenido);
  }
}

module.exports = { seleccionarPlantilla, generarHTML };