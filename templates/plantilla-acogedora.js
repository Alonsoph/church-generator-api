// Plantilla ACOGEDORA: cálida, familiar
// Cards tipo burbuja (border-radius grande), botones pill, hero con foto orgánica,
// patrón sutil de fondo. Terracota + crema + verde oliva. Fraunces + Nunito Sans.

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
<base target="_self">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${nombre}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
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

<header class="hero">
  <div class="hero-grid">
    <div class="hero-texto">
      <span class="hero-pill">Bienvenidos a casa</span>
      <h1>${nombre}</h1>
      <p class="lema">${lema}</p>
      <a href="#contacto" class="btn-cta">${contenido.hero_cta || 'Conócenos'}</a>
    </div>
    <div class="hero-visual">
      <div class="hero-foto" ${fotoPrincipal ? `style="background-image: url('${fotoPrincipal}')"` : ''}>
        ${!fotoPrincipal ? `<div class="hero-foto-deco"></div>` : ''}
      </div>
      <div class="hero-circulo-pequeno"></div>
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
    <h2>Horarios y ubicación</h2>
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
      <strong>Nuestra dirección</strong>
      <span>${direccionCompleta}</span>
    </div>
    ${direccion ? `
    <div class="mapa-contenedor">
      <iframe src="${mapaSrc}" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
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
    { fecha_dia: '15', fecha_mes: 'JUN', titulo: 'Vigilia de oración', hora: '20:00' },
    { fecha_dia: '22', fecha_mes: 'JUN', titulo: 'Encuentro de jóvenes', hora: '18:00' },
    { fecha_dia: '05', fecha_mes: 'JUL', titulo: 'Retiro espiritual', hora: '09:00' },
  ];
  return `
<section id="eventos" class="seccion">
  <div class="contenedor">
    <h2>Próximos eventos</h2>
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
<section id="transmision" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Transmisión en vivo</h2>
    <p class="subtitulo">${c.transmision_intro || 'Acompáñanos desde donde estés'}</p>
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
    <h2>Nuestros ministerios</h2>
    <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para ti en nuestra familia'}</p>
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
<section id="contacto" class="seccion seccion-clara">
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
    'Llega unos minutos antes y te recibiremos con un abrazo',
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
          <span class="paso-numero">${i + 1}</span>
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
    <h2>Donaciones y ofrendas</h2>
    <p class="subtitulo">${c.donaciones_intro || 'Tu generosidad sostiene la obra'}</p>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia</div>
      <div class="metodo">Tarjeta</div>
      <div class="metodo">Pago móvil</div>
    </div>
    <div style="text-align:center;">
      <a href="#contacto" class="btn-cta">Quiero donar</a>
    </div>
  </div>
</section>`;
}

function seccionGaleria() {
  return `
<section id="galeria" class="seccion">
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
<section id="blog" class="seccion seccion-clara">
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

function seccionRedes(whatsappLink) {
  return `
<section id="redes" class="seccion">
  <div class="contenedor">
    <h2>Síguenos</h2>
    <p class="subtitulo">Conéctate con nosotros</p>
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
// CSS — ACOGEDORA (cards burbuja, pills, patrón sutil, hero orgánico)
// ============================================
function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Nunito Sans', -apple-system, sans-serif;
  color: #3d2f24;
  line-height: 1.7;
  background:
    radial-gradient(circle at 1px 1px, rgba(200, 116, 86, 0.06) 1px, transparent 0),
    #fdf8f3;
  background-size: 24px 24px;
  font-weight: 400;
}

/* NAVBAR */
.menu-toggle { display: none; }

.navbar {
  position: sticky;
  top: 0;
  background: #fdf8f3;
  z-index: 1000;
  height: 72px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo { height: 44px; width: auto; }

.logo-text {
  font-family: 'Fraunces', serif;
  font-size: 1.4em;
  font-weight: 600;
  color: #c87456;
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: #3d2f24;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92em;
  transition: color 0.2s;
}

.nav-link:hover { color: #c87456; }

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
  background: #3d2f24;
  border-radius: 2px;
  transition: all 0.3s;
}

/* HERO con foto orgánica */
.hero {
  background: transparent;
  padding: 60px 28px 100px;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(122, 143, 94, 0.12), transparent 65%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.hero-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero-texto { max-width: 560px; }

.hero-pill {
  display: inline-block;
  background: rgba(200, 116, 86, 0.12);
  color: #c87456;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.82em;
  font-weight: 700;
  letter-spacing: 0.2px;
  margin-bottom: 24px;
}

.hero h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.6em, 5.5vw, 4.4em);
  font-weight: 600;
  margin-bottom: 22px;
  line-height: 1.05;
  letter-spacing: -1.5px;
  color: #3d2f24;
}

.hero .lema {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #6b5848;
  font-weight: 400;
  line-height: 1.55;
}

.btn-cta {
  display: inline-block;
  background: #c87456;
  color: #fdf8f3;
  padding: 16px 36px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95em;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 8px 20px rgba(200, 116, 86, 0.25);
}

.btn-cta:hover {
  background: #b5644a;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(200, 116, 86, 0.35);
}

/* Foto hero con borde orgánico */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-foto {
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1 / 1.1;
  background-color: #7a8f5e;
  background-size: cover;
  background-position: center;
  border-radius: 58% 42% 50% 50% / 45% 55% 45% 55%;
  position: relative;
  box-shadow: 0 24px 60px rgba(122, 143, 94, 0.25);
  overflow: hidden;
}

.hero-foto-deco {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 30%, rgba(200, 116, 86, 0.35), transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(253, 248, 243, 0.2), transparent 50%);
}

.hero-circulo-pequeno {
  position: absolute;
  bottom: 10%;
  right: 5%;
  width: 110px;
  height: 110px;
  background: #c87456;
  border-radius: 50%;
  opacity: 0.18;
  z-index: -1;
}

/* SECCIONES */
.seccion {
  padding: 100px 28px;
  scroll-margin-top: 90px;
}

.seccion-clara {
  background: #f5ebe0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(200, 116, 86, 0.08) 1px, transparent 0);
  background-size: 24px 24px;
}

.contenedor { max-width: 1100px; margin: 0 auto; }

h2 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2em, 4vw, 2.8em);
  color: #3d2f24;
  text-align: center;
  margin-bottom: 14px;
  font-weight: 600;
  letter-spacing: -1px;
  line-height: 1.1;
}

.subtitulo {
  text-align: center;
  color: #6b5848;
  font-size: 1.1em;
  margin-bottom: 56px;
  font-weight: 400;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* CARDS tipo burbuja */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  background: #fdf8f3;
  padding: 40px 32px;
  border-radius: 28px;
  border: 1px solid rgba(200, 116, 86, 0.12);
  transition: all 0.3s;
  text-align: center;
}

.seccion-clara .card { background: #fdf8f3; }

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(122, 92, 70, 0.12);
  border-color: rgba(200, 116, 86, 0.3);
}

.card h3 {
  font-family: 'Fraunces', serif;
  color: #3d2f24;
  font-size: 1.4em;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.card p {
  color: #6b5848;
  margin-bottom: 14px;
  font-size: 0.95em;
}

.card .meta {
  display: block;
  color: #7a8f5e;
  font-size: 0.88em;
  font-weight: 700;
  margin-top: 10px;
}

.btn-secundario {
  background: transparent;
  color: #c87456;
  border: 1.5px solid #c87456;
  padding: 10px 24px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s;
  font-size: 0.88em;
  font-family: inherit;
}

.btn-secundario:hover {
  background: #c87456;
  color: #fdf8f3;
}

/* UBICACIÓN */
.ubicacion-box {
  background: #fdf8f3;
  max-width: 640px;
  margin: 40px auto 0;
  padding: 28px 32px;
  border-radius: 24px;
  border: 1px solid rgba(200, 116, 86, 0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.ubicacion-box strong {
  color: #c87456;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.ubicacion-box span {
  color: #3d2f24;
  font-size: 1.1em;
  font-family: 'Fraunces', serif;
  font-weight: 500;
}

.mapa-contenedor {
  max-width: 950px;
  margin: 36px auto 0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(122, 92, 70, 0.1);
}

/* EVENTOS — píldoras grandes */
.lista-eventos {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evento {
  display: flex;
  align-items: center;
  background: #fdf8f3;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(200, 116, 86, 0.12);
  transition: all 0.25s;
}

.seccion-clara .evento { background: #fdf8f3; }

.evento:hover {
  transform: translateX(4px);
  box-shadow: 0 12px 32px rgba(122, 92, 70, 0.1);
  border-color: rgba(200, 116, 86, 0.3);
}

.evento-fecha {
  background: #7a8f5e;
  color: #fdf8f3;
  padding: 24px 28px;
  text-align: center;
  min-width: 100px;
  display: flex;
  flex-direction: column;
}

.fecha-dia {
  font-family: 'Fraunces', serif;
  font-size: 1.9em;
  font-weight: 600;
  line-height: 1;
}

.fecha-mes {
  font-size: 0.75em;
  opacity: 0.9;
  margin-top: 4px;
  letter-spacing: 0.15em;
  font-weight: 700;
}

.evento-info { padding: 22px 28px; }

.evento-info h3 {
  font-family: 'Fraunces', serif;
  color: #3d2f24;
  font-size: 1.25em;
  font-weight: 600;
  margin-bottom: 4px;
}

.evento-hora {
  color: #c87456;
  font-weight: 700;
  font-size: 0.88em;
}

/* VIDEO */
.video-placeholder {
  background: #7a8f5e;
  color: #fdf8f3;
  max-width: 780px;
  margin: 0 auto;
  border-radius: 28px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(122, 143, 94, 0.2);
}

.video-placeholder p {
  font-family: 'Fraunces', serif;
  font-size: 1.3em;
  margin-bottom: 12px;
}

.video-placeholder .nota {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 0.9em;
  opacity: 0.85;
}

/* FORMULARIO */
.form-contacto {
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-contacto input,
.form-contacto textarea {
  padding: 16px 22px;
  border: 1px solid rgba(200, 116, 86, 0.2);
  border-radius: 24px;
  font-size: 0.95em;
  font-family: inherit;
  background: #fdf8f3;
  color: #3d2f24;
}

.form-contacto textarea { border-radius: 20px; resize: vertical; }

.form-contacto input::placeholder,
.form-contacto textarea::placeholder {
  color: rgba(61, 47, 36, 0.5);
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #c87456;
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

/* PASOS NUEVOS — píldoras */
.lista-pasos {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paso {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #fdf8f3;
  padding: 24px 28px;
  border-radius: 999px;
  border: 1px solid rgba(200, 116, 86, 0.12);
}

.seccion-clara .paso { background: #fdf8f3; }

.paso-numero {
  background: #c87456;
  color: #fdf8f3;
  min-width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 1.1em;
  flex-shrink: 0;
}

.paso p {
  flex: 1;
  color: #3d2f24;
  font-size: 1em;
}

/* DONACIONES */
.metodos-donacion {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.metodo {
  background: #fdf8f3;
  padding: 18px 30px;
  border-radius: 999px;
  border: 1px solid rgba(200, 116, 86, 0.2);
  color: #3d2f24;
  font-weight: 600;
  font-size: 0.95em;
}

/* GALERIA */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #d4b89a, #c87456);
  aspect-ratio: 1;
  border-radius: 24px;
  transition: transform 0.3s;
}

.foto-placeholder:hover { transform: scale(1.02); }

/* BLOG */
.lista-posts {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.post {
  background: #fdf8f3;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(200, 116, 86, 0.12);
  transition: all 0.25s;
}

.seccion-clara .post { background: #fdf8f3; }

.post:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(122, 92, 70, 0.1);
}

.post-fecha {
  color: #c87456;
  font-size: 0.78em;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'Fraunces', serif;
  color: #3d2f24;
  font-size: 1.4em;
  font-weight: 600;
  margin: 10px 0 14px;
  letter-spacing: -0.3px;
}

.leer-mas {
  color: #7a8f5e;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9em;
  border-bottom: 2px solid #7a8f5e;
  padding-bottom: 2px;
}

/* REDES — píldoras */
.iconos-redes {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.red-social {
  background: #fdf8f3;
  color: #3d2f24;
  padding: 14px 28px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid rgba(200, 116, 86, 0.2);
  transition: all 0.2s;
  font-size: 0.92em;
}

.red-social:hover {
  background: #c87456;
  color: #fdf8f3;
  border-color: #c87456;
  transform: translateY(-2px);
}

/* FOOTER */
footer {
  background: #3d2f24;
  color: rgba(253, 248, 243, 0.75);
  padding: 60px 28px;
  text-align: center;
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.5em;
  margin-bottom: 14px;
  font-weight: 600;
  color: #fdf8f3;
}

.footer-content p { margin-bottom: 8px; font-size: 0.92em; }

.footer-content a { color: #c87456; text-decoration: none; font-weight: 600; }

.footer-copy {
  margin-top: 28px !important;
  padding-top: 28px;
  border-top: 1px solid rgba(253, 248, 243, 0.1);
  font-size: 0.8em;
  opacity: 0.55;
}

/* RESPONSIVO */
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .hero-visual { order: -1; }
  .hero-foto { max-width: 340px; aspect-ratio: 1; }
  .hero-texto { text-align: center; max-width: 100%; }
}

@media (max-width: 768px) {
  .hero { padding: 40px 20px 60px; min-height: auto; }
  .seccion { padding: 70px 20px; }
  .nav-container { padding: 0 20px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fdf8f3;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 20px 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-top: 1px solid rgba(200, 116, 86, 0.15);
  }

  .menu-toggle:checked ~ .navbar .nav-links { transform: translateX(0); }

  .nav-link {
    padding: 18px 28px;
    border-bottom: 1px solid rgba(200, 116, 86, 0.1);
    font-size: 1em;
  }

  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(2) { opacity: 0; }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  .grid-3 { grid-template-columns: 1fr; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }
  .metodos-donacion { flex-direction: column; align-items: stretch; }

  .paso {
    border-radius: 24px;
    flex-direction: row;
    align-items: flex-start;
  }
  .paso-numero { width: 40px; height: 40px; min-width: 40px; }

  .evento-fecha { padding: 18px; min-width: 84px; }
  .fecha-dia { font-size: 1.5em; }
}
`;
}

module.exports = { generarPlantillaAcogedora: generarPlantilla };