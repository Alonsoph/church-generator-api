const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generarGuionAntesDespues(iglesia) {
  const prompt = `Eres un misionero que sirve a iglesias evangelicas en Chile creando paginas web profesionales.

Genera un guion de exactamente 4 frases cortas para un video de 18 segundos sobre la iglesia "${iglesia.nombre}" en ${iglesia.comuna || "Chile"}.

TONO OBLIGATORIO: como un hermano que viene a servir, NO como un vendedor que señala problemas. Nunca critiques ni insinues que la iglesia tiene carencias. Muestra lo que pueden GANAR, no lo que les FALTA.

ESTRUCTURA:
- Frase 1 (3s): Saludo calido al pastor. Ejemplo: "Pastor, queremos bendecir a su iglesia con algo especial."
- Frase 2 (4s): Presenta el regalo/servicio como oportunidad. Ejemplo: "Creamos paginas web profesionales para iglesias como la suya."
- Frase 3 (6s): Muestra beneficio concreto (que mas personas conozcan la iglesia, dominio propio, lista en 24 horas).
- Frase 4 (5s): Cierre con proposito misionero. Ejemplo: "Somos misioneros sirviendo a la iglesia; escribanos sin compromiso."

REGLAS:
- Tono: humilde, servicial, de hermano a hermano. Usar "usted".
- Nada de jerga tecnica.
- NUNCA uses palabras como "lucha", "problema", "dificultad", "falta", "necesita", "no tiene".
- Cada frase maximo 15 palabras.
- Responde SOLO con un JSON: {"frase1": "...", "frase2": "...", "frase3": "...", "frase4": "..."}`;

  const respuesta = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const guion = JSON.parse(respuesta.choices[0].message.content);
  const textoCompleto = `${guion.frase1} ${guion.frase2} ${guion.frase3} ${guion.frase4}`;
  return { frases: guion, textoCompleto };
}

module.exports = { generarGuionAntesDespues };
