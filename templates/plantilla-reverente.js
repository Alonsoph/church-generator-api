// Plantilla HTML base. Los textos van entre {{PLACEHOLDERS}} que se reemplazan después.

function generarPlantilla(datos, contenido) {
  const nombre = datos.iglesia?.nombre || 'Iglesia';
  const lema = datos.iglesia?.lema || '';
  const direccion = datos.ubicacion?.direccion || '';
  const ciudad = datos.ubicacion?.ciudad || '';
  const whatsapp = datos.redes_sociales?.whatsapp || '';
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#';
  const func = datos.funcionalidades_activas || {};
  const logo = datos.multimedia?.logo || '';
  const fotoPrincipal = datos.multimedia?.fotoPrincipal || '';

  // Construcción de secciones según las activas
  let navLinks = '';
  let secciones = '';

  if (func.horarios_ubicacion) {
    navLinks += `<a href="#horarios" class="nav-link">Horarios</a>`;
    secciones += seccionHorarios(contenido, direccion, ciudad);
  }
  if (func.biblioteca_sermones) {
    navLinks += `<a href="#predicaciones" class="nav-link">Predicaciones</a>`;
    secciones += seccionPredicaciones(contenido);
  }
  if (func.calendario_eventos) {
    navLinks += `<a href="#eventos" class="nav-link">Eventos</a>`;
    secciones += seccionEventos(contenido);
  }
  if (func.transmision_vivo) {
    navLinks += `<a href="#transmision" class="nav-link">En vivo</a>`;
    secciones += seccionTransmision(contenido);
  }
  if (func.ministerios) {
    navLinks += `<a href="#ministerios" class="nav-link">Ministerios</a>`;
    secciones += seccionMinisterios(contenido);
  }
  if (func.formulario_contacto) {
    navLinks += `<a href="#contacto" class="nav-link">Contacto</a>`;
    secciones += seccionContacto(whatsappLink);
  }
  if (func.pagina_nuevos_visitantes) {
    navLinks += `<a href="#nuevos" class="nav-link">Nuevos</a>`;
    secciones += seccionNuevos(contenido);
  }
  if (func.donaciones) {
    navLinks += `<a href="#donaciones" class="nav-link">Donar</a>`;
    secciones += seccionDonaciones(contenido);
  }
  if (func.galeria_fotos) {
    navLinks += `<a href="#galeria" class="nav-link">Galería</a>`;
    secciones += seccionGaleria();
  }
  if (func.blog_devocionales) {
    navLinks += `<a href="#blog" class="nav-link">Devocionales</a>`;
    secciones += seccionBlog(contenido);
  }
  if (func.redes_sociales) {
    navLinks += `<a href="#redes" class="nav-link">Redes</a>`;
    secciones += seccionRedes(whatsappLink, datos.redes_sociales || {});
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<base target="_self">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${nombre}</title>
<meta property="og:title" content="${nombre}">
<meta property="og:description" content="${lema || 'Iglesia evangélica en Chile'}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://${nombre.toLowerCase().replace(/\s+/g, '-')}.tuwebiglesia.cl">
<meta property="og:image" content="${fotoPrincipal || logo || 'https://tuwebiglesia.cl/og-default.jpg'}">
<meta property="og:locale" content="es_CL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${nombre}">
<meta name="twitter:description" content="${lema || 'Iglesia evangélica en Chile'}">
<meta name="twitter:image" content="${fotoPrincipal || logo || 'https://tuwebiglesia.cl/og-default.jpg'}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${cssBase()}
</style>
</head>
<body>

<input type="checkbox" id="menu-toggle" class="menu-toggle">
<nav class="navbar">
  <div class="nav-container">
    ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : `<div class="logo-text">${nombre}</div>`}
    <label for="menu-toggle" class="hamburger">
      <span></span><span></span><span></span>
    </label>
<div class="nav-links" onclick="var t=event.target;if(t.tagName==='A'){event.preventDefault();var h=t.getAttribute('href');if(h&&h.startsWith('#')){var el=document.getElementById(h.substring(1));if(el){el.scrollIntoView({behavior:'smooth',block:'start'});}}document.getElementById('menu-toggle').checked=false;}">
  ${navLinks}
</div>
</div></nav>

<header class="hero" ${fotoPrincipal ? `style="background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${fotoPrincipal}')"` : ''}>
  <div class="hero-content">
    <h1>${nombre}</h1>
    <p class="lema">${lema}</p>
    <a href="#contacto" class="btn-cta">${contenido.hero_cta || 'Conócenos'}</a>
  </div>
</header>

<main>
${secciones}
</main>

<footer>
  <div class="footer-content">
    <h3>${nombre}</h3>
    <p>${direccion}${ciudad ? ', ' + ciudad : ''}</p>
    ${whatsapp ? `<p><a href="${whatsappLink}">${whatsapp}</a></p>` : ''}
    <p class="footer-copy">© ${new Date().getFullYear()} ${nombre}. Todos los derechos reservados.</p>
  </div>
</footer>

</body>
</html>`;
}

// ============================================
// SECCIONES INDIVIDUALES
// ============================================

function seccionHorarios(c, direccion, ciudad) {
  const horarios = c.horarios || [
    { titulo: 'Servicio Dominical', horario: 'Domingo · 10:00 AM' },
    { titulo: 'Estudio Bíblico', horario: 'Miércoles · 19:00 PM' },
    { titulo: 'Oración', horario: 'Viernes · 20:00 PM' },
  ];
  
  const direccionCompleta = `${direccion}${ciudad ? ', ' + ciudad : ''}`;
  const direccionUrl = encodeURIComponent(direccionCompleta);
  const mapaSrc = `https://www.google.com/maps?q=${direccionUrl}&output=embed`;
  
  return `
<section id="horarios" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Horarios y Ubicación</h2>
    <p class="subtitulo">${c.horarios_intro || 'Te esperamos cada semana'}</p>
    <div class="grid-3">
      ${horarios.map(h => `
        <div class="card">
          <h3>${h.titulo}</h3>
          <p>${h.horario}</p>
        </div>
      `).join('')}
    </div>
    <div class="ubicacion-box">
      <strong>Dirección:</strong> ${direccionCompleta}
    </div>
    ${direccion ? `
    <div class="mapa-contenedor">
      <iframe 
        src="${mapaSrc}" 
        width="100%" 
        height="400" 
        style="border:0; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.08);" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
    ` : ''}
  </div>
</section>`;
}
function seccionPredicaciones(c) {
  const predicaciones = c.predicaciones || [
    { titulo: 'El poder de la fe', predicador: 'Pastor Juan Pérez' },
    { titulo: 'Caminando en gracia', predicador: 'Pastor Juan Pérez' },
    { titulo: 'Una esperanza viva', predicador: 'Pastora María' },
  ];
  return `
<section id="predicaciones" class="seccion">
  <div class="contenedor">
    <h2>Predicaciones</h2>
    <p class="subtitulo">${c.predicaciones_intro || 'Escucha y crece en tu fe'}</p>
    <div class="grid-3">
      ${predicaciones.map(p => `
        <div class="card">
          <h3>${p.titulo}</h3>
          <p class="meta">${p.predicador}</p>
          <button class="btn-secundario">Escuchar</button>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionEventos(c) {
  const eventos = c.eventos || [
    { fecha_dia: '15', fecha_mes: 'JUN', titulo: 'Vigilia de Oración', hora: '20:00' },
    { fecha_dia: '22', fecha_mes: 'JUN', titulo: 'Encuentro de Jóvenes', hora: '18:00' },
    { fecha_dia: '05', fecha_mes: 'JUL', titulo: 'Retiro Espiritual', hora: '09:00' },
  ];
  return `
<section id="eventos" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Próximos Eventos</h2>
    <p class="subtitulo">${c.eventos_intro || 'No te pierdas nuestras actividades'}</p>
    <div class="lista-eventos">
      ${eventos.map(e => `
        <div class="evento">
          <div class="evento-fecha">
            <span class="fecha-dia">${e.fecha_dia}</span>
            <span class="fecha-mes">${e.fecha_mes}</span>
          </div>
          <div class="evento-info">
            <h3>${e.titulo}</h3>
            <span class="evento-hora">${e.hora} hrs</span>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionTransmision(c) {
  return `
<section id="transmision" class="seccion">
  <div class="contenedor">
    <h2>Transmisión en Vivo</h2>
    <p class="subtitulo">${c.transmision_intro || 'Acompáñanos desde donde estés'}</p>
    <div class="video-placeholder">
      ${c.youtube_video_id ? `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${c.youtube_video_id}" frameborder="0" allowfullscreen style="border-radius:12px;max-width:800px;"></iframe>` : `
      <p>Aquí se mostrará la transmisión en vivo</p>`}
      <p class="nota">${c.transmision_nota || 'Transmitimos cada domingo a las 10:00 AM'}</p>
    </div>
  </div>
</section>`;
}

function seccionMinisterios(c) {
  const ministerios = c.ministerios || [
    { nombre: 'Ministerio de Jóvenes', descripcion: 'Para jóvenes entre 18 y 35 años', lider: 'Pastor Juan' },
    { nombre: 'Ministerio Infantil', descripcion: 'Enseñanza y actividades para niños', lider: 'Pastora María' },
    { nombre: 'Ministerio de Música', descripcion: 'Alabanza y adoración', lider: 'Director David' },
  ];
  return `
<section id="ministerios" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Nuestros Ministerios</h2>
    <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para ti en nuestra comunidad'}</p>
    <div class="grid-3">
      ${ministerios.map(m => `
        <div class="card">
          <h3>${m.nombre}</h3>
          <p>${m.descripcion}</p>
          <span class="meta">Líder: ${m.lider}</span>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionContacto(whatsappLink) {
  return `
<section id="contacto" class="seccion">
  <div class="contenedor">
    <h2>Contáctanos</h2>
    <p class="subtitulo">Estamos aquí para ti</p>
    <div class="form-contacto">
      <input type="text" placeholder="Tu nombre">
      <input type="email" placeholder="Tu correo">
      <textarea rows="4" placeholder="Tu mensaje o petición de oración"></textarea>
      <a href="${whatsappLink}" class="btn-whatsapp">Enviar por WhatsApp</a>
    </div>
  </div>
</section>`;
}

function seccionNuevos(c) {
  const pasos = c.pasos_nuevos || [
    'Llega unos minutos antes y te recibiremos con gusto',
    'Vístete cómodo, no hay código de vestimenta',
    'Tenemos espacio para tus niños durante el servicio',
    'Quédate después para un café y conocernos',
  ];
  return `
<section id="nuevos" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>¿Es tu primera vez?</h2>
    <p class="subtitulo">${c.nuevos_intro || 'Queremos que te sientas como en casa'}</p>
    <div class="lista-pasos">
      ${pasos.map((p, i) => `
        <div class="paso">
          <span class="paso-numero">${i + 1}</span>
          <p>${p}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionDonaciones(c) {
  // Si hay datos bancarios, mostrarlos
  const tieneDatosBancarios = c.banco || c.numero_cuenta || c.titular;
  
  let donacionHTML = '';
  
  if (tieneDatosBancarios) {
    donacionHTML = `
    <div class="datos-bancarios">
      ${c.banco ? `<div class="dato-bancario"><strong>Banco:</strong> ${c.banco}</div>` : ''}
      ${c.tipo_cuenta ? `<div class="dato-bancario"><strong>Tipo de cuenta:</strong> ${c.tipo_cuenta}</div>` : ''}
      ${c.numero_cuenta ? `<div class="dato-bancario"><strong>Número de cuenta:</strong> ${c.numero_cuenta}</div>` : ''}
      ${c.titular ? `<div class="dato-bancario"><strong>Titular:</strong> ${c.titular}</div>` : ''}
      ${c.rut ? `<div class="dato-bancario"><strong>RUT:</strong> ${c.rut}</div>` : ''}
      ${c.email_donaciones ? `<div class="dato-bancario"><strong>Email:</strong> ${c.email_donaciones}</div>` : ''}
    </div>`;
  } else {
    donacionHTML = `
    <div class="metodos-donacion">
      <div class="metodo">Transferencia Bancaria</div>
      <div class="metodo">Tarjeta de Crédito</div>
      <div class="metodo">Pago Móvil</div>
    </div>
    <button class="btn-cta">Quiero Donar</button>`;
  }
  
  return `
<section id="donaciones" class="seccion">
  <div class="contenedor">
    <h2>Donaciones y Ofrendas</h2>
    <p class="subtitulo">${c.donaciones_intro || 'Tu generosidad sostiene la obra'}</p>
    ${donacionHTML}
  </div>
</section>`;
}

function seccionGaleria() {
  return `
<section id="galeria" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Galería</h2>
    <p class="subtitulo">Momentos de nuestra comunidad</p>
    <div class="grid-galeria">
      ${Array(6).fill().map(() => `<div class="foto-placeholder"></div>`).join('')}
    </div>
  </div>
</section>`;
}

function seccionBlog(c) {
  const posts = c.posts || [
    { fecha: '10 Jun 2026', titulo: 'La importancia de la oración diaria' },
    { fecha: '03 Jun 2026', titulo: 'Cómo encontrar paz en tiempos difíciles' },
    { fecha: '27 May 2026', titulo: 'El amor que transforma' },
  ];
  return `
<section id="blog" class="seccion">
  <div class="contenedor">
    <h2>Devocionales</h2>
    <p class="subtitulo">${c.blog_intro || 'Alimenta tu espíritu cada semana'}</p>
    <div class="lista-posts">
      ${posts.map(p => `
        <div class="post">
          <span class="post-fecha">${p.fecha}</span>
          <h3>${p.titulo}</h3>
          <a href="#" class="leer-mas">Leer más</a>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionRedes(whatsappLink, redes) {
  return `
<section id="redes" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Síguenos</h2>
    <p class="subtitulo">Conéctate con nosotros</p>
    <div class="iconos-redes">
      ${redes.facebook ? `<a href="${redes.facebook}" target="_blank" class="red-social">Facebook</a>` : ''}
      ${redes.instagram ? `<a href="${redes.instagram}" target="_blank" class="red-social">Instagram</a>` : ''}
      ${redes.youtube ? `<a href="${redes.youtube}" target="_blank" class="red-social">YouTube</a>` : ''}
      <a href="${whatsappLink}" target="_blank" class="red-social">WhatsApp</a>
    </div>
  </div>
</section>`;
}

// ============================================
// CSS BASE
// ============================================

function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #2c3e50;
  line-height: 1.7;
  background: #fafaf7;
}

/* ============ NAVBAR ============ */
.menu-toggle { display: none; }

.navbar {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  z-index: 1000;
  height: 70px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo { height: 50px; width: auto; }

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.4em;
  font-weight: 700;
  color: #1e3a5f;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95em;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-link:hover { color: #d4a574; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  width: 26px;
  height: 3px;
  background: #1e3a5f;
  border-radius: 2px;
  transition: all 0.3s;
}

/* ============ HERO ============ */
.hero {
  min-height: 75vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 60px 20px;
}

.hero-content { max-width: 700px; }

.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.5em;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.1;
}

.hero .lema {
  font-size: 1.3em;
  margin-bottom: 40px;
  opacity: 0.95;
  font-weight: 300;
}

.btn-cta {
  display: inline-block;
  background: #d4a574;
  color: white;
  padding: 16px 40px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05em;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-cta:hover {
  background: #c8924f;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

/* ============ SECCIONES ============ */
.seccion {
  padding: 90px 20px;
  scroll-margin-top: 90px;
}

.seccion-clara { background: #f4f4f0; }

.contenedor { max-width: 1100px; margin: 0 auto; }

h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5em;
  color: #1e3a5f;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 600;
}

.subtitulo {
  text-align: center;
  color: #7a8a96;
  font-size: 1.1em;
  margin-bottom: 50px;
}

/* ============ CARDS ============ */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 32px 28px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 50px rgba(0,0,0,0.1);
}

.card h3 {
  font-family: 'Playfair Display', serif;
  color: #1e3a5f;
  font-size: 1.3em;
  margin-bottom: 12px;
}

.card p { color: #555; margin-bottom: 12px; }

.card .meta {
  display: block;
  color: #d4a574;
  font-size: 0.9em;
  font-weight: 500;
  margin-top: 8px;
}

.btn-secundario {
  background: transparent;
  color: #1e3a5f;
  border: 2px solid #1e3a5f;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;
}

.btn-secundario:hover {
  background: #1e3a5f;
  color: white;
}

/* ============ UBICACIÓN ============ */
.ubicacion-box {
  background: white;
  max-width: 600px;
  margin: 30px auto 0;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #d4a574;
  box-shadow: 0 5px 20px rgba(0,0,0,0.04);
}

.mapa-contenedor {
  max-width: 900px;
  margin: 40px auto 0;
}

/* ============ EVENTOS ============ */
.lista-eventos {
  max-width: 750px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evento {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.evento:hover { transform: translateX(4px); }

.evento-fecha {
  background: #1e3a5f;
  color: white;
  padding: 22px 28px;
  text-align: center;
  min-width: 100px;
  display: flex;
  flex-direction: column;
}

.fecha-dia { font-size: 1.8em; font-weight: 700; line-height: 1; }
.fecha-mes { font-size: 0.85em; opacity: 0.85; margin-top: 4px; }

.evento-info { padding: 20px 24px; }

.evento-info h3 {
  color: #2c3e50;
  font-family: 'Playfair Display', serif;
  font-size: 1.25em;
}

.evento-hora { color: #d4a574; font-weight: 600; font-size: 0.9em; }

/* ============ VIDEO ============ */
.video-placeholder {
  background: #1e3a5f;
  color: white;
  max-width: 700px;
  margin: 0 auto;
  border-radius: 12px;
  padding: 80px 40px;
  text-align: center;
}

.video-placeholder p { font-size: 1.2em; margin-bottom: 12px; }
.video-placeholder .nota { font-size: 0.9em; opacity: 0.8; }

/* ============ FORMULARIO ============ */
.form-contacto {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-contacto input,
.form-contacto textarea {
  padding: 14px 18px;
  border: 1px solid #d9dee2;
  border-radius: 8px;
  font-size: 1em;
  font-family: inherit;
  background: white;
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #d4a574;
}

.btn-whatsapp {
  background: #25D366;
  color: white;
  text-decoration: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: background 0.2s;
}

.btn-whatsapp:hover { background: #1da851; }

/* ============ PASOS NUEVOS ============ */
.lista-pasos {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.04);
}

.paso-numero {
  background: #1e3a5f;
  color: white;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
}

.paso p { flex: 1; padding-top: 8px; }

/* ============ DONACIONES ============ */
.metodos-donacion {
  display: flex;
  gap: 18px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.metodo {
  background: white;
  padding: 22px 32px;
  border-radius: 12px;
  border: 2px solid #f0ebe0;
  color: #1e3a5f;
  font-weight: 500;
}

#donaciones { text-align: center; }
#donaciones .btn-cta { margin: 0 auto; }

.datos-bancarios {
  max-width: 500px;
  margin: 0 auto 40px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.06);
  text-align: left;
}

.dato-bancario {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.dato-bancario:last-child {
  border-bottom: none;
}

.dato-bancario strong {
  color: #1e3a5f;
  display: block;
  font-size: 0.85em;
  margin-bottom: 4px;
}

.dato-bancario strong::after {
  content: none;
}

/* ============ GALERIA ============ */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #e8e4d8, #d4cab8);
  aspect-ratio: 1;
  border-radius: 12px;
}

/* ============ BLOG ============ */
.lista-posts {
  max-width: 750px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post {
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.post-fecha {
  color: #d4a574;
  font-size: 0.85em;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'Playfair Display', serif;
  color: #1e3a5f;
  font-size: 1.4em;
  margin: 10px 0 14px;
}

.leer-mas {
  color: #d4a574;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid #d4a574;
  padding-bottom: 2px;
}

/* ============ REDES ============ */
.iconos-redes {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.red-social {
  background: #1e3a5f;
  color: white;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.red-social:hover {
  background: #d4a574;
  transform: translateY(-2px);
}

/* ============ FOOTER ============ */
footer {
  background: #1a2a3a;
  color: white;
  padding: 50px 20px;
  text-align: center;
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.6em;
  margin-bottom: 12px;
}

.footer-content p { margin-bottom: 8px; opacity: 0.85; }

.footer-content a { color: #d4a574; text-decoration: none; }

.footer-copy {
  margin-top: 24px !important;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.85em;
  opacity: 0.6;
}

/* ============ RESPONSIVO ============ */
@media (max-width: 768px) {
  .hero h1 { font-size: 2.2em; }
  .hero .lema { font-size: 1.1em; }
  h2 { font-size: 1.8em; }
  .seccion { padding: 60px 16px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 20px 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .menu-toggle:checked ~ .navbar .nav-links {
    transform: translateX(0);
  }

  .nav-link {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1.05em;
  }

  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(7px, 7px);
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .grid-3 { grid-template-columns: 1fr; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }
  .metodos-donacion { flex-direction: column; align-items: center; }
  .evento-fecha { padding: 18px; min-width: 80px; }
  .fecha-dia { font-size: 1.5em; }
}
`;
}

module.exports = { generarPlantillaReverente: generarPlantilla };