// Plantilla TRANSMISIÓN — streaming-first
// Navbar compacto oscuro, hero dividido con video grande, estilo tipo Netflix/Twitch

function generarPlantilla(datos, contenido) {
  const nombre = datos.iglesia?.nombre || 'Iglesia';
  const lema = datos.iglesia?.lema || '';
  const direccion = datos.ubicacion?.direccion || '';
  const ciudad = datos.ubicacion?.ciudad || '';
  const whatsapp = datos.redes_sociales?.whatsapp || '';
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#';
  const func = datos.funcionalidades_activas || {};
  const logo = datos.multimedia?.logo || '';

  // ORDEN TRANSMISIÓN: Horarios → Predicaciones → Eventos → Redes → Contacto →
  //                    Ministerios → Nuevos → Donaciones → Galería → Blog
  // La transmisión va en el hero, no como sección aparte.
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
  if (func.redes_sociales) {
    navLinks += `<a href="#redes" class="nav-link">Redes</a>`;
    secciones += seccionRedes(whatsappLink);
  }
  if (func.formulario_contacto) {
    navLinks += `<a href="#contacto" class="nav-link">Contacto</a>`;
    secciones += seccionContacto(whatsappLink);
  }
  if (func.ministerios) {
    navLinks += `<a href="#ministerios" class="nav-link">Ministerios</a>`;
    secciones += seccionMinisterios(contenido);
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

  const heroStreaming = func.transmision_vivo;
  const transmisionNota = contenido.transmision_nota || 'Transmitimos cada domingo a las 10:00 AM';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<base target="_self">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${nombre}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
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

<header class="hero">
  ${heroStreaming ? `
    <div class="hero-grid">
      <div class="hero-video">
        <div class="video-frame">
          <div class="video-play">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#fafafa" stroke-width="1.5" opacity="0.4"/>
              <path d="M32 26 L56 40 L32 54 Z" fill="#fafafa"/>
            </svg>
          </div>
          <div class="video-label">Transmisión en vivo</div>
        </div>
      </div>
      <div class="hero-info">
        <div class="badge-vivo">
          <span class="punto-pulsante"></span>
          EN VIVO
        </div>
        <h1>${nombre}</h1>
        <p class="lema">${lema}</p>
        <p class="proximo">${transmisionNota}</p>
        <div class="hero-cta-group">
          <a href="#predicaciones" class="btn-cta">Ver ahora</a>
          <a href="#horarios" class="btn-cta-secundario">Horarios</a>
        </div>
      </div>
    </div>
  ` : `
    <div class="hero-simple">
      <h1>${nombre}</h1>
      <p class="lema">${lema}</p>
      <a href="#horarios" class="btn-cta">${contenido.hero_cta || 'Conócenos'}</a>
    </div>
  `}
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
<section id="horarios" class="seccion">
  <div class="contenedor">
    <h2>Horarios y Ubicación</h2>
    <p class="subtitulo">${c.horarios_intro || 'Conéctate con nosotros'}</p>
    <div class="grid-3">
      ${horarios.map(h => `
        <div class="card">
          <div class="card-icono">●</div>
          <h3>${h.titulo}</h3>
          <p class="card-hora">${h.horario}</p>
        </div>
      `).join('')}
    </div>
    <div class="ubicacion-box">
      <span class="ubicacion-label">Ubicación</span>
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

function seccionPredicaciones(c) {
  const predicaciones = c.predicaciones || [
    { titulo: 'El poder de la fe', predicador: 'Pastor Juan Pérez' },
    { titulo: 'Caminando en gracia', predicador: 'Pastor Juan Pérez' },
    { titulo: 'Una esperanza viva', predicador: 'Pastora María' },
  ];
  return `
<section id="predicaciones" class="seccion seccion-alt">
  <div class="contenedor">
    <h2>Predicaciones</h2>
    <p class="subtitulo">${c.predicaciones_intro || 'Mira y escucha cuando quieras'}</p>
    <div class="playlist">
      ${predicaciones.map(p => `
        <div class="playlist-item">
          <div class="playlist-thumb">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M18 14 L34 24 L18 34 Z" fill="#fafafa"/>
            </svg>
          </div>
          <div class="playlist-info">
            <h3>${p.titulo}</h3>
            <p class="playlist-meta">${p.predicador}</p>
          </div>
          <button class="playlist-btn">Ver</button>
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
<section id="eventos" class="seccion">
  <div class="contenedor">
    <h2>Próximos Eventos</h2>
    <p class="subtitulo">${c.eventos_intro || 'Lo que viene en la agenda'}</p>
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

function seccionRedes(whatsappLink) {
  return `
<section id="redes" class="seccion seccion-alt">
  <div class="contenedor">
    <h2>Síguenos en Redes</h2>
    <p class="subtitulo">Donde transmitimos en vivo</p>
    <div class="iconos-redes">
      <a href="#" class="red-social">YouTube</a>
      <a href="#" class="red-social">Facebook</a>
      <a href="#" class="red-social">Instagram</a>
      <a href="${whatsappLink}" class="red-social">WhatsApp</a>
    </div>
  </div>
</section>`;
}

function seccionContacto(whatsappLink) {
  return `
<section id="contacto" class="seccion">
  <div class="contenedor">
    <h2>Contáctanos</h2>
    <p class="subtitulo">Escríbenos cuando quieras</p>
    <div class="form-contacto">
      <input type="text" placeholder="Tu nombre">
      <input type="email" placeholder="Tu correo">
      <textarea rows="4" placeholder="Tu mensaje o petición de oración"></textarea>
      <a href="${whatsappLink}" class="btn-whatsapp">Enviar por WhatsApp</a>
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
<section id="ministerios" class="seccion seccion-alt">
  <div class="contenedor">
    <h2>Nuestros Ministerios</h2>
    <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para ti'}</p>
    <div class="grid-3">
      ${ministerios.map(m => `
        <div class="card">
          <h3>${m.nombre}</h3>
          <p>${m.descripcion}</p>
          <span class="meta-roja">Líder: ${m.lider}</span>
        </div>
      `).join('')}
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
    <h2>¿Es tu primera vez?</h2>
    <p class="subtitulo">${c.nuevos_intro || 'Queremos que te sientas como en casa'}</p>
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
<section id="donaciones" class="seccion seccion-alt">
  <div class="contenedor">
    <h2>Donaciones</h2>
    <p class="subtitulo">${c.donaciones_intro || 'Tu generosidad sostiene la obra'}</p>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia</div>
      <div class="metodo">Tarjeta</div>
      <div class="metodo">Pago Móvil</div>
    </div>
    <div style="text-align:center;">
      <button class="btn-cta">Quiero Donar</button>
    </div>
  </div>
</section>`;
}

function seccionGaleria() {
  return `
<section id="galeria" class="seccion">
  <div class="contenedor">
    <h2>Galería</h2>
    <p class="subtitulo">Momentos en imágenes</p>
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
<section id="blog" class="seccion seccion-alt">
  <div class="contenedor">
    <h2>Devocionales</h2>
    <p class="subtitulo">${c.blog_intro || 'Lee y reflexiona'}</p>
    <div class="lista-posts">
      ${posts.map(p => `
        <div class="post">
          <span class="post-fecha">${p.fecha}</span>
          <h3>${p.titulo}</h3>
          <a href="#" class="leer-mas">Leer más →</a>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

// ============================================
// CSS BASE — TRANSMISIÓN
// ============================================

function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #fafafa;
  line-height: 1.7;
  background: #0f0f0f;
  font-weight: 400;
}

/* ============ NAVBAR compacto oscuro ============ */
.menu-toggle { display: none; }

.navbar {
  position: sticky;
  top: 0;
  background: #0f0f0f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 1000;
  height: 56px;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo { height: 36px; width: auto; }

.logo-text {
  font-family: 'Inter', sans-serif;
  font-size: 1em;
  font-weight: 700;
  color: #fafafa;
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  color: rgba(250, 250, 250, 0.75);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875em;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-link:hover { color: #e63946; }

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
  background: #fafafa;
  border-radius: 2px;
  transition: all 0.3s;
}

/* ============ HERO streaming ============ */
.hero {
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 60px 28px 80px;
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
}

.hero-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
}

.hero-video { width: 100%; }

.video-frame {
  background: #1a1a1a;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image:
    linear-gradient(45deg, transparent 45%, rgba(230, 57, 70, 0.05) 50%, transparent 55%),
    radial-gradient(circle at 30% 30%, rgba(230, 57, 70, 0.08), transparent 50%);
}

.video-play {
  opacity: 0.85;
  transition: transform 0.3s, opacity 0.3s;
  cursor: pointer;
}

.video-play:hover { transform: scale(1.1); opacity: 1; }

.video-label {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: #fafafa;
  font-size: 0.75em;
  padding: 6px 12px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.hero-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.badge-vivo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(230, 57, 70, 0.15);
  color: #e63946;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 24px;
  border: 1px solid rgba(230, 57, 70, 0.3);
}

.punto-pulsante {
  width: 8px;
  height: 8px;
  background: #e63946;
  border-radius: 50%;
  display: inline-block;
  animation: pulso 1.8s ease-in-out infinite;
}

@keyframes pulso {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.hero h1 {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2.2em, 4.5vw, 3.8em);
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.05;
  letter-spacing: -1.5px;
  color: #fafafa;
}

.hero .lema {
  font-size: 1.1em;
  margin-bottom: 16px;
  color: rgba(250, 250, 250, 0.7);
  font-weight: 400;
  line-height: 1.5;
}

.proximo {
  color: rgba(250, 250, 250, 0.55);
  font-size: 0.9em;
  margin-bottom: 32px;
  font-weight: 400;
}

.hero-cta-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-cta {
  display: inline-block;
  background: #e63946;
  color: #fafafa;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95em;
  transition: background 0.2s, transform 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn-cta:hover { background: #d62836; transform: translateY(-1px); }

.btn-cta-secundario {
  display: inline-block;
  background: transparent;
  color: #fafafa;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95em;
  transition: background 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.btn-cta-secundario:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.hero-simple {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

/* ============ SECCIONES ============ */
.seccion {
  padding: 100px 28px;
  scroll-margin-top: 70px;
  background: #0f0f0f;
}

.seccion-alt { background: #1a1a1a; }

.contenedor { max-width: 1200px; margin: 0 auto; }

h2 {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.8em, 3.2vw, 2.6em);
  color: #fafafa;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.subtitulo {
  text-align: center;
  color: rgba(250, 250, 250, 0.55);
  font-size: 1em;
  margin-bottom: 60px;
  font-weight: 400;
}

/* ============ CARDS estilo tile ============ */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.card {
  background: #1a1a1a;
  padding: 32px 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s;
  text-align: left;
}

.seccion-alt .card { background: #242424; }

.card:hover {
  border-color: rgba(230, 57, 70, 0.5);
  transform: translateY(-3px);
}

.card-icono {
  color: #e63946;
  font-size: 1.2em;
  margin-bottom: 16px;
  line-height: 1;
}

.card h3 {
  font-family: 'Inter', sans-serif;
  color: #fafafa;
  font-size: 1.15em;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.card p {
  color: rgba(250, 250, 250, 0.6);
  margin-bottom: 12px;
  font-size: 0.92em;
}

.card-hora {
  color: rgba(250, 250, 250, 0.85) !important;
  font-size: 0.95em !important;
  font-weight: 500;
}

.meta-roja {
  display: block;
  color: #e63946;
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-top: 12px;
}

/* ============ UBICACIÓN ============ */
.ubicacion-box {
  background: #1a1a1a;
  max-width: 700px;
  margin: 32px auto 0;
  padding: 24px 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid #e63946;
}

.seccion-alt .ubicacion-box { background: #242424; }

.ubicacion-label {
  display: block;
  color: #e63946;
  font-size: 0.7em;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 700;
}

.ubicacion-box p {
  color: #fafafa;
  font-size: 1em;
  font-weight: 500;
}

.mapa-contenedor {
  max-width: 1000px;
  margin: 40px auto 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mapa-contenedor iframe {
  filter: invert(0.9) hue-rotate(180deg) saturate(0.5);
  display: block;
}

/* ============ PLAYLIST ============ */
.playlist {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.playlist-item {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.2s;
}

.seccion-alt .playlist-item { background: #242424; }

.playlist-item:hover {
  background: #242424;
  border-color: rgba(230, 57, 70, 0.4);
}

.seccion-alt .playlist-item:hover { background: #2a2a2a; }

.playlist-thumb {
  width: 100px;
  height: 70px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.playlist-info { flex: 1; min-width: 0; }

.playlist-info h3 {
  color: #fafafa;
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
}

.playlist-meta {
  color: rgba(250, 250, 250, 0.55);
  font-size: 0.85em;
}

.playlist-btn {
  background: transparent;
  color: #fafafa;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  flex-shrink: 0;
}

.playlist-btn:hover { background: #e63946; border-color: #e63946; }

/* ============ EVENTOS ============ */
.lista-eventos {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evento {
  display: flex;
  align-items: center;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.2s, transform 0.2s;
}

.seccion-alt .evento { background: #242424; }

.evento:hover {
  border-color: rgba(230, 57, 70, 0.4);
  transform: translateX(4px);
}

.evento-fecha {
  background: #e63946;
  color: #fafafa;
  padding: 20px 24px;
  text-align: center;
  min-width: 90px;
  display: flex;
  flex-direction: column;
}

.fecha-dia {
  font-size: 1.6em;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.5px;
}

.fecha-mes {
  font-size: 0.7em;
  opacity: 0.9;
  margin-top: 4px;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.evento-info { padding: 20px 24px; flex: 1; }

.evento-info h3 {
  color: #fafafa;
  font-family: 'Inter', sans-serif;
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
}

.evento-hora {
  color: rgba(250, 250, 250, 0.55);
  font-size: 0.85em;
  font-weight: 500;
}

/* ============ REDES ============ */
.iconos-redes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  max-width: 700px;
  margin: 0 auto;
}

.red-social {
  background: #1a1a1a;
  color: #fafafa;
  padding: 18px 24px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
  font-size: 0.95em;
}

.seccion-alt .red-social { background: #242424; }

.red-social:hover { border-color: #e63946; background: #e63946; }

/* ============ FORMULARIO ============ */
.form-contacto {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-contacto input,
.form-contacto textarea {
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 0.95em;
  font-family: inherit;
  background: #1a1a1a;
  color: #fafafa;
}

.form-contacto input::placeholder,
.form-contacto textarea::placeholder {
  color: rgba(250, 250, 250, 0.4);
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #e63946;
}

.btn-whatsapp {
  background: #e63946;
  color: #fafafa;
  text-decoration: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: background 0.2s;
}

.btn-whatsapp:hover { background: #d62836; }

/* ============ PASOS NUEVOS ============ */
.lista-pasos {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  background: #1a1a1a;
  padding: 24px 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.seccion-alt .paso { background: #242424; }

.paso-numero {
  color: #e63946;
  font-size: 1.4em;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1;
  min-width: 40px;
}

.paso p {
  flex: 1;
  padding-top: 2px;
  color: rgba(250, 250, 250, 0.8);
}

/* ============ DONACIONES ============ */
.metodos-donacion {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.metodo {
  background: #1a1a1a;
  padding: 20px 32px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fafafa;
  font-weight: 500;
  font-size: 0.95em;
}

.seccion-alt .metodo { background: #242424; }

/* ============ GALERIA ============ */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 1000px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.2s;
}

.foto-placeholder:hover { border-color: rgba(230, 57, 70, 0.4); }

/* ============ BLOG ============ */
.lista-posts {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post {
  background: #1a1a1a;
  padding: 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.2s;
}

.seccion-alt .post { background: #242424; }

.post:hover { border-color: rgba(230, 57, 70, 0.4); }

.post-fecha {
  color: #e63946;
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'Inter', sans-serif;
  color: #fafafa;
  font-size: 1.3em;
  font-weight: 600;
  margin: 10px 0 14px;
  letter-spacing: -0.3px;
}

.leer-mas {
  color: #e63946;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9em;
}

/* ============ FOOTER ============ */
footer {
  background: #0a0a0a;
  color: rgba(250, 250, 250, 0.7);
  padding: 50px 28px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.3em;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fafafa;
  letter-spacing: -0.3px;
}

.footer-content p { margin-bottom: 8px; font-size: 0.92em; }

.footer-content a { color: #e63946; text-decoration: none; }

.footer-copy {
  margin-top: 24px !important;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.78em;
  opacity: 0.5;
}

/* ============ RESPONSIVO ============ */
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .hero-info { align-items: center; text-align: center; }
  .hero-cta-group { justify-content: center; }
}

@media (max-width: 768px) {
  .hero { padding: 40px 20px 60px; }
  .seccion { padding: 70px 20px; }
  .nav-container { padding: 0 20px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #0f0f0f;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 16px 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .menu-toggle:checked ~ .navbar .nav-links { transform: translateX(0); }

  .nav-link {
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 1em;
    color: #fafafa;
  }

  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .grid-3 { grid-template-columns: 1fr; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }

  .playlist-item {
    flex-wrap: wrap;
    gap: 12px;
  }
  .playlist-thumb { width: 80px; height: 56px; }
  .playlist-btn { width: 100%; }

  .evento-fecha { padding: 16px; min-width: 70px; }
  .fecha-dia { font-size: 1.3em; }
}
`;
}

module.exports = { generarPlantillaTransmision: generarPlantilla };