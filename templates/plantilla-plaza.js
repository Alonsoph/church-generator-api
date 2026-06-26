// Plantilla PLAZA — comunitaria, visual
// Navbar lateral fijo, hero con grid de fotos, estilo magazine

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

  // ORDEN PLAZA: Galería → Eventos → Ministerios → Horarios → Blog → Contacto →
  //              Nuevos → Predicaciones → Redes → Transmisión → Donaciones
  let navLinks = '';
  let secciones = '';

  if (func.galeria_fotos) {
    navLinks += `<a href="#galeria" class="nav-link">Galería</a>`;
    secciones += seccionGaleria();
  }
  if (func.calendario_eventos) {
    navLinks += `<a href="#eventos" class="nav-link">Eventos</a>`;
    secciones += seccionEventos(contenido);
  }
  if (func.ministerios) {
    navLinks += `<a href="#ministerios" class="nav-link">Ministerios</a>`;
    secciones += seccionMinisterios(contenido);
  }
  if (func.horarios_ubicacion) {
    navLinks += `<a href="#horarios" class="nav-link">Horarios</a>`;
    secciones += seccionHorarios(contenido, direccion, ciudad);
  }
  if (func.blog_devocionales) {
    navLinks += `<a href="#blog" class="nav-link">Devocionales</a>`;
    secciones += seccionBlog(contenido);
  }
  if (func.formulario_contacto) {
    navLinks += `<a href="#contacto" class="nav-link">Contacto</a>`;
    secciones += seccionContacto(whatsappLink);
  }
  if (func.pagina_nuevos_visitantes) {
    navLinks += `<a href="#nuevos" class="nav-link">Nuevos</a>`;
    secciones += seccionNuevos(contenido);
  }
  if (func.biblioteca_sermones) {
    navLinks += `<a href="#predicaciones" class="nav-link">Predicaciones</a>`;
    secciones += seccionPredicaciones(contenido);
  }
  if (func.redes_sociales) {
    navLinks += `<a href="#redes" class="nav-link">Redes</a>`;
    secciones += seccionRedes(whatsappLink);
  }
  if (func.transmision_vivo) {
    navLinks += `<a href="#transmision" class="nav-link">En vivo</a>`;
    secciones += seccionTransmision(contenido);
  }
  if (func.donaciones) {
    navLinks += `<a href="#donaciones" class="nav-link">Donar</a>`;
    secciones += seccionDonaciones(contenido);
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
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${cssBase()}
</style>
</head>
<body>

<input type="checkbox" id="menu-toggle" class="menu-toggle">

<aside class="sidebar">
  <div class="sidebar-top">
    ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : `<div class="logo-text">${nombre}</div>`}
    <p class="sidebar-lema">${lema}</p>
  </div>
<div class="nav-links" onclick="var t=event.target;if(t.tagName==='A'){event.preventDefault();var h=t.getAttribute('href');if(h&&h.startsWith('#')){var el=document.getElementById(h.substring(1));if(el){el.scrollIntoView({behavior:'smooth',block:'start'});}}document.getElementById('menu-toggle').checked=false;}">
  ${navLinks}
</div>
  <div class="sidebar-bottom">
    ${whatsapp ? `<a href="${whatsappLink}" class="sidebar-cta">Escríbenos</a>` : ''}
  </div>
</aside>

<nav class="navbar-movil">
  <div class="logo-text-movil">${nombre}</div>
  <label for="menu-toggle" class="hamburger">
    <span></span><span></span><span></span>
  </label>
</nav>

<div class="contenido-principal">

<header class="hero">
  <div class="hero-mosaico">
    <div class="hero-foto hero-foto-grande" ${fotoPrincipal ? `style="background-image: url('${fotoPrincipal}')"` : ''}></div>
    <div class="hero-foto hero-foto-1"></div>
    <div class="hero-foto hero-foto-2"></div>
  </div>
  <div class="hero-overlay">
    <span class="hero-eyebrow">Comunidad de fe</span>
    <h1>${nombre}</h1>
    <p class="hero-descripcion">${lema}</p>
    <a href="#galeria" class="btn-cta">${contenido.hero_cta || 'Descubre más'}</a>
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

