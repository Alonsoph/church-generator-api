const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generarGuionAntesDespues(iglesia) {
  const prompt = `Eres un copywriter que escribe guiones cortos para videos de marketing dirigidos a pastores evangelicos chilenos.

Genera un guion de exactamente 4 frases cortas para un video "antes y despues" de 18 segundos sobre la iglesia "${iglesia.nombre}" en ${iglesia.comuna || "Chile"}.

ESTRUCTURA OBLIGATORIA:
- Frase 1 (3s): Plantea el problema con compasion. Empieza con "Pastor,"
- Frase 2 (4s): Transicion esperanzadora.
- Frase 3 (6s): Muestra la solucion concreta (web profesional, dominio propio, en 24 horas).
- Frase 4 (5s): Cierre con proposito misionero + call to action suave.

REGLAS:
- Tono: cercano pero respetuoso. Usar "usted".
- Nada de jerga tecnica.
- Sin emojis.
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
