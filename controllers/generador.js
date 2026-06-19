const axios = require('axios');
const { seleccionarPlantilla, generarHTML } = require('../templates/selector');// NOTA: Este archivo ahora usa DeepSeek en lugar de Claude.
// DeepSeek es compatible con el formato de OpenAI.

// ============================================
// MODO 1: PLANTILLA FIJA (gratis, instantánea)
// ============================================
function construirHTML(datos) {
  const nombre = datos.iglesia?.nombre || 'Iglesia';
  const lema = datos.iglesia?.lema || '';
  const direccion = datos.ubicacion?.direccion || '';
  const ciudad = datos.ubicacion?.ciudad || '';
  const whatsapp = datos.redes_sociales?.whatsapp || '';
  const func = datos.funcionalidades_activas || {};

  let secciones = '';

  secciones += `
<section class="bienvenida">
<h2>Bienvenidos a ${nombre}</h2>
<p class="subtitulo">${lema}</p>
<p>Nos alegra que nos visites. Somos una comunidad de fe donde todos son bienvenidos.</p>
</section>`;

  if (func.horarios_ubicacion) {
    secciones += `
<section class="horarios">
<h2>Horarios y Ubicación</h2>
<p class="subtitulo">Te esperamos cada semana</p>
<div class="grid-horarios">
<div class="horario-card"><h3>Servicio Principal</h3><p>Domingo 10:00 AM</p></div>
<div class="horario-card"><h3>Estudio Bíblico</h3><p>Miércoles 19:00 PM</p></div>
<div class="horario-card"><h3>Oración</h3><p>Viernes 20:00 PM</p></div>
</div>
<div class="ubicacion-box"><strong>Dirección:</strong> ${direccion}${ciudad ? ', ' + ciudad : ''}</div>
</section>`;
  }

  if (func.biblioteca_sermones) {
    secciones += `
<section class="sermones">
<h2>Biblioteca de Sermones</h2>
<p class="subtitulo">Escucha y crece en tu fe</p>
<div class="grid-sermones">
<div class="sermon"><div class="sermon-titulo">El poder de la fe</div><div class="sermon-predicador">Pastor Juan</div><button class="btn-escuchar">▶ Escuchar</button></div>
<div class="sermon"><div class="sermon-titulo">Caminando en gracia</div><div class="sermon-predicador">Pastor Juan</div><button class="btn-escuchar">▶ Escuchar</button></div>
<div class="sermon"><div class="sermon-titulo">Una esperanza viva</div><div class="sermon-predicador">Pastora María</div><button class="btn-escuchar">▶ Escuchar</button></div>
</div>
</section>`;
  }

  if (func.calendario_eventos) {
    secciones += `
<section class="eventos">
<h2>Próximos Eventos</h2>
<p class="subtitulo">No te pierdas nuestras actividades</p>
<div class="lista-eventos">
<div class="evento"><div class="evento-fecha">15 JUN</div><div class="evento-info"><h3>Vigilia de Oración</h3><span class="evento-hora">20:00 hrs</span></div></div>
<div class="evento"><div class="evento-fecha">22 JUN</div><div class="evento-info"><h3>Encuentro de Jóvenes</h3><span class="evento-hora">18:00 hrs</span></div></div>
<div class="evento"><div class="evento-fecha">05 JUL</div><div class="evento-info"><h3>Retiro Espiritual</h3><span class="evento-hora">09:00 hrs</span></div></div>
</div>
</section>`;
  }

  if (func.transmision_vivo) {
    secciones += `
<section class="transmision">
<h2>Transmisión en Vivo</h2>
<p class="subtitulo">Acompáñanos desde donde estés</p>
<div class="video-player">
<div class="placeholder-video">📺 Aquí se mostrará la transmisión en vivo</div>
<p class="nota-video">Transmitimos cada domingo a las 10:00 AM</p>
</div>
</section>`;
  }

  if (func.ministerios) {
    secciones += `
<section class="ministerios">
<h2>Nuestros Ministerios</h2>
<p class="subtitulo">Hay un lugar para ti en nuestra comunidad</p>
<div class="grid-tarjetas">
<div class="tarjeta"><h3>Ministerio de Jóvenes</h3><p>Para jóvenes entre 18 y 35 años</p><span class="lider">Líder: Pastor Juan</span></div>
<div class="tarjeta"><h3>Ministerio Infantil</h3><p>Enseñanza y actividades para niños</p><span class="lider">Líder: Pastora María</span></div>
<div class="tarjeta"><h3>Ministerio de Música</h3><p>Alabanza y adoración</p><span class="lider">Líder: Director David</span></div>
</div>
</section>`;
  }

  if (func.formulario_contacto) {
    const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#';
    secciones += `
<section class="contacto">
<h2>Contáctanos</h2>
<p class="subtitulo">Estamos aquí para ti. Escríbenos por WhatsApp o déjanos un mensaje</p>
<div class="form-contacto">
<input type="text" placeholder="Tu nombre">
<input type="email" placeholder="Tu correo">
<textarea rows="4" placeholder="Tu mensaje o petición de oración"></textarea>
<a href="${waLink}" class="btn-whatsapp">💬 Enviar por WhatsApp</a>
<button class="btn-enviar">Enviar por correo</button>
</div>
</section>`;
  }

  if (func.pagina_nuevos_visitantes) {
    secciones += `
<section class="nuevos">
<h2>¿Es tu primera vez?</h2>
<p class="subtitulo">Queremos que te sientas como en casa</p>
<div class="contenido-nuevos">
<div class="lista-nuevos">
<div class="item-nuevo"><span class="icon">1</span> Llega unos minutos antes y te recibiremos con gusto</div>
<div class="item-nuevo"><span class="icon">2</span> Vístete cómodo, no hay código de vestimenta</div>
<div class="item-nuevo"><span class="icon">3</span> Tenemos espacio para tus niños durante el servicio</div>
<div class="item-nuevo"><span class="icon">4</span> Quédate después para un café y conocernos</div>
</div>
</div>
</section>`;
  }

  if (func.donaciones) {
    secciones += `
<section class="donaciones">
<h2>Donaciones y Ofrendas</h2>
<p class="subtitulo">Tu generosidad sostiene la obra</p>
<div class="metodos-donacion">
<div class="metodo">💳 Tarjeta de Crédito</div>
<div class="metodo">🏦 Transferencia Bancaria</div>
<div class="metodo">📱 Pago Móvil</div>
</div>
<button class="btn-donar">Quiero Donar</button>
</section>`;
  }

  if (func.galeria_fotos) {
    secciones += `
<section class="galeria">
<h2>Galería</h2>
<p class="subtitulo">Momentos de nuestra comunidad</p>
<div class="grid-galeria">
<div class="foto-placeholder">📷</div><div class="foto-placeholder">📷</div><div class="foto-placeholder">📷</div>
<div class="foto-placeholder">📷</div><div class="foto-placeholder">📷</div><div class="foto-placeholder">📷</div>
</div>
</section>`;
  }

  if (func.blog_devocionales) {
    secciones += `
<section class="blog">
<h2>Devocionales</h2>
<p class="subtitulo">Alimenta tu espíritu cada semana</p>
<div class="lista-posts">
<div class="post"><span class="post-fecha">10 Jun 2026</span><h3>La importancia de la oración diaria</h3><a href="#" class="leer-mas">Leer más →</a></div>
<div class="post"><span class="post-fecha">03 Jun 2026</span><h3>Cómo encontrar paz en tiempos difíciles</h3><a href="#" class="leer-mas">Leer más →</a></div>
<div class="post"><span class="post-fecha">27 May 2026</span><h3>El amor que transforma</h3><a href="#" class="leer-mas">Leer más →</a></div>
</div>
</section>`;
  }

  if (func.redes_sociales) {
    const redes = datos.redes_sociales || {};
    secciones += `
<section class="redes">
<h2>Síguenos</h2>
<p class="subtitulo">Conéctate con nosotros en redes sociales</p>
<div class="iconos-redes">
${redes.facebook ? '<a href="' + redes.facebook + '" class="red-social">Facebook</a>' : '<span class="red-social">Facebook</span>'}
${redes.instagram ? '<a href="' + redes.instagram + '" class="red-social">Instagram</a>' : '<span class="red-social">Instagram</span>'}
${redes.youtube ? '<a href="' + redes.youtube + '" class="red-social">YouTube</a>' : '<span class="red-social">YouTube</span>'}
${whatsapp ? '<a href="https://wa.me/' + whatsapp.replace(/[^0-9]/g, '') + '" class="red-social">WhatsApp</a>' : '<span class="red-social">WhatsApp</span>'}
</div>
</section>`;
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${nombre}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; color: #2C3E50; line-height: 1.6; }
header { background: linear-gradient(135deg, #2C5AA0, #1a3a6a); color: white; padding: 80px 20px; text-align: center; }
header h1 { font-size: 2.8em; margin-bottom: 10px; }
header p { font-size: 1.3em; opacity: 0.9; }
section { padding: 50px 20px; max-width: 1000px; margin: 0 auto; }
h2 { color: #2C5AA0; margin-bottom: 8px; text-align: center; font-size: 2em; }
.subtitulo { color: #7F8C8D; text-align: center; margin-bottom: 35px; font-size: 1em; }
button, .btn-whatsapp, .btn-donar { cursor: pointer; }
footer { background: #2C3E50; color: white; text-align: center; padding: 30px 20px; }
.bienvenida { text-align: center; }
.bienvenida p:last-child { max-width: 600px; margin: 0 auto; }
.horarios { background: #F8F9FA; max-width: 100%; }
.grid-horarios { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; max-width: 900px; margin: 0 auto 30px; }
.horario-card { background: white; padding: 25px 35px; border-radius: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.horario-card h3 { color: #2C5AA0; margin-bottom: 8px; }
.ubicacion-box { background: white; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #F39C12; }
.sermones { background: white; max-width: 100%; }
.grid-sermones { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; max-width: 900px; margin: 0 auto; }
.sermon { background: #F8F9FA; padding: 25px; border-radius: 10px; width: 220px; text-align: center; }
.sermon-titulo { font-weight: bold; color: #2C5AA0; margin-bottom: 8px; font-size: 1.1em; }
.sermon-predicador { color: #7F8C8D; font-size: 0.9em; margin-bottom: 15px; }
.btn-escuchar { background: #F39C12; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; }
.eventos { background: #F8F9FA; max-width: 100%; }
.lista-eventos { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
.evento { display: flex; align-items: center; background: white; border-radius: 10px; overflow: hidden; border-left: 5px solid #F39C12; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
.evento-fecha { background: #2C5AA0; color: white; padding: 20px; font-weight: bold; min-width: 90px; text-align: center; }
.evento-info { padding: 15px 20px; }
.evento-info h3 { color: #2C3E50; font-size: 1.1em; }
.evento-hora { color: #F39C12; font-weight: bold; font-size: 0.9em; }
.transmision { background: white; max-width: 100%; text-align: center; }
.video-player { max-width: 600px; margin: 0 auto; }
.placeholder-video { background: #2C3E50; color: white; padding: 90px 20px; border-radius: 10px; font-size: 1.1em; }
.nota-video { margin-top: 15px; color: #7F8C8D; }
.ministerios { background: #F8F9FA; max-width: 100%; }
.grid-tarjetas { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; max-width: 900px; margin: 0 auto; }
.tarjeta { background: white; border-radius: 12px; padding: 25px; width: 250px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.tarjeta h3 { color: #2C5AA0; margin-bottom: 10px; }
.tarjeta p { margin-bottom: 15px; }
.lider { display: block; color: #F39C12; font-weight: bold; font-size: 0.9em; }
.contacto { background: white; max-width: 100%; }
.form-contacto { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
.form-contacto input, .form-contacto textarea { padding: 12px; border: 1px solid #BDC3C7; border-radius: 5px; font-family: Arial; font-size: 1em; }
.btn-whatsapp { background: #25D366; color: white; text-decoration: none; padding: 14px; border-radius: 5px; font-weight: bold; text-align: center; }
.btn-enviar { background: #2C5AA0; color: white; border: none; padding: 12px; border-radius: 5px; font-weight: bold; }
.nuevos { background: #F8F9FA; max-width: 100%; text-align: center; }
.contenido-nuevos { max-width: 600px; margin: 0 auto; }
.lista-nuevos { display: flex; flex-direction: column; gap: 18px; margin-top: 20px; text-align: left; }
.item-nuevo { display: flex; align-items: center; gap: 15px; font-size: 1.05em; }
.icon { background: #2C5AA0; color: white; min-width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.donaciones { background: white; max-width: 100%; text-align: center; }
.metodos-donacion { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px; }
.metodo { background: #F8F9FA; padding: 20px 30px; border-radius: 10px; border: 2px solid #ECF0F1; }
.btn-donar { background: #F39C12; color: white; border: none; padding: 15px 40px; border-radius: 8px; font-size: 1.1em; font-weight: bold; }
.galeria { background: #F8F9FA; max-width: 100%; }
.grid-galeria { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 800px; margin: 0 auto; }
.foto-placeholder { background: white; aspect-ratio: 1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2.5em; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.blog { background: white; max-width: 100%; }
.lista-posts { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.post { background: #F8F9FA; padding: 25px; border-radius: 10px; }
.post-fecha { color: #F39C12; font-size: 0.85em; font-weight: bold; }
.post h3 { color: #2C5AA0; margin: 8px 0; }
.leer-mas { color: #2C5AA0; text-decoration: none; font-weight: bold; }
.redes { background: #F8F9FA; max-width: 100%; text-align: center; }
.iconos-redes { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
.red-social { background: #2C5AA0; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; }
@media (max-width: 600px) {
  header h1 { font-size: 2em; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }
}
</style>
</head>
<body>
<header>
<h1>${nombre}</h1>
<p>${lema}</p>
</header>
${secciones}
<footer>
<p>${nombre} — Todos los derechos reservados</p>
</footer>
</body>
</html>`;
}

// ============================================
// MODO 2: GENERACIÓN CON CLAUDE (personalizada)
// ============================================
function construirPrompt(datos) {
  const func = datos.funcionalidades_activas || {};
  const iglesia = datos.iglesia || {};
  
  const seccionesActivas = [];
  if (func.horarios_ubicacion) seccionesActivas.push('horarios');
  if (func.biblioteca_sermones) seccionesActivas.push('predicaciones');
  if (func.calendario_eventos) seccionesActivas.push('eventos');
  if (func.transmision_vivo) seccionesActivas.push('transmision');
  if (func.ministerios) seccionesActivas.push('ministerios');
  if (func.pagina_nuevos_visitantes) seccionesActivas.push('nuevos');
  if (func.donaciones) seccionesActivas.push('donaciones');
  if (func.blog_devocionales) seccionesActivas.push('blog');

  return `Eres un copywriter para iglesias evangélicas en Chile. Tu trabajo es generar SOLO el contenido textual para una web ya diseñada.

DATOS DE LA IGLESIA:
- Nombre: ${iglesia.nombre || 'Iglesia'}
- Lema: ${iglesia.lema || ''}

Genera contenido cálido, espiritual y contemporáneo. Tono acogedor pero no anticuado. NO uses la palabra "sermón", usa "predicación" o "mensaje" (contexto chileno).

Devuelve SOLO un JSON válido con esta estructura exacta (incluye solo las claves de las secciones activas: ${seccionesActivas.join(', ')}):

{
  "hero_cta": "texto botón principal, máx 3 palabras",
  "horarios_intro": "subtítulo breve, máx 8 palabras",
  "horarios": [
    {"titulo": "nombre del servicio", "horario": "día y hora"},
    {"titulo": "...", "horario": "..."},
    {"titulo": "...", "horario": "..."}
  ],
  "predicaciones_intro": "subtítulo breve",
  "predicaciones": [
    {"titulo": "título inventado", "predicador": "Pastor/Pastora Nombre"},
    {"titulo": "...", "predicador": "..."},
    {"titulo": "...", "predicador": "..."}
  ],
  "eventos_intro": "subtítulo breve",
  "eventos": [
    {"fecha_dia": "15", "fecha_mes": "JUN", "titulo": "nombre del evento", "hora": "20:00"},
    {"fecha_dia": "22", "fecha_mes": "JUN", "titulo": "...", "hora": "..."},
    {"fecha_dia": "05", "fecha_mes": "JUL", "titulo": "...", "hora": "..."}
  ],
  "transmision_intro": "subtítulo breve",
  "transmision_nota": "frase explicando cuándo transmiten",
  "ministerios_intro": "subtítulo breve",
  "ministerios": [
    {"nombre": "Ministerio de ...", "descripcion": "breve descripción", "lider": "Nombre"},
    {"nombre": "...", "descripcion": "...", "lider": "..."},
    {"nombre": "...", "descripcion": "...", "lider": "..."}
  ],
  "nuevos_intro": "subtítulo breve",
  "pasos_nuevos": [
    "Frase corta y acogedora 1",
    "Frase corta y acogedora 2",
    "Frase corta y acogedora 3",
    "Frase corta y acogedora 4"
  ],
  "donaciones_intro": "subtítulo breve",
  "blog_intro": "subtítulo breve",
  "posts": [
    {"fecha": "10 Jun 2026", "titulo": "Título del devocional"},
    {"fecha": "03 Jun 2026", "titulo": "..."},
    {"fecha": "27 May 2026", "titulo": "..."}
  ]
}

REGLAS:
- Devuelve SOLO el JSON, sin markdown, sin \`\`\`, sin explicaciones.
- Solo incluye las claves de las secciones activas.
- Textos en español chileno, naturales y cálidos.
- Inventa nombres realistas chilenos para predicadores y líderes (Juan Pérez, María González, etc.).`;
}
async function generarConIA(datos) {
  const prompt = construirPrompt(datos);

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'openai/gpt-oss-120b',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'content-type': 'application/json',
      },
    }
  );

  let respuesta = response.data.choices[0].message.content;
  
  // Parsear JSON
  let contenido = {};
  try {
    // Limpiar por si viene con markdown
    respuesta = respuesta.replace(/```json/g, '').replace(/```/g, '').trim();
    contenido = JSON.parse(respuesta);
  } catch (err) {
    console.error('Error parseando JSON de IA:', err);
    contenido = {}; // Fallback: usa los valores por defecto de la plantilla
  }
  
// Generar HTML usando plantilla + contenido
  console.log('PREFERENCIAS RECIBIDAS:', JSON.stringify(datos.preferencias_diseno));
  const plantillaElegida = datos.plantilla_forzada || seleccionarPlantilla(datos.preferencias_diseno || {});
  console.log('PLANTILLA ELEGIDA:', plantillaElegida);
  const html = generarHTML(plantillaElegida, datos, contenido);
  return { html, plantillaElegida, contenido };
}// ============================================
// CONTROLADORES
// ============================================
exports.generarPagina = async (req, res) => {
  try {
    const usarIA = req.body.usar_ia === true;
    let html, plantillaElegida, contenido;

    if (usarIA) {
      const resultado = await generarConIA(req.body);
      html = resultado.html;
      plantillaElegida = resultado.plantillaElegida;
      contenido = resultado.contenido;
    } else {
      html = construirHTML(req.body);
      plantillaElegida = 'reverente';
      contenido = {};
    }

    res.json({
      exito: true,
      html: html,
      modo: usarIA ? 'Claude IA' : 'Plantilla',
      mensaje: 'Página generada exitosamente',
      plantilla_usada: plantillaElegida,
      datos_generados: { datos: req.body, contenido },
    });  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al generar la página',
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

exports.cambiarPlantilla = (req, res) => {
  try {
    const { plantilla, datos, contenido } = req.body;

    if (!plantilla || !datos || !contenido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Faltan datos: plantilla, datos o contenido',
      });
    }

    const html = generarHTML(plantilla, datos, contenido);

    res.json({
      exito: true,
      html: html,
      plantilla_usada: plantilla,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cambiar plantilla',
      error: error.message,
    });
  }
};
exports.mostrarPreview = (req, res) => {
  const datosEjemplo = {
    iglesia: { nombre: 'Iglesia Pentecostal Vida Nueva', lema: 'Transformados por su gracia' },
    ubicacion: { direccion: 'Calle Principal 456', ciudad: 'Santiago' },
    redes_sociales: { whatsapp: '+56912345678', facebook: '#', instagram: '#', youtube: '#' },
    funcionalidades_activas: {
      horarios_ubicacion: true, biblioteca_sermones: true, calendario_eventos: true,
      transmision_vivo: true, ministerios: true, formulario_contacto: true,
      pagina_nuevos_visitantes: true, donaciones: true, galeria_fotos: true,
      blog_devocionales: true, redes_sociales: true,
    },
  };
  res.send(construirHTML(datosEjemplo));
};

// ============================================
// APROBACIÓN
// ============================================
exports.aprobarIglesia = async (req, res) => {
  const pool = require('../config/db');
  try {
    const {
      nombre_iglesia,
      email_contacto,
      whatsapp_contacto,
      html_generado,
      sugerencias_cliente,
      plan_seleccionado,
      codigo_referencia,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO iglesias_aprobadas 
      (nombre_iglesia, email_contacto, whatsapp_contacto, html_generado, sugerencias_cliente, plan_seleccionado, codigo_referencia)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, fecha_creacion`,
      [
        nombre_iglesia,
        email_contacto,
        whatsapp_contacto,
        html_generado,
        sugerencias_cliente,
        plan_seleccionado,
        codigo_referencia || null,
      ]
    );

    res.json({
      exito: true,
      id: result.rows[0].id,
      mensaje: 'Aprobación guardada exitosamente',
    });
  } catch (error) {
    console.error('Error al aprobar:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al guardar la aprobación',
      error: error.message,
    });
  }
};