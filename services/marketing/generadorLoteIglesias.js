const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.ZAI_API_KEY,
  baseURL: "https://api.z.ai/api/paas/v4",
});

async function generarLoteIglesias(cantidad = 5) {
  console.log(`[GLM-5.2] Generando ${cantidad} iglesias ficticias...`);

  const comunas = [
    "Puente Alto", "Maipú", "La Florida", "Las Condes", "San Bernardo",
    "Temuco", "Rancagua", "Antofagasta", "Viña del Mar", "Valparaíso",
    "Concepción", "Talca", "Iquique", "Arica", "Puerto Montt",
    "Quilpué", "La Serena", "Coquimbo", "Osorno", "Chillán",
    "Peñalolén", "Pudahuel", "Quilicura", "El Bosque", "Lo Prado",
    "Recoleta", "Independencia", "San Miguel", "La Cisterna", "Ñuñoa"
  ];

  const prompt = `Genera exactamente ${cantidad} perfiles de iglesias evangélicas ficticias pero realistas de Chile.

REGLAS:
- Cada iglesia debe tener una comuna diferente de esta lista: ${comunas.slice(0, cantidad).join(", ")}
- Nombres realistas de iglesias evangélicas chilenas (ej: "Iglesia Pentecostal Renacer", "Comunidad Cristiana Gracia Viva", "Iglesia Metodista Emmanuel")
- Denominaciones variadas: pentecostal, bautista, metodista, presbiteriana, alianza cristiana, evangelica libre
- Direcciones ficticias pero creibles (ej: "Av. Los Aromos 1245")
- Horarios de culto realistas (domingos, miercoles, sabados)
- Nombre del pastor ficticio pero chileno
- WhatsApp con formato +569XXXXXXXX
- Lema biblico o frase motivacional
- Descripcion de 2-3 oraciones sobre la iglesia
- 3 predicaciones recientes con titulo y breve descripcion
- 2 eventos proximos con fecha y descripcion
- 3 ministerios activos

Responde SOLO con un JSON array valido, sin markdown, sin backticks, sin texto adicional. Cada objeto del array debe tener esta estructura exacta:
{
  "nombre": "nombre completo de la iglesia",
  "comuna": "comuna",
  "direccion": "direccion ficticia",
  "denominacion": "denominacion",
  "pastor": "nombre del pastor",
  "whatsapp": "+569XXXXXXXX",
  "lema": "lema de la iglesia",
  "descripcion": "descripcion corta",
  "horarios": "Domingos 10:00 y 18:00, Miércoles 19:30",
  "predicaciones": [
    {"titulo": "titulo", "descripcion": "breve descripcion"}
  ],
  "eventos": [
    {"titulo": "titulo", "fecha": "fecha", "descripcion": "breve descripcion"}
  ],
  "ministerios": ["ministerio1", "ministerio2", "ministerio3"]
}`;

  const response = await client.chat.completions.create({
    model: "glm-5.2",
    messages: [
      { role: "system", content: "Eres un generador de datos ficticios para iglesias evangelicas chilenas. Respondes SOLO con JSON valido, sin ningun texto adicional." },
      { role: "user", content: prompt }
    ],
    temperature: 0.8,
  });

  const texto = response.choices[0].message.content.trim();
  
  let iglesias;
  try {
    const limpio = texto.replace(/```json|```/g, "").trim();
    iglesias = JSON.parse(limpio);
  } catch (e) {
    console.error("[GLM-5.2] Error parseando JSON:", texto.substring(0, 200));
    throw new Error("GLM-5.2 no devolvio JSON valido");
  }

  console.log(`[GLM-5.2] ${iglesias.length} iglesias generadas OK`);
  return iglesias;
}

module.exports = { generarLoteIglesias };