</div>

</body>
</html>`;
}

// ============================================
// SECCIONES INDIVIDUALES
// ============================================

function seccionGaleria() {
  return `
<section id="galeria" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">01</span>
      <h2>Nuestra Comunidad</h2>
      <p class="subtitulo">Momentos que nos definen</p>
    </div>
    <div class="grid-galeria">
      <div class="foto-placeholder foto-grande"></div>
      <div class="foto-placeholder"></div>
      <div class="foto-placeholder"></div>
      <div class="foto-placeholder foto-ancha"></div>
      <div class="foto-placeholder"></div>
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
<section id="eventos" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">02</span>
      <h2>Lo que viene</h2>
      <p class="subtitulo">${c.eventos_intro || 'Próximas actividades de la iglesia'}</p>
    </div>
    <div class="grid-eventos">
      ${eventos.map(e => `
        <div class="evento-tarjeta">
          <div class="evento-tarjeta-fecha">
            <span class="fecha-dia">${e.fecha_dia}</span>
            <span class="fecha-mes">${e.fecha_mes}</span>
          </div>
          <div class="evento-tarjeta-info">
            <h3>${e.titulo}</h3>
            <p class="evento-hora">${e.hora} hrs</p>
          </div>
        </div>
      `).join('')}
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
<section id="ministerios" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">03</span>
      <h2>Ministerios</h2>
      <p class="subtitulo">${c.ministerios_intro || 'Sirviendo juntos'}</p>
    </div>
    <div class="grid-2">
      ${ministerios.map(m => `
        <div class="card">
          <h3>${m.nombre}</h3>
          <p>${m.descripcion}</p>
          <span class="card-meta">${m.lider}</span>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

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
<section id="horarios" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">04</span>
      <h2>Horarios y lugar</h2>
      <p class="subtitulo">${c.horarios_intro || 'Te esperamos cada semana'}</p>
    </div>
    <div class="horarios-grid">
      ${horarios.map(h => `
        <div class="horario-item">
          <span class="horario-titulo">${h.titulo}</span>
          <span class="horario-hora">${h.horario}</span>
        </div>
      `).join('')}
    </div>
    <div class="ubicacion-box">
      <span class="ubicacion-label">Dirección</span>
      <p>${direccionCompleta}</p>
    </div>
    ${direccion ? `
    <div class="mapa-contenedor">
      <iframe
        src="${mapaSrc}"
        width="100%"
        height="400"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
    ` : ''}
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
    <div class="seccion-header">
      <span class="seccion-num">05</span>
      <h2>Devocionales</h2>
      <p class="subtitulo">${c.blog_intro || 'Reflexiones para la semana'}</p>
    </div>
    <div class="grid-blog">
      ${posts.map(p => `
        <article class="post">
          <span class="post-fecha">${p.fecha}</span>
          <h3>${p.titulo}</h3>
          <a href="#" class="leer-mas">Continuar leyendo →</a>
        </article>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionContacto(whatsappLink) {
  return `
<section id="contacto" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">06</span>
      <h2>Hablemos</h2>
      <p class="subtitulo">Estamos aquí para ti</p>
    </div>
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
<section id="nuevos" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">07</span>
      <h2>Si nos visitas</h2>
      <p class="subtitulo">${c.nuevos_intro || 'Queremos que te sientas en casa'}</p>
    </div>
    <div class="lista-pasos">
      ${pasos.map((p, i) => `
        <div class="paso">
          <span class="paso-numero">${String(i + 1).padStart(2, '0')}</span>
          <p>${p}</p>
        </div>
      `).join('')}
    </div>
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
<section id="predicaciones" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">08</span>
      <h2>Predicaciones</h2>
      <p class="subtitulo">${c.predicaciones_intro || 'Escucha y crece en tu fe'}</p>
    </div>
    <div class="grid-2">
      ${predicaciones.map(p => `
        <div class="card">
          <h3>${p.titulo}</h3>
          <span class="card-meta">${p.predicador}</span>
          <button class="btn-card">Escuchar →</button>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionRedes(whatsappLink) {
  return `
<section id="redes" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">09</span>
      <h2>Síguenos</h2>
      <p class="subtitulo">Conéctate con nosotros</p>
    </div>
    <div class="iconos-redes">
      <a href="#" class="red-social">Facebook</a>
      <a href="#" class="red-social">Instagram</a>
      <a href="#" class="red-social">YouTube</a>
      <a href="${whatsappLink}" class="red-social">WhatsApp</a>
    </div>
  </div>
</section>`;
}

function seccionTransmision(c) {
  return `
<section id="transmision" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">10</span>
      <h2>En vivo</h2>
      <p class="subtitulo">${c.transmision_intro || 'Acompáñanos desde donde estés'}</p>
    </div>
    <div class="video-box">
      <p class="video-titulo">Aquí se mostrará la transmisión</p>
      <p class="video-nota">${c.transmision_nota || 'Domingos a las 10:00 AM'}</p>
    </div>
  </div>
</section>`;
}

function seccionDonaciones(c) {
  return `
<section id="donaciones" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-num">11</span>
      <h2>Apoyar la obra</h2>
      <p class="subtitulo">${c.donaciones_intro || 'Tu generosidad sostiene la misión'}</p>
    </div>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia</div>
      <div class="metodo">Tarjeta</div>
      <div class="metodo">Pago Móvil</div>
    </div>
    <div style="text-align:center; margin-top: 36px;">
      <a href="#contacto" class="btn-cta">Quiero Donar</a>
    </div>
  </div>
</section>`;
}

// ============================================
// CSS BASE — PLAZA
// ============================================

function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #2a2e26;
  line-height: 1.65;
  background: #faf6ed;
  font-weight: 400;
}

.menu-toggle { display: none; }

/* ============ SIDEBAR ============ */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: #2d3a2e;
  color: #faf6ed;
  padding: 40px 28px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar-top {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(250, 246, 237, 0.12);
}

.sidebar .logo { height: 50px; width: auto; margin-bottom: 12px; }

.sidebar .logo-text {
  font-family: 'DM Serif Display', serif;
  font-size: 1.7em;
  color: #faf6ed;
  line-height: 1.1;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.sidebar-lema {
  font-size: 0.82em;
  color: rgba(250, 246, 237, 0.55);
  font-style: italic;
  line-height: 1.4;
}

.sidebar .nav-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.sidebar .nav-link {
  color: rgba(250, 246, 237, 0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.92em;
  padding: 10px 14px;
  border-radius: 8px;
  transition: all 0.2s;
  display: block;
}

.sidebar .nav-link:hover {
  background: rgba(250, 246, 237, 0.06);
  color: #d4a02e;
}

.sidebar-bottom {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(250, 246, 237, 0.12);
}

.sidebar-cta {
  display: block;
  background: #d4a02e;
  color: #2d3a2e;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.88em;
  text-align: center;
  transition: background 0.2s;
}

.sidebar-cta:hover { background: #c89026; }

/* ============ NAVBAR MÓVIL ============ */
.navbar-movil {
  display: none;
  position: sticky;
  top: 0;
  background: #2d3a2e;
  color: #faf6ed;
  padding: 16px 24px;
  z-index: 1000;
  justify-content: space-between;
  align-items: center;
}

.logo-text-movil {
  font-family: 'DM Serif Display', serif;
  font-size: 1.3em;
  color: #faf6ed;
  letter-spacing: -0.3px;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  width: 24px;
  height: 2px;
  background: #faf6ed;
  border-radius: 2px;
  transition: all 0.3s;
}

/* ============ CONTENIDO PRINCIPAL ============ */
.contenido-principal {
  margin-left: 260px;
  background: #faf6ed;
  min-height: 100vh;
}

/* ============ HERO con mosaico ============ */
.hero {
  position: relative;
  padding: 60px 40px;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-mosaico {
  position: absolute;
  inset: 40px;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  z-index: 1;
}

.hero-foto {
  border-radius: 12px;
  background-color: #2d3a2e;
  background-size: cover;
  background-position: center;
}

.hero-foto-grande {
  grid-row: 1 / 3;
  background-image: linear-gradient(135deg, #2d3a2e, #4a5a4b);
}

.hero-foto-1 {
  background: linear-gradient(135deg, #d4a02e, #b8881f);
}

.hero-foto-2 {
  background: linear-gradient(135deg, #c87456, #a35c41);
}

.hero-overlay {
  position: relative;
  z-index: 2;
  background: rgba(45, 58, 46, 0.92);
  color: #faf6ed;
  padding: 60px 48px;
  border-radius: 16px;
  max-width: 580px;
  text-align: center;
}

.hero-eyebrow {
  display: inline-block;
  color: #d4a02e;
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.hero h1 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2.6em, 5.5vw, 4.2em);
  font-weight: 400;
  margin-bottom: 18px;
  line-height: 1.05;
  letter-spacing: -1px;
}

.hero-descripcion {
  font-size: 1.1em;
  margin-bottom: 36px;
  color: rgba(250, 246, 237, 0.85);
  font-weight: 400;
  line-height: 1.5;
}

.btn-cta {
  display: inline-block;
  background: #d4a02e;
  color: #2d3a2e;
  padding: 14px 36px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95em;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn-cta:hover {
  background: #c89026;
  transform: translateY(-2px);
}

/* ============ SECCIONES ============ */
.seccion {
  padding: 100px 40px;
  scroll-margin-top: 40px;
  background: #faf6ed;
}

.seccion-alt { background: #f2ecdc; }

.contenedor { max-width: 1100px; margin: 0 auto; }

.seccion-header {
  margin-bottom: 56px;
  max-width: 700px;
}

.seccion-num {
  display: block;
  font-family: 'DM Serif Display', serif;
  font-size: 2.4em;
  color: #d4a02e;
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -1px;
}

h2 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2em, 4vw, 3em);
  color: #2d3a2e;
  margin-bottom: 14px;
  font-weight: 400;
  letter-spacing: -1px;
  line-height: 1.1;
}

.subtitulo {
  color: rgba(42, 46, 38, 0.65);
  font-size: 1.05em;
  font-weight: 400;
}

/* ============ GALERÍA mosaico ============ */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 280px 220px;
  gap: 16px;
}

.foto-placeholder {
  background: linear-gradient(135deg, #c8b89a, #a89671);
  border-radius: 12px;
  transition: transform 0.3s;
}

.foto-placeholder:hover { transform: scale(1.02); }

.foto-grande {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  background: linear-gradient(135deg, #2d3a2e, #4a5a4b);
}

.foto-ancha {
  grid-column: 2 / 4;
  background: linear-gradient(135deg, #d4a02e, #b8881f);
}

/* ============ EVENTOS tarjeta postal ============ */
.grid-eventos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.evento-tarjeta {
  background: #faf6ed;
  border: 1px solid rgba(45, 58, 46, 0.1);
  border-radius: 12px;
  padding: 28px;
  display: flex;
  gap: 24px;
  align-items: center;
  transition: all 0.2s;
}

.seccion-alt .evento-tarjeta { background: #faf6ed; }

.evento-tarjeta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(45, 58, 46, 0.08);
  border-color: #d4a02e;
}

.evento-tarjeta-fecha {
  background: #2d3a2e;
  color: #faf6ed;
  padding: 16px 12px;
  border-radius: 8px;
  text-align: center;
  min-width: 70px;
}

.fecha-dia {
  font-family: 'DM Serif Display', serif;
  font-size: 1.7em;
  display: block;
  line-height: 1;
}

.fecha-mes {
  font-size: 0.7em;
  letter-spacing: 1.5px;
  margin-top: 4px;
  color: #d4a02e;
  display: block;
  font-weight: 600;
}

.evento-tarjeta-info h3 {
  font-family: 'DM Serif Display', serif;
  color: #2d3a2e;
  font-size: 1.3em;
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.evento-hora {
  color: #d4a02e;
  font-size: 0.85em;
  font-weight: 600;
}

/* ============ CARDS ============ */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.card {
  background: #faf6ed;
  padding: 36px 32px;
  border-radius: 12px;
  border: 1px solid rgba(45, 58, 46, 0.1);
  transition: all 0.25s;
}

.seccion-alt .card { background: #faf6ed; }

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(45, 58, 46, 0.08);
  border-color: #d4a02e;
}

.card h3 {
  font-family: 'DM Serif Display', serif;
  color: #2d3a2e;
  font-size: 1.5em;
  margin-bottom: 12px;
  letter-spacing: -0.3px;
}

.card p {
  color: rgba(42, 46, 38, 0.65);
  margin-bottom: 14px;
  font-size: 0.95em;
}

.card-meta {
  display: block;
  color: #d4a02e;
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-top: 6px;
}

.btn-card {
  background: transparent;
  color: #2d3a2e;
  border: none;
  padding: 0;
  font-size: 0.9em;
  font-weight: 700;
  cursor: pointer;
  margin-top: 18px;
  font-family: inherit;
  transition: color 0.2s;
}

.btn-card:hover { color: #d4a02e; }

/* ============ HORARIOS ============ */
.horarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0;
  border-top: 1px solid rgba(45, 58, 46, 0.15);
  margin-bottom: 32px;
}

.horario-item {
  padding: 28px 24px;
  border-bottom: 1px solid rgba(45, 58, 46, 0.15);
  border-right: 1px solid rgba(45, 58, 46, 0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.horario-item:last-child { border-right: none; }

.horario-titulo {
  font-family: 'DM Serif Display', serif;
  color: #2d3a2e;
  font-size: 1.25em;
}

.horario-hora {
  color: #d4a02e;
  font-size: 0.85em;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
}

.ubicacion-box {
  background: #faf6ed;
  max-width: 700px;
  margin: 32px auto 0;
  padding: 28px 32px;
  border-radius: 12px;
  border-left: 4px solid #d4a02e;
}

.seccion-alt .ubicacion-box { background: #faf6ed; }

.ubicacion-label {
  display: block;
  color: #d4a02e;
  font-size: 0.7em;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 700;
}

.ubicacion-box p {
  color: #2d3a2e;
  font-family: 'DM Serif Display', serif;
  font-size: 1.2em;
}

.mapa-contenedor {
  max-width: 1000px;
  margin: 40px auto 0;
  border-radius: 12px;
  overflow: hidden;
}

/* ============ BLOG ============ */
.grid-blog {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.post {
  background: #faf6ed;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid rgba(45, 58, 46, 0.1);
  transition: all 0.2s;
}

.seccion-alt .post { background: #faf6ed; }

.post:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(45, 58, 46, 0.08);
}

.post-fecha {
  color: #d4a02e;
  font-size: 0.75em;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'DM Serif Display', serif;
  color: #2d3a2e;
  font-size: 1.5em;
  margin: 12px 0 16px;
  letter-spacing: -0.3px;
}

.leer-mas {
  color: #2d3a2e;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88em;
  border-bottom: 1px solid #d4a02e;
  padding-bottom: 2px;
}

/* ============ FORMULARIO ============ */
.form-contacto {
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-contacto input,
.form-contacto textarea {
  padding: 16px 20px;
  border: 1px solid rgba(45, 58, 46, 0.15);
  border-radius: 8px;
  font-size: 0.95em;
  font-family: inherit;
  background: #faf6ed;
  color: #2a2e26;
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #d4a02e;
}

.btn-whatsapp {
  background: #2d3a2e;
  color: #faf6ed;
  text-decoration: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 700;
  text-align: center;
  transition: background 0.2s;
}

.btn-whatsapp:hover { background: #1f2920; }

/* ============ PASOS NUEVOS ============ */
.lista-pasos {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 28px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(45, 58, 46, 0.12);
}

.paso:last-child { border-bottom: none; }

.paso-numero {
  font-family: 'DM Serif Display', serif;
  color: #d4a02e;
  min-width: 60px;
  font-size: 2em;
  line-height: 1;
}

.paso p {
  flex: 1;
  padding-top: 8px;
  color: #2a2e26;
  font-size: 1.05em;
}

/* ============ VIDEO TRANSMISIÓN ============ */
.video-box {
  max-width: 800px;
  margin: 0 auto;
  background: #2d3a2e;
  color: #faf6ed;
  padding: 80px 40px;
  border-radius: 16px;
  text-align: center;
}

.video-titulo {
  font-family: 'DM Serif Display', serif;
  font-size: 1.5em;
  margin-bottom: 12px;
  color: #d4a02e;
}

.video-nota {
  opacity: 0.7;
  font-size: 0.95em;
}

/* ============ REDES ============ */
.iconos-redes {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.red-social {
  background: #2d3a2e;
  color: #faf6ed;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.92em;
}

.red-social:hover {
  background: #d4a02e;
  color: #2d3a2e;
}

/* ============ DONACIONES ============ */
.metodos-donacion {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.metodo {
  background: #faf6ed;
  padding: 22px 32px;
  border-radius: 8px;
  border: 1px solid rgba(45, 58, 46, 0.15);
  color: #2d3a2e;
  font-weight: 500;
  font-family: 'DM Serif Display', serif;
  font-size: 1.1em;
}

/* ============ FOOTER ============ */
footer {
  background: #2d3a2e;
  color: rgba(250, 246, 237, 0.7);
  padding: 60px 40px;
  text-align: center;
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 1.6em;
  margin-bottom: 14px;
  color: #faf6ed;
  letter-spacing: -0.3px;
}

.footer-content p { margin-bottom: 8px; font-size: 0.92em; }

.footer-content a { color: #d4a02e; text-decoration: none; }

.footer-copy {
  margin-top: 28px !important;
  padding-top: 28px;
  border-top: 1px solid rgba(250, 246, 237, 0.1);
  font-size: 0.8em;
  opacity: 0.5;
}

/* ============ RESPONSIVO ============ */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 280px;
  }

  .menu-toggle:checked ~ .sidebar { transform: translateX(0); }

  .contenido-principal { margin-left: 0; }

  .navbar-movil { display: flex; }

  .menu-toggle:checked ~ .navbar-movil .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }
  .menu-toggle:checked ~ .navbar-movil .hamburger span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle:checked ~ .navbar-movil .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }
}

@media (max-width: 768px) {
  .hero { padding: 40px 20px; min-height: 70vh; }
  .hero-mosaico { inset: 20px; gap: 8px; }
  .hero-overlay { padding: 40px 28px; }
  .seccion { padding: 70px 20px; }

  .grid-galeria {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 200px 160px 160px;
  }
  .foto-grande { grid-column: 1 / 3; grid-row: 1; }
  .foto-ancha { grid-column: 1 / 3; }

  .horarios-grid { grid-template-columns: 1fr; }
  .horario-item { border-right: none; }

  .grid-eventos { grid-template-columns: 1fr; }
  .evento-tarjeta { gap: 16px; padding: 20px; }
}
`;
}

module.exports = { generarPlantillaPlaza: generarPlantilla };