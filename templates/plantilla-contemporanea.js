// Plantilla CONTEMPORÁNEA: sans-serif moderno, verde menta + grafito, estilo Linear/Vercel

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
    secciones += seccionRedes(whatsappLink);
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${nombre}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
  </div>
</nav>

<header class="hero" ${fotoPrincipal ? `style="background-image: linear-gradient(rgba(20,30,40,0.7), rgba(20,30,40,0.6)), url('${fotoPrincipal}')"` : ''}>
  <div class="hero-content">
    <span class="hero-tag">Bienvenido</span>
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
    <p class="footer-copy">© ${new Date().getFullYear()} ${nombre}</p>
  </div>
</footer>

</body>
</html>`;
}

// ============================================
// SECCIONES
// ============================================

function seccionHorarios(c, direccion, ciudad) {
  const horarios = c.horarios || [
    { titulo: 'Servicio Dominical', horario: 'Domingo · 10:00 AM' },
    { titulo: 'Estudio Bíblico', horario: 'Miércoles · 19:00 PM' },
    { titulo: 'Oración', horario: 'Viernes · 20:00 PM' },
  ];
  const direccionCompleta = `${direccion}${ciudad ? ', ' + ciudad : ''}`;
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`;
  return `
<section id="horarios" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">01 · Visítanos</span>
      <h2>Horarios y ubicación</h2>
      <p class="subtitulo">${c.horarios_intro || 'Te esperamos cada semana'}</p>
    </div>
    <div class="grid-3">
      ${horarios.map(h => `
        <div class="card">
          <h3>${h.titulo}</h3>
          <p>${h.horario}</p>
        </div>
      `).join('')}
    </div>
    <div class="ubicacion-box">
      <strong>Dirección</strong>
      <span>${direccionCompleta}</span>
    </div>
    ${direccion ? `
    <div class="mapa-contenedor">
      <iframe src="${mapaSrc}" width="100%" height="400" style="border:0;border-radius:6px;" allowfullscreen="" loading="lazy"></iframe>
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
<section id="predicaciones" class="seccion seccion-clara">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">02 · Mensajes</span>
      <h2>Predicaciones</h2>
      <p class="subtitulo">${c.predicaciones_intro || 'Escucha y crece en tu fe'}</p>
    </div>
    <div class="grid-3">
      ${predicaciones.map(p => `
        <div class="card">
          <h3>${p.titulo}</h3>
          <p class="meta">${p.predicador}</p>
          <button class="btn-secundario">Escuchar →</button>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionEventos(c) {
  const eventos = c.eventos || [
    { fecha_dia: '15', fecha_mes: 'JUN', titulo: 'Vigilia de oración', hora: '20:00' },
    { fecha_dia: '22', fecha_mes: 'JUN', titulo: 'Encuentro de jóvenes', hora: '18:00' },
    { fecha_dia: '05', fecha_mes: 'JUL', titulo: 'Retiro espiritual', hora: '09:00' },
  ];
  return `
<section id="eventos" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">03 · Agenda</span>
      <h2>Próximos eventos</h2>
      <p class="subtitulo">${c.eventos_intro || 'No te pierdas nuestras actividades'}</p>
    </div>
    <div class="lista-eventos">
      ${eventos.map(e => `
        <div class="evento">
          <div class="evento-fecha-text">
            <span class="fecha-dia">${e.fecha_dia}</span>
            <span class="fecha-mes">${e.fecha_mes}</span>
          </div>
          <div class="evento-info">
            <h3>${e.titulo}</h3>
          </div>
          <div class="evento-hora-col">
            <span class="evento-hora">${e.hora}</span>
          </div>
          <div class="evento-flecha">→</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionTransmision(c) {
  return `
<section id="transmision" class="seccion seccion-clara">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">04 · En vivo</span>
      <h2>Transmisión en vivo</h2>
      <p class="subtitulo">${c.transmision_intro || 'Acompáñanos desde donde estés'}</p>
    </div>
    <div class="video-placeholder">
      <p>Aquí se mostrará la transmisión en vivo</p>
      <p class="nota">${c.transmision_nota || 'Transmitimos cada domingo a las 10:00 AM'}</p>
    </div>
  </div>
</section>`;
}

function seccionMinisterios(c) {
  const ministerios = c.ministerios || [
    { nombre: 'Jóvenes', descripcion: 'Para jóvenes entre 18 y 35 años', lider: 'Pastor Juan' },
    { nombre: 'Infantil', descripcion: 'Enseñanza y actividades para niños', lider: 'Pastora María' },
    { nombre: 'Música', descripcion: 'Alabanza y adoración', lider: 'Director David' },
  ];
  return `
<section id="ministerios" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">05 · Comunidad</span>
      <h2>Ministerios</h2>
      <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para ti'}</p>
    </div>
    <div class="grid-3">
      ${ministerios.map(m => `
        <div class="card">
          <h3>${m.nombre}</h3>
          <p>${m.descripcion}</p>
          <span class="meta">${m.lider}</span>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionContacto(whatsappLink) {
  return `
<section id="contacto" class="seccion seccion-clara">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">06 · Conecta</span>
      <h2>Contáctanos</h2>
      <p class="subtitulo">Estamos aquí para ti</p>
    </div>
    <div class="form-contacto">
      <input type="text" placeholder="Tu nombre">
      <input type="email" placeholder="Tu correo">
      <textarea rows="4" placeholder="Tu mensaje o petición de oración"></textarea>
      <a href="${whatsappLink}" class="btn-whatsapp">Enviar por WhatsApp →</a>
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
      <span class="seccion-tag">07 · Bienvenida</span>
      <h2>¿Es tu primera vez?</h2>
      <p class="subtitulo">${c.nuevos_intro || 'Queremos que te sientas como en casa'}</p>
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

function seccionDonaciones(c) {
  return `
<section id="donaciones" class="seccion seccion-clara">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">08 · Apoyo</span>
      <h2>Donaciones</h2>
      <p class="subtitulo">${c.donaciones_intro || 'Tu generosidad sostiene la obra'}</p>
    </div>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia</div>
      <div class="metodo">Tarjeta</div>
      <div class="metodo">Pago móvil</div>
    </div>
    <a href="#contacto" class="btn-cta">Quiero donar →</a>
  </div>
</section>`;
}

function seccionGaleria() {
  return `
<section id="galeria" class="seccion">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">09 · Imágenes</span>
      <h2>Galería</h2>
      <p class="subtitulo">Momentos de nuestra comunidad</p>
    </div>
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
<section id="blog" class="seccion seccion-clara">
  <div class="contenedor">
    <div class="seccion-header">
      <span class="seccion-tag">10 · Lecturas</span>
      <h2>Devocionales</h2>
      <p class="subtitulo">${c.blog_intro || 'Alimenta tu espíritu cada semana'}</p>
    </div>
    <div class="lista-posts">
      ${posts.map(p => `
        <div class="post">
          <span class="post-fecha">${p.fecha}</span>
          <h3>${p.titulo}</h3>
          <a href="#" class="leer-mas">Leer →</a>
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
      <span class="seccion-tag">11 · Redes</span>
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

// ============================================
// CSS
// ============================================
function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1a1f2e;
  line-height: 1.6;
  background: white;
  -webkit-font-smoothing: antialiased;
}

/* NAVBAR translúcido */
.menu-toggle { display: none; }

.navbar {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid rgba(238,240,242,0.7);
  z-index: 1000;
  height: 60px;
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

.logo { height: 32px; width: auto; }

.logo-text {
  font-size: 1em;
  font-weight: 600;
  color: #1a1f2e;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  color: #5a6573;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875em;
  transition: color 0.2s;
}

.nav-link:hover { color: #4ec9b0; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  width: 22px;
  height: 2px;
  background: #1a1f2e;
  border-radius: 1px;
  transition: all 0.3s;
}

/* HERO alineado a la izquierda */
.hero {
  min-height: 85vh;
  background-size: cover;
  background-position: center;
  background-color: #0f1419;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  padding: 80px 24px;
}

.hero-content {
  max-width: 720px;
  margin-left: clamp(24px, 8vw, 120px);
  text-align: left;
}

.hero-tag {
  display: inline-block;
  color: #4ec9b0;
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 20px;
  padding: 6px 12px;
  border: 1px solid rgba(78, 201, 176, 0.3);
  border-radius: 4px;
}

.hero h1 {
  font-size: clamp(2.6em, 5.5vw, 4.4em);
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.035em;
  line-height: 1.02;
}

.hero .lema {
  font-size: 1.15em;
  margin-bottom: 40px;
  opacity: 0.75;
  font-weight: 400;
  letter-spacing: -0.01em;
  max-width: 560px;
}

.btn-cta {
  display: inline-block;
  background: #4ec9b0;
  color: #0f1419;
  padding: 13px 28px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92em;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  letter-spacing: -0.01em;
}

.btn-cta:hover {
  background: #45b89f;
  transform: translateY(-1px);
}

/* SECCIONES */
.seccion {
  padding: 110px 24px;
  scroll-margin-top: 70px;
}

.seccion-clara { background: #f7f8fa; }

.contenedor { max-width: 1100px; margin: 0 auto; }

/* Header de sección alineado a la izquierda */
.seccion-header {
  margin-bottom: 56px;
  max-width: 700px;
}

.seccion-tag {
  display: inline-block;
  color: #4ec9b0;
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 14px;
  font-variant-numeric: tabular-nums;
}

h2 {
  font-size: clamp(2em, 3.8vw, 2.8em);
  color: #1a1f2e;
  margin-bottom: 14px;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;
  text-align: left;
}

.subtitulo {
  color: #5a6573;
  font-size: 1.05em;
  font-weight: 400;
  letter-spacing: -0.005em;
  text-align: left;
}

/* CARDS más angulosas */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  background: white;
  padding: 28px;
  border-radius: 6px;
  border: 1px solid #eef0f2;
  transition: all 0.2s;
}

.card:hover {
  border-color: #1a1f2e;
}

.card h3 {
  color: #1a1f2e;
  font-size: 1.1em;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.card p { color: #5a6573; margin-bottom: 12px; font-size: 0.92em; }

.card .meta {
  display: block;
  color: #4ec9b0;
  font-size: 0.82em;
  font-weight: 500;
  margin-top: 10px;
  letter-spacing: -0.005em;
}

.btn-secundario {
  background: transparent;
  color: #1a1f2e;
  border: 1px solid #d0d5dc;
  padding: 7px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 14px;
  transition: all 0.15s;
  font-size: 0.82em;
  font-family: inherit;
}

.btn-secundario:hover {
  border-color: #1a1f2e;
  background: #1a1f2e;
  color: white;
}

/* UBICACIÓN */
.ubicacion-box {
  background: white;
  max-width: 600px;
  margin: 32px auto 0;
  padding: 22px 24px;
  border-radius: 6px;
  border: 1px solid #eef0f2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ubicacion-box strong {
  color: #4ec9b0;
  font-size: 0.78em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.ubicacion-box span { color: #1a1f2e; font-size: 1em; }

.mapa-contenedor {
  max-width: 900px;
  margin: 32px auto 0;
}

/* EVENTOS en filas con líneas separadoras */
.lista-eventos {
  max-width: 850px;
  margin: 0 auto;
  border-top: 1px solid #eef0f2;
}

.evento {
  display: grid;
  grid-template-columns: 100px 1fr auto 40px;
  align-items: center;
  gap: 24px;
  padding: 22px 4px;
  border-bottom: 1px solid #eef0f2;
  transition: padding 0.2s, background 0.2s;
}

.evento:hover {
  padding-left: 12px;
  padding-right: 12px;
  background: rgba(78, 201, 176, 0.04);
}

.evento-fecha-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.fecha-dia {
  font-size: 1.8em;
  font-weight: 700;
  color: #1a1f2e;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.fecha-mes {
  font-size: 0.72em;
  color: #4ec9b0;
  letter-spacing: 0.15em;
  margin-top: -2px;
  font-weight: 600;
}

.evento-info h3 {
  font-size: 1.1em;
  font-weight: 600;
  color: #1a1f2e;
  letter-spacing: -0.015em;
}

.evento-hora-col { text-align: right; }

.evento-hora {
  color: #5a6573;
  font-weight: 500;
  font-size: 0.92em;
  font-variant-numeric: tabular-nums;
}

.evento-flecha {
  color: #d0d5dc;
  font-size: 1.2em;
  text-align: right;
  transition: color 0.2s, transform 0.2s;
}

.evento:hover .evento-flecha {
  color: #4ec9b0;
  transform: translateX(4px);
}

/* VIDEO */
.video-placeholder {
  background: #1a1f2e;
  color: white;
  max-width: 750px;
  margin: 0 auto;
  border-radius: 6px;
  padding: 80px 40px;
  text-align: center;
}

.video-placeholder p { font-size: 1.05em; margin-bottom: 8px; }
.video-placeholder .nota { font-size: 0.85em; opacity: 0.6; }

/* FORMULARIO */
.form-contacto {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-contacto input,
.form-contacto textarea {
  padding: 13px 16px;
  border: 1px solid #d0d5dc;
  border-radius: 4px;
  font-size: 0.95em;
  font-family: inherit;
  background: white;
  transition: border-color 0.2s;
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #1a1f2e;
}

.btn-whatsapp {
  background: #1a1f2e;
  color: white;
  text-decoration: none;
  padding: 14px;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  transition: background 0.2s;
  font-size: 0.92em;
  margin-top: 4px;
}

.btn-whatsapp:hover { background: #4ec9b0; color: #0f1419; }

/* PASOS NUEVOS */
.lista-pasos {
  max-width: 700px;
  margin: 0 auto;
  border-top: 1px solid #eef0f2;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 28px;
  padding: 24px 4px;
  border-bottom: 1px solid #eef0f2;
}

.paso-numero {
  color: #4ec9b0;
  font-size: 1.1em;
  font-weight: 700;
  letter-spacing: -0.02em;
  min-width: 36px;
  font-variant-numeric: tabular-nums;
  padding-top: 2px;
}

.paso p { flex: 1; padding-top: 2px; color: #1a1f2e; font-size: 0.98em; }

/* DONACIONES */
.metodos-donacion {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.metodo {
  background: white;
  padding: 16px 24px;
  border-radius: 4px;
  border: 1px solid #eef0f2;
  color: #1a1f2e;
  font-weight: 500;
  font-size: 0.92em;
}

#donaciones { text-align: center; }
#donaciones .seccion-header { text-align: left; }
#donaciones .btn-cta { margin: 0 auto; }

/* GALERIA */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 1000px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #e8f4f0, #d4ebe3);
  aspect-ratio: 1;
  border-radius: 4px;
}

/* BLOG */
.lista-posts {
  max-width: 800px;
  margin: 0 auto;
  border-top: 1px solid #eef0f2;
}

.post {
  padding: 28px 4px;
  border-bottom: 1px solid #eef0f2;
  transition: padding 0.2s, background 0.2s;
}

.post:hover {
  padding-left: 12px;
  padding-right: 12px;
  background: rgba(78, 201, 176, 0.04);
}

.post-fecha {
  color: #4ec9b0;
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.post h3 {
  color: #1a1f2e;
  font-size: 1.2em;
  margin: 8px 0 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.leer-mas {
  color: #4ec9b0;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88em;
}

/* REDES */
.iconos-redes {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.red-social {
  background: white;
  color: #1a1f2e;
  padding: 11px 22px;
  border-radius: 4px;
  border: 1px solid #d0d5dc;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.15s;
  font-size: 0.88em;
}

.red-social:hover {
  background: #1a1f2e;
  color: white;
  border-color: #1a1f2e;
}

/* FOOTER */
footer {
  background: #0f1419;
  color: white;
  padding: 50px 24px;
  text-align: center;
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-size: 1.15em;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.footer-content p { margin-bottom: 8px; opacity: 0.55; font-size: 0.88em; }
.footer-content a { color: #4ec9b0; text-decoration: none; }

.footer-copy {
  margin-top: 24px !important;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-size: 0.78em;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .hero { min-height: 70vh; padding: 60px 20px; }
  .hero-content { margin-left: 0; }
  .hero h1 { font-size: 2.2em; }
  .hero .lema { font-size: 0.98em; }

  h2 { font-size: 1.7em; }
  .seccion { padding: 70px 20px; }
  .seccion-header { margin-bottom: 40px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 16px 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .menu-toggle:checked ~ .navbar .nav-links { transform: translateX(0); }

  .nav-link {
    padding: 14px 24px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1em;
  }

  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 6px);
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(2) { opacity: 0; }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -6px);
  }

  .grid-3 { grid-template-columns: 1fr; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }
  .metodos-donacion { flex-direction: column; align-items: stretch; }

  .evento {
    grid-template-columns: 70px 1fr auto;
    gap: 16px;
  }
  .evento-flecha { display: none; }
  .fecha-dia { font-size: 1.4em; }
}
`;
}

module.exports = { generarPlantillaContemporanea: generarPlantilla };