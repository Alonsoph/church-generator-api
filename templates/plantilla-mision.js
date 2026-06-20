// Plantilla MISIÓN — activa, evangelística
// Hero dividido 50/50, naranja energético, estilo "campaign"

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

  // ORDEN MISIÓN: Nuevos → Ministerios → Eventos → Donaciones → Predicaciones →
  //               Contacto → Horarios → Transmisión → Galería → Blog → Redes
  let navLinks = '';
  let secciones = '';

  if (func.pagina_nuevos_visitantes) {
    navLinks += `<a href="#nuevos" class="nav-link">Nuevos</a>`;
    secciones += seccionNuevos(contenido);
  }
  if (func.ministerios) {
    navLinks += `<a href="#ministerios" class="nav-link">Ministerios</a>`;
    secciones += seccionMinisterios(contenido);
  }
  if (func.calendario_eventos) {
    navLinks += `<a href="#eventos" class="nav-link">Eventos</a>`;
    secciones += seccionEventos(contenido);
  }
  if (func.donaciones) {
    navLinks += `<a href="#donaciones" class="nav-link">Donar</a>`;
    secciones += seccionDonaciones(contenido);
  }
  if (func.biblioteca_sermones) {
    navLinks += `<a href="#predicaciones" class="nav-link">Predicaciones</a>`;
    secciones += seccionPredicaciones(contenido);
  }
  if (func.formulario_contacto) {
    navLinks += `<a href="#contacto" class="nav-link">Contacto</a>`;
    secciones += seccionContacto(whatsappLink);
  }
  if (func.horarios_ubicacion) {
    navLinks += `<a href="#horarios" class="nav-link">Horarios</a>`;
    secciones += seccionHorarios(contenido, direccion, ciudad);
  }
  if (func.transmision_vivo) {
    navLinks += `<a href="#transmision" class="nav-link">En vivo</a>`;
    secciones += seccionTransmision(contenido);
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
<base target="_self">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${nombre}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
  <div class="hero-grid">
    <div class="hero-texto">
      <div class="hero-badge">Tu iglesia te espera</div>
      <h1>${nombre}</h1>
      <p class="lema">${lema}</p>
      <div class="hero-cta-group">
        <a href="#nuevos" class="btn-cta">${contenido.hero_cta || 'Quiero conocer más'}</a>
        <a href="#horarios" class="btn-cta-ghost">Ver horarios</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-foto" ${fotoPrincipal ? `style="background-image: url('${fotoPrincipal}')"` : ''}>
        ${!fotoPrincipal ? `
          <div class="hero-circulo"></div>
          <div class="hero-blob"></div>
        ` : ''}
      </div>
    </div>
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
    <span class="seccion-eyebrow">Bienvenido</span>
    <h2>¿Es tu primera vez?</h2>
    <p class="subtitulo">${c.nuevos_intro || 'Queremos que te sientas como en casa'}</p>
    <div class="grid-pasos">
      ${pasos.map((p, i) => `
        <div class="paso-card">
          <div class="paso-num">${String(i + 1).padStart(2, '0')}</div>
          <p>${p}</p>
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
<section id="ministerios" class="seccion seccion-alt">
  <div class="contenedor">
    <span class="seccion-eyebrow">Únete</span>
    <h2>Nuestros Ministerios</h2>
    <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para ti en nuestra comunidad'}</p>
    <div class="grid-3">
      ${ministerios.map(m => `
        <div class="card">
          <div class="card-marca"></div>
          <h3>${m.nombre}</h3>
          <p>${m.descripcion}</p>
          <span class="card-meta">Líder · ${m.lider}</span>
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
    <span class="seccion-eyebrow">Agenda</span>
    <h2>Próximos Eventos</h2>
    <p class="subtitulo">${c.eventos_intro || 'Acompáñanos en nuestras actividades'}</p>
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
          <div class="evento-flecha">→</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionDonaciones(c) {
  return `
<section id="donaciones" class="seccion seccion-naranja">
  <div class="contenedor contenedor-centrado">
    <span class="seccion-eyebrow seccion-eyebrow-blanco">Sé parte</span>
    <h2 class="h2-blanco">Apoya la Misión</h2>
    <p class="subtitulo subtitulo-blanco">${c.donaciones_intro || 'Tu generosidad sostiene la obra'}</p>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia</div>
      <div class="metodo">Tarjeta</div>
      <div class="metodo">Pago Móvil</div>
    </div>
    <a href="#contacto" class="btn-cta-blanco">Quiero Donar</a>
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
    <span class="seccion-eyebrow">La Palabra</span>
    <h2>Predicaciones</h2>
    <p class="subtitulo">${c.predicaciones_intro || 'Escucha y crece en tu fe'}</p>
    <div class="grid-3">
      ${predicaciones.map(p => `
        <div class="card">
          <div class="card-marca"></div>
          <h3>${p.titulo}</h3>
          <span class="card-meta">${p.predicador}</span>
          <button class="btn-card">Escuchar →</button>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionContacto(whatsappLink) {
  return `
<section id="contacto" class="seccion seccion-alt">
  <div class="contenedor">
    <span class="seccion-eyebrow">Conecta</span>
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
    <span class="seccion-eyebrow">Visítanos</span>
    <h2>Horarios y Ubicación</h2>
    <p class="subtitulo">${c.horarios_intro || 'Te esperamos cada semana'}</p>
    <div class="grid-3">
      ${horarios.map(h => `
        <div class="card">
          <div class="card-marca"></div>
          <h3>${h.titulo}</h3>
          <p class="card-hora">${h.horario}</p>
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

function seccionTransmision(c) {
  return `
<section id="transmision" class="seccion seccion-alt">
  <div class="contenedor">
    <span class="seccion-eyebrow">En vivo</span>
    <h2>Transmisión en Vivo</h2>
    <p class="subtitulo">${c.transmision_intro || 'Acompáñanos desde donde estés'}</p>
    <div class="video-box">
      <p class="video-titulo">Aquí se mostrará la transmisión</p>
      <p class="video-nota">${c.transmision_nota || 'Transmitimos cada domingo a las 10:00 AM'}</p>
    </div>
  </div>
</section>`;
}

function seccionGaleria() {
  return `
<section id="galeria" class="seccion">
  <div class="contenedor">
    <span class="seccion-eyebrow">Comunidad</span>
    <h2>Galería</h2>
    <p class="subtitulo">Momentos de nuestra iglesia</p>
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
    <span class="seccion-eyebrow">Reflexiones</span>
    <h2>Devocionales</h2>
    <p class="subtitulo">${c.blog_intro || 'Alimenta tu espíritu cada semana'}</p>
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

function seccionRedes(whatsappLink) {
  return `
<section id="redes" class="seccion">
  <div class="contenedor contenedor-centrado">
    <span class="seccion-eyebrow">Síguenos</span>
    <h2>Redes Sociales</h2>
    <p class="subtitulo">Conéctate con nosotros</p>
    <div class="iconos-redes">
      <a href="#" class="red-social">Facebook</a>
      <a href="#" class="red-social">Instagram</a>
      <a href="#" class="red-social">YouTube</a>
      <a href="${whatsappLink}" class="red-social red-wa">WhatsApp</a>
    </div>
  </div>
</section>`;
}

// ============================================
// CSS BASE — MISIÓN
// ============================================

function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1a1f3a;
  line-height: 1.65;
  background: #fff9f0;
  font-weight: 400;
}

/* ============ NAVBAR ============ */
.menu-toggle { display: none; }

.navbar {
  position: sticky;
  top: 0;
  background: rgba(255, 249, 240, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  height: 64px;
  border-bottom: 1px solid rgba(26, 31, 58, 0.06);
}

.nav-container {
  max-width: 1300px;
  margin: 0 auto;
  height: 100%;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo { height: 42px; width: auto; }

.logo-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.15em;
  font-weight: 800;
  color: #2547d0;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  color: #1a1f3a;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9em;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-link:hover { color: #ff6b35; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  width: 24px;
  height: 2px;
  background: #1a1f3a;
  border-radius: 2px;
  transition: all 0.3s;
}

/* ============ HERO 50/50 ============ */
.hero {
  background: #fff9f0;
  padding: 60px 32px 100px;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -200px;
  right: -200px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 107, 53, 0.08), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-grid {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 80px;
  align-items: center;
  width: 100%;
  position: relative;
}

.hero-texto { max-width: 580px; }

.hero-badge {
  display: inline-block;
  background: rgba(255, 107, 53, 0.12);
  color: #ff6b35;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-bottom: 24px;
}

.hero h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(2.4em, 5.5vw, 4.2em);
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.05;
  color: #1a1f3a;
  letter-spacing: -1.5px;
}

.hero .lema {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: rgba(26, 31, 58, 0.7);
  font-weight: 400;
  line-height: 1.5;
}

.hero-cta-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-cta {
  display: inline-block;
  background: #ff6b35;
  color: white;
  padding: 16px 32px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95em;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.25);
}

.btn-cta:hover {
  background: #e85a25;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 107, 53, 0.35);
}

.btn-cta-ghost {
  display: inline-block;
  background: white;
  color: #1a1f3a;
  padding: 16px 32px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95em;
  transition: all 0.2s;
  border: 1px solid rgba(26, 31, 58, 0.12);
  cursor: pointer;
  font-family: inherit;
}

.btn-cta-ghost:hover {
  border-color: #2547d0;
  color: #2547d0;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-foto {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 4 / 5;
  background-color: #2547d0;
  background-size: cover;
  background-position: center;
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(37, 71, 208, 0.25);
}

.hero-circulo {
  position: absolute;
  top: 20%;
  right: 15%;
  width: 180px;
  height: 180px;
  background: rgba(255, 107, 53, 0.4);
  border-radius: 50%;
  filter: blur(20px);
}

.hero-blob {
  position: absolute;
  bottom: 10%;
  left: 10%;
  width: 220px;
  height: 220px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  filter: blur(30px);
}

/* ============ SECCIONES ============ */
.seccion {
  padding: 110px 32px;
  scroll-margin-top: 80px;
  background: #fff9f0;
}

.seccion-alt { background: #fff3e2; }

.seccion-naranja { background: #ff6b35; }

.contenedor { max-width: 1200px; margin: 0 auto; }

.contenedor-centrado { text-align: center; }

.seccion-eyebrow {
  display: inline-block;
  background: rgba(37, 71, 208, 0.08);
  color: #2547d0;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.seccion-eyebrow-blanco {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.contenedor-centrado .seccion-eyebrow {
  margin: 0 auto 16px;
}

h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(2em, 4vw, 3em);
  color: #1a1f3a;
  margin-bottom: 14px;
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.1;
}

.contenedor-centrado h2 { text-align: center; }

.h2-blanco { color: white; }

.subtitulo {
  color: rgba(26, 31, 58, 0.65);
  font-size: 1.05em;
  margin-bottom: 56px;
  max-width: 600px;
  font-weight: 400;
}

.contenedor-centrado .subtitulo {
  margin: 0 auto 48px;
  text-align: center;
}

.subtitulo-blanco {
  color: rgba(255, 255, 255, 0.85);
}

/* ============ PASOS NUEVOS ============ */
.grid-pasos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.paso-card {
  background: white;
  padding: 32px 28px;
  border-radius: 24px;
  border: 1px solid rgba(26, 31, 58, 0.06);
  transition: all 0.25s;
}

.paso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(26, 31, 58, 0.08);
  border-color: rgba(255, 107, 53, 0.3);
}

.paso-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #ff6b35;
  font-size: 1.6em;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 16px;
}

.paso-card p {
  color: #1a1f3a;
  font-size: 1em;
  line-height: 1.55;
}

/* ============ CARDS ============ */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: white;
  padding: 36px 28px;
  border-radius: 24px;
  border: 1px solid rgba(26, 31, 58, 0.06);
  transition: all 0.25s;
  position: relative;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(26, 31, 58, 0.08);
}

.card-marca {
  width: 40px;
  height: 4px;
  background: #ff6b35;
  border-radius: 999px;
  margin-bottom: 20px;
}

.card h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1f3a;
  font-size: 1.25em;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.card p {
  color: rgba(26, 31, 58, 0.65);
  margin-bottom: 14px;
  font-size: 0.95em;
}

.card-hora {
  color: #2547d0 !important;
  font-size: 1em !important;
  font-weight: 600;
}

.card-meta {
  display: block;
  color: #2547d0;
  font-size: 0.82em;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-top: 8px;
}

.btn-card {
  background: transparent;
  color: #ff6b35;
  border: none;
  padding: 0;
  font-size: 0.9em;
  font-weight: 700;
  cursor: pointer;
  margin-top: 18px;
  font-family: inherit;
  transition: opacity 0.2s;
}

.btn-card:hover { opacity: 0.7; }

/* ============ UBICACIÓN ============ */
.ubicacion-box {
  background: white;
  max-width: 700px;
  margin: 36px auto 0;
  padding: 28px 32px;
  border-radius: 20px;
  border: 1px solid rgba(26, 31, 58, 0.06);
  border-left: 4px solid #ff6b35;
}

.ubicacion-label {
  display: block;
  color: #ff6b35;
  font-size: 0.72em;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 700;
}

.ubicacion-box p {
  color: #1a1f3a;
  font-size: 1.05em;
  font-weight: 500;
}

.mapa-contenedor {
  max-width: 1000px;
  margin: 40px auto 0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(26, 31, 58, 0.08);
}

/* ============ EVENTOS ============ */
.lista-eventos {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evento {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(26, 31, 58, 0.06);
  transition: all 0.2s;
  gap: 0;
}

.evento:hover {
  transform: translateX(4px);
  box-shadow: 0 12px 32px rgba(26, 31, 58, 0.08);
  border-color: rgba(255, 107, 53, 0.3);
}

.evento-fecha {
  background: linear-gradient(135deg, #2547d0, #1a36a8);
  color: white;
  padding: 24px 28px;
  text-align: center;
  min-width: 100px;
  display: flex;
  flex-direction: column;
}

.fecha-dia {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.8em;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}

.fecha-mes {
  font-size: 0.75em;
  opacity: 0.9;
  margin-top: 4px;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.evento-info { padding: 22px 28px; flex: 1; }

.evento-info h3 {
  color: #1a1f3a;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.15em;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.evento-hora {
  color: #ff6b35;
  font-size: 0.85em;
  font-weight: 600;
}

.evento-flecha {
  padding: 0 28px;
  color: #ff6b35;
  font-size: 1.4em;
  font-weight: 700;
}

/* ============ DONACIONES (naranja) ============ */
.seccion-naranja .seccion-eyebrow { margin-bottom: 16px; }

.metodos-donacion {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto 40px;
  max-width: 700px;
}

.metodo {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 18px 28px;
  border-radius: 999px;
  color: white;
  font-weight: 600;
  font-size: 0.95em;
}

.btn-cta-blanco {
  display: inline-block;
  background: white;
  color: #ff6b35;
  padding: 16px 40px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1em;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-cta-blanco:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
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
  border: 1px solid rgba(26, 31, 58, 0.12);
  border-radius: 14px;
  font-size: 0.95em;
  font-family: inherit;
  background: white;
  color: #1a1f3a;
}

.form-contacto input::placeholder,
.form-contacto textarea::placeholder {
  color: rgba(26, 31, 58, 0.4);
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #ff6b35;
}

.btn-whatsapp {
  background: #25D366;
  color: white;
  text-decoration: none;
  padding: 16px;
  border-radius: 999px;
  font-weight: 700;
  text-align: center;
  transition: background 0.2s;
}

.btn-whatsapp:hover { background: #1da851; }

/* ============ VIDEO TRANSMISIÓN ============ */
.video-box {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #2547d0, #1a36a8);
  color: white;
  padding: 80px 40px;
  border-radius: 28px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(37, 71, 208, 0.2);
}

.video-titulo {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 12px;
}

.video-nota {
  opacity: 0.85;
  font-size: 0.95em;
}

/* ============ GALERIA ============ */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #ffb89a, #ff6b35);
  aspect-ratio: 1;
  border-radius: 20px;
}

/* ============ BLOG ============ */
.lista-posts {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post {
  background: white;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(26, 31, 58, 0.06);
  transition: all 0.2s;
}

.post:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(26, 31, 58, 0.08);
}

.post-fecha {
  color: #ff6b35;
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1f3a;
  font-size: 1.35em;
  font-weight: 700;
  margin: 10px 0 14px;
  letter-spacing: -0.5px;
}

.leer-mas {
  color: #2547d0;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9em;
}

/* ============ REDES ============ */
.iconos-redes {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 700px;
  margin: 0 auto;
}

.red-social {
  background: white;
  color: #1a1f3a;
  padding: 16px 28px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid rgba(26, 31, 58, 0.08);
  transition: all 0.2s;
  font-size: 0.95em;
}

.red-social:hover {
  border-color: #ff6b35;
  color: #ff6b35;
  transform: translateY(-2px);
}

.red-wa { background: #25D366; color: white; border-color: #25D366; }
.red-wa:hover { background: #1da851; color: white; border-color: #1da851; }

/* ============ FOOTER ============ */
footer {
  background: #1a1f3a;
  color: rgba(255, 255, 255, 0.7);
  padding: 60px 32px;
  text-align: center;
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.5em;
  font-weight: 800;
  margin-bottom: 14px;
  color: white;
  letter-spacing: -0.5px;
}

.footer-content p { margin-bottom: 8px; font-size: 0.92em; }

.footer-content a { color: #ff6b35; text-decoration: none; font-weight: 600; }

.footer-copy {
  margin-top: 28px !important;
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.82em;
  opacity: 0.55;
}

/* ============ RESPONSIVO ============ */
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .hero-visual { order: -1; }
  .hero-foto { max-width: 360px; aspect-ratio: 1; }
}

@media (max-width: 768px) {
  .hero { padding: 40px 20px 60px; }
  .seccion { padding: 80px 20px; }
  .nav-container { padding: 0 20px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff9f0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 16px 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-top: 1px solid rgba(26, 31, 58, 0.06);
  }

  .menu-toggle:checked ~ .navbar .nav-links { transform: translateX(0); }

  .nav-link {
    padding: 18px 24px;
    border-bottom: 1px solid rgba(26, 31, 58, 0.06);
    font-size: 1em;
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

  .evento-fecha { padding: 18px; min-width: 80px; }
  .fecha-dia { font-size: 1.4em; }
  .evento-flecha { padding: 0 18px; }

  .video-box { padding: 60px 24px; }
  .metodos-donacion { flex-direction: column; align-items: center; }
}
`;
}

module.exports = { generarPlantillaMision: generarPlantilla };