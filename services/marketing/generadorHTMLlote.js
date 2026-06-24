const OpenAI = require("openai");
const { seleccionarPlantilla, generarHTML } = require("../../templates/selector");

const client = new OpenAI({
  apiKey: process.env.ZAI_API_KEY,
  baseURL: "https://api.z.ai/api/paas/v4",
});

async function generarHTMLdesdePerfilGLM(perfil) {
  console.log(`[GLM-HTML] Generando contenido para ${perfil.nombre}...`);

  const prompt = `Eres un copywriter para iglesias evangélicas en Chile. Genera SOLO el contenido textual para una web ya diseñada.

DATOS DE LA IGLESIA:
- Nombre: ${perfil.nombre}
- Lema: ${perfil.lema}
- Pastor: ${perfil.pastor}
- Dirección: ${perfil.direccion}, ${perfil.comuna}
- Horarios: ${perfil.horarios}

Devuelve SOLO un JSON válido con esta estructura exacta:

{
  "hero_cta": "texto botón principal, máx 3 palabras",
  "horarios_intro": "subtítulo breve, máx 8 palabras",
  "horarios": [
    {"titulo": "Culto Dominical", "horario": "${perfil.horarios}"},
    {"titulo": "Reunión de Oración", "horario": "Miércoles 19:30"},
    {"titulo": "Estudio Bíblico", "horario": "Sábados 17:00"}
  ],
  "predicaciones_intro": "subtítulo breve",
  "predicaciones": [
    {"titulo": "${perfil.predicaciones[0]?.titulo || 'El poder de la fe'}", "predicador": "Pastor ${perfil.pastor}"},
    {"titulo": "${perfil.predicaciones[1]?.titulo || 'Gracia para hoy'}", "predicador": "Pastor ${perfil.pastor}"},
    {"titulo": "${perfil.predicaciones[2]?.titulo || 'Caminando con Dios'}", "predicador": "Pastor ${perfil.pastor}"}
  ],
  "eventos_intro": "subtítulo breve",
  "eventos": [
    {"fecha_dia": "15", "fecha_mes": "JUL", "titulo": "${perfil.eventos[0]?.titulo || 'Vigilia de oración'}", "hora": "20:00"},
    {"fecha_dia": "22", "fecha_mes": "JUL", "titulo": "${perfil.eventos[1]?.titulo || 'Retiro de jóvenes'}", "hora": "09:00"},
    {"fecha_dia": "05", "fecha_mes": "AGO", "titulo": "Aniversario de la iglesia", "hora": "11:00"}
  ],
  "transmision_intro": "subtítulo breve",
  "transmision_nota": "Transmitimos en vivo cada domingo a las 10:00",
  "ministerios_intro": "subtítulo breve",
  "ministerios": [
    {"nombre": "${perfil.ministerios[0] || 'Ministerio de Alabanza'}", "descripcion": "breve descripción", "lider": "nombre chileno"},
    {"nombre": "${perfil.ministerios[1] || 'Ministerio de Jóvenes'}", "descripcion": "breve descripción", "lider": "nombre chileno"},
    {"nombre": "${perfil.ministerios[2] || 'Ministerio de Mujeres'}", "descripcion": "breve descripción", "lider": "nombre chileno"}
  ],
  "nuevos_intro": "subtítulo breve",
  "pasos_nuevos": [
    "Frase acogedora 1",
    "Frase acogedora 2",
    "Frase acogedora 3",
    "Frase acogedora 4"
  ],
  "donaciones_intro": "subtítulo breve",
  "blog_intro": "subtítulo breve",
  "posts": [
    {"fecha": "10 Jul 2026", "titulo": "Título del devocional"},
    {"fecha": "03 Jul 2026", "titulo": "Título del devocional"},
    {"fecha": "27 Jun 2026", "titulo": "Título del devocional"}
  ]
}

REGLAS:
- Devuelve SOLO el JSON, sin markdown, sin backticks, sin explicaciones.
- Textos en español chileno, naturales y cálidos.
- NO uses la palabra "sermón", usa "predicación" o "mensaje".
- Inventa nombres realistas chilenos para líderes de ministerios.`;

  const response = await client.chat.completions.create({
    model: "glm-5.2",
    messages: [
      { role: "system", content: "Respondes SOLO con JSON valido, sin texto adicional." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });

  const texto = response.choices[0].message.content.trim();
  const limpio = texto.replace(/```json|```/g, "").trim();
  const contenido = JSON.parse(limpio);

  // Armar datos en el formato que espera generarHTML
  const datos = {
    iglesia: { nombre: perfil.nombre, lema: perfil.lema },
    ubicacion: { direccion: `${perfil.direccion}, ${perfil.comuna}`, ciudad: perfil.comuna },
    redes_sociales: { whatsapp: perfil.whatsapp },
    funcionalidades_activas: {
      horarios_ubicacion: true,
      biblioteca_sermones: true,
      calendario_eventos: true,
      transmision_vivo: true,
      ministerios: true,
      pagina_nuevos_visitantes: true,
      donaciones: true,
      blog_devocionales: true,
    },
    preferencias_diseno: {
      estilo: "Tradicional",
      audiencia: "Toda edad",
      tono: "Cercano",
    },
  };

  const plantilla = seleccionarPlantilla(datos.preferencias_diseno);
  const html = generarHTML(plantilla, datos, contenido);

  console.log(`[GLM-HTML] HTML generado para ${perfil.nombre} (plantilla: ${plantilla})`);
  return { html, plantilla, contenido };
}

module.exports = { generarHTMLdesdePerfilGLM };
