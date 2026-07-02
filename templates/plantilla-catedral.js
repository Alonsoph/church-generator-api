// Plantilla CATEDRAL — inmersiva, tradicional grande
// Navbar transparente sobre hero full-screen, tipografía solemne, dorado antiguo

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

  // ORDEN CATEDRAL: Horarios → Predicaciones → Eventos → Ministerios → Donaciones →
  //                 Contacto → Transmisión → Nuevos → Galería → Blog → Redes
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
  if (func.ministerios) {
    navLinks += `<a href="#ministerios" class="nav-link">Ministerios</a>`;
    secciones += seccionMinisterios(contenido);
  }
  if (func.donaciones) {
    navLinks += `<a href="#donaciones" class="nav-link">Donar</a>`;
    secciones += seccionDonaciones(contenido);
  }
  if (func.formulario_contacto) {
    navLinks += `<a href="#contacto" class="nav-link">Contacto</a>`;
    secciones += seccionContacto(whatsappLink);
  }
  if (func.transmision_vivo) {
    navLinks += `<a href="#transmision" class="nav-link">En vivo</a>`;
    secciones += seccionTransmision(contenido);
  }
  if (func.pagina_nuevos_visitantes) {
    navLinks += `<a href="#nuevos" class="nav-link">Nuevos</a>`;
    secciones += seccionNuevos(contenido);
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
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
${cssBase()}
</style>
</head>
<body>

<input type="checkbox" id="menu-toggle" class="menu-toggle">
<nav class="navbar" id="navbar">
  <div class="nav-container">
    ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : `<div class="logo-text">${nombre}</div>`}
    <label for="menu-toggle" class="hamburger">
      <span></span><span></span><span></span>
    </label>
<div class="nav-links" onclick="var t=event.target;if(t.tagName==='A'){event.preventDefault();var h=t.getAttribute('href');if(h&&h.startsWith('#')){var el=document.getElementById(h.substring(1));if(el){el.scrollIntoView({behavior:'smooth',block:'start'});}}document.getElementById('menu-toggle').checked=false;}">
  ${navLinks}
</div>
</div></nav>

<header class="hero" ${fotoPrincipal ? `style="background-image: linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.55)), url('${fotoPrincipal}')"` : ''}>
  <div class="hero-content">
    <div class="hero-decoracion"></div>
    <h1>${nombre}</h1>
    <p class="lema">${lema}</p>
    <a href="#horarios" class="btn-cta">${contenido.hero_cta || 'Conózcanos'}</a>
  </div>
</header>

<main>
${secciones}
</main>

<footer>
  <div class="footer-content">
    <div class="footer-linea"></div>
    <h3>${nombre}</h3>
    <p>${direccion}${ciudad ? ', ' + ciudad : ''}</p>
    ${whatsapp ? `<p><a href="${whatsappLink}">${whatsapp}</a></p>` : ''}
    <p class="footer-copy">© ${new Date().getFullYear()} ${nombre}. Todos los derechos reservados.</p>
  </div>
</footer>

<script>
  (function(){
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  })();
</script>

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
    <div class="seccion-titulo">
      <div class="pretitulo">Le esperamos</div>
      <h2>Horarios y Ubicación</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.horarios_intro || 'Le esperamos cada semana'}</p>
    <div class="grid-3">
      ${horarios.map(h => `
        <div class="card">
          <h3>${h.titulo}</h3>
          <p class="meta-dorada">${h.horario}</p>
        </div>
      `).join('')}
    </div>
    <div class="ubicacion-box">
      <strong>Dirección</strong>
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
    <div class="seccion-titulo">
      <div class="pretitulo">La Palabra</div>
      <h2>Predicaciones</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.predicaciones_intro || 'Escuche y crezca en su fe'}</p>
    <div class="grid-3">
      ${predicaciones.map(p => `
        <div class="card">
          <h3>${p.titulo}</h3>
          <p class="meta-dorada">${p.predicador}</p>
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
<section id="eventos" class="seccion">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">Próximamente</div>
      <h2>Calendario de Eventos</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.eventos_intro || 'Acompáñenos en nuestras actividades'}</p>
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

function seccionMinisterios(c) {
  const ministerios = c.ministerios || [
    { nombre: 'Ministerio de Jóvenes', descripcion: 'Para jóvenes entre 18 y 35 años', lider: 'Pastor Juan' },
    { nombre: 'Ministerio Infantil', descripcion: 'Enseñanza y actividades para niños', lider: 'Pastora María' },
    { nombre: 'Ministerio de Música', descripcion: 'Alabanza y adoración', lider: 'Director David' },
  ];
  return `
<section id="ministerios" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">Sirviendo juntos</div>
      <h2>Nuestros Ministerios</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para usted en nuestra comunidad'}</p>
    <div class="grid-3">
      ${ministerios.map(m => `
        <div class="card">
          <h3>${m.nombre}</h3>
          <p>${m.descripcion}</p>
          <span class="meta-dorada">Líder: ${m.lider}</span>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function seccionDonaciones(c) {
  return `
<section id="donaciones" class="seccion">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">Ofrendar</div>
      <h2>Donaciones y Ofrendas</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.donaciones_intro || 'Su generosidad sostiene la obra'}</p>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia Bancaria</div>
      <div class="metodo">Tarjeta de Crédito</div>
      <div class="metodo">Pago Móvil</div>
    </div>
    <div style="text-align:center;">
      <button class="btn-cta-dorado">Quiero Donar</button>
    </div>
  </div>
</section>`;
}

function seccionContacto(whatsappLink) {
  return `
<section id="contacto" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">Hablemos</div>
      <h2>Contáctenos</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">Estamos aquí para usted</p>
    <div class="form-contacto">
      <input type="text" placeholder="Su nombre">
      <input type="email" placeholder="Su correo">
      <textarea rows="4" placeholder="Su mensaje o petición de oración"></textarea>
      <a href="${whatsappLink}" class="btn-whatsapp">Enviar por WhatsApp</a>
    </div>
  </div>
</section>`;
}

function seccionTransmision(c) {
  return `
<section id="transmision" class="seccion">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">En vivo</div>
      <h2>Transmisión en Vivo</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.transmision_intro || 'Acompáñenos desde donde se encuentre'}</p>
    <div class="video-placeholder">
      <p>Aquí se mostrará la transmisión en vivo</p>
      <p class="nota">${c.transmision_nota || 'Transmitimos cada domingo a las 10:00 AM'}</p>
    </div>
  </div>
</section>`;
}

function seccionNuevos(c) {
  const pasos = c.pasos_nuevos || [
    'Llegue unos minutos antes y le recibiremos con gusto',
    'Vístase cómodo, no hay código de vestimenta',
    'Tenemos espacio para sus niños durante el servicio',
    'Quédese después para un café y conocernos',
  ];
  return `
<section id="nuevos" class="seccion seccion-alt">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">Bienvenido</div>
      <h2>¿Es su primera vez?</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.nuevos_intro || 'Queremos que se sienta como en casa'}</p>
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

function seccionGaleria() {
  return `
<section id="galeria" class="seccion">
  <div class="contenedor">
    <div class="seccion-titulo">
      <div class="pretitulo">Momentos</div>
      <h2>Galería</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">Imágenes de nuestra comunidad</p>
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
    <div class="seccion-titulo">
      <div class="pretitulo">Reflexiones</div>
      <h2>Devocionales</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">${c.blog_intro || 'Alimente su espíritu cada semana'}</p>
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
    <div class="seccion-titulo">
      <div class="pretitulo">Síganos</div>
      <h2>Redes Sociales</h2>
      <div class="linea-titulo"></div>
    </div>
    <p class="subtitulo">Conéctese con nosotros</p>
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
// CSS BASE — CATEDRAL
// ============================================

function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #0a0a0a;
  line-height: 1.7;
  background: #f5f0e8;
  font-weight: 300;
}

/* ============ NAVBAR transparente → sólido al scroll ============ */
.menu-toggle { display: none; }

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  z-index: 1000;
  height: 80px;
  transition: all 0.4s ease;
}

.navbar.scrolled {
  background: #f5f0e8;
  height: 64px;
  box-shadow: 0 1px 0 rgba(184, 149, 106, 0.25);
}

.nav-container {
  max-width: 1300px;
  margin: 0 auto;
  height: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* v2-logo-fix */
.logo {
  height: 56px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
  border-radius: 8px;
  padding: 4px;
}

.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6em;
  font-weight: 600;
  color: #f5f0e8;
  letter-spacing: 1px;
  transition: color 0.4s ease;
}

.navbar.scrolled .logo-text { color: #0a0a0a; }

.nav-links {
  display: flex;
  gap: 36px;
  align-items: center;
}

.nav-link {
  color: #f5f0e8;
  text-decoration: none;
  font-weight: 400;
  font-size: 0.78em;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  transition: color 0.3s;
  white-space: nowrap;
}

.navbar.scrolled .nav-link { color: #0a0a0a; }
.nav-link:hover { color: #b8956a; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  width: 26px;
  height: 1px;
  background: #f5f0e8;
  transition: all 0.3s;
}

.navbar.scrolled .hamburger span { background: #0a0a0a; }

/* ============ HERO full-screen ============ */
.hero {
  min-height: 100vh;
  background-color: #0a0a0a;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #f5f0e8;
  padding: 100px 24px 60px;
}

.hero-content {
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-decoracion {
  width: 60px;
  height: 1px;
  background: #b8956a;
  margin-bottom: 32px;
}

.hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 500;
  margin-bottom: 24px;
  line-height: 1.1;
  letter-spacing: 0.5px;
}

.hero .lema {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(20px, 2.2vw, 26px);
  margin-bottom: 48px;
  color: #b8956a;
  font-weight: 400;
  max-width: 700px;
}

.btn-cta {
  display: inline-block;
  background: transparent;
  color: #b8956a;
  padding: 16px 48px;
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
  border: 1px solid #b8956a;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
}

.btn-cta:hover {
  background: #b8956a;
  color: #0a0a0a;
}

.btn-cta-dorado {
  display: inline-block;
  background: transparent;
  color: #b8956a;
  padding: 14px 36px;
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  border: 1px solid #b8956a;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
}

.btn-cta-dorado:hover {
  background: #b8956a;
  color: #f5f0e8;
}

/* ============ SECCIONES ============ */
.seccion {
  padding: 120px 24px;
  scroll-margin-top: 80px;
}

.seccion-alt { background: #ede5d6; }

.contenedor { max-width: 1200px; margin: 0 auto; }

.seccion-titulo {
  text-align: center;
  margin-bottom: 24px;
}

.pretitulo {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #b8956a;
  margin-bottom: 16px;
  font-weight: 500;
}

h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 4.5vw, 54px);
  color: #0a0a0a;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 1.1;
}

.linea-titulo {
  width: 60px;
  height: 1px;
  background: #b8956a;
  margin: 24px auto 0;
}

.subtitulo {
  text-align: center;
  color: #4a4a4a;
  font-size: 1em;
  margin-bottom: 60px;
  font-style: italic;
  font-family: 'Cormorant Garamond', serif;
}

/* ============ CARDS con borde dorado ============ */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.card {
  background: #f5f0e8;
  padding: 40px 32px;
  border: 1px solid rgba(184, 149, 106, 0.3);
  transition: all 0.3s;
  text-align: center;
}

.seccion-alt .card { background: #f5f0e8; }

.card:hover {
  border-color: #b8956a;
  transform: translateY(-2px);
}

.card h3 {
  font-family: 'Cormorant Garamond', serif;
  color: #0a0a0a;
  font-size: 1.6em;
  margin-bottom: 16px;
  font-weight: 500;
}

.card p { color: #4a4a4a; margin-bottom: 12px; font-size: 0.95em; }

.meta-dorada {
  display: block;
  color: #b8956a;
  font-size: 0.75em !important;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 12px;
}

.btn-secundario {
  background: transparent;
  color: #0a0a0a;
  border: 1px solid #0a0a0a;
  padding: 10px 28px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
}

.btn-secundario:hover {
  background: #0a0a0a;
  color: #f5f0e8;
}

/* ============ UBICACIÓN ============ */
.ubicacion-box {
  max-width: 600px;
  margin: 40px auto 0;
  padding: 32px;
  text-align: center;
  border-top: 1px solid rgba(184, 149, 106, 0.4);
  border-bottom: 1px solid rgba(184, 149, 106, 0.4);
}

.ubicacion-box strong {
  display: block;
  color: #b8956a;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-weight: 500;
}

.ubicacion-box p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3em;
  color: #0a0a0a;
}

.mapa-contenedor {
  max-width: 900px;
  margin: 50px auto 0;
}

.mapa-contenedor iframe {
  filter: grayscale(40%);
}

/* ============ EVENTOS ============ */
.lista-eventos {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(184, 149, 106, 0.3);
}

.evento {
  display: flex;
  align-items: center;
  background: #f5f0e8;
  transition: all 0.3s;
}

.seccion-alt .evento { background: #ede5d6; }

.evento:hover {
  background: rgba(184, 149, 106, 0.08);
}

.evento-fecha {
  color: #0a0a0a;
  padding: 32px 36px;
  text-align: center;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(184, 149, 106, 0.3);
}

.fecha-dia {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4em;
  font-weight: 500;
  line-height: 1;
  color: #0a0a0a;
}

.fecha-mes {
  font-size: 0.7em;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 8px;
  color: #b8956a;
  font-weight: 500;
}

.evento-info { padding: 28px 32px; flex: 1; }

.evento-info h3 {
  color: #0a0a0a;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5em;
  font-weight: 500;
  margin-bottom: 6px;
}

.evento-hora {
  color: #b8956a;
  font-size: 0.75em;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 500;
}

/* ============ VIDEO ============ */
.video-placeholder {
  background: #0a0a0a;
  color: #f5f0e8;
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 40px;
  text-align: center;
  border: 1px solid #b8956a;
}

.video-placeholder p:first-child {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6em;
  margin-bottom: 16px;
  color: #b8956a;
}

.video-placeholder .nota {
  font-size: 0.85em;
  letter-spacing: 1px;
  opacity: 0.7;
}

/* ============ FORMULARIO ============ */
.form-contacto {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.form-contacto input,
.form-contacto textarea {
  padding: 18px 0;
  border: none;
  border-bottom: 1px solid rgba(10, 10, 10, 0.2);
  background: transparent;
  font-size: 1em;
  font-family: inherit;
  color: #0a0a0a;
  margin-bottom: 24px;
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-bottom-color: #b8956a;
}

.form-contacto textarea { resize: vertical; min-height: 100px; }

.btn-whatsapp {
  background: transparent;
  color: #b8956a;
  text-decoration: none;
  padding: 16px;
  border: 1px solid #b8956a;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.3s;
  margin-top: 16px;
}

.btn-whatsapp:hover {
  background: #b8956a;
  color: #f5f0e8;
}

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
  padding: 32px 0;
  border-bottom: 1px solid rgba(184, 149, 106, 0.25);
}

.paso:last-child { border-bottom: none; }

.paso-numero {
  font-family: 'Cormorant Garamond', serif;
  color: #b8956a;
  min-width: 50px;
  font-size: 2.2em;
  font-weight: 500;
  line-height: 1;
}

.paso p {
  flex: 1;
  padding-top: 12px;
  color: #2c2c2c;
  font-size: 1.05em;
}

/* ============ DONACIONES ============ */
.metodos-donacion {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto 50px;
  max-width: 800px;
}

.metodo {
  padding: 28px 36px;
  border: 1px solid rgba(184, 149, 106, 0.3);
  border-right: none;
  color: #0a0a0a;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2em;
  flex: 1;
  min-width: 200px;
  text-align: center;
}

.metodo:last-child { border-right: 1px solid rgba(184, 149, 106, 0.3); }

/* ============ GALERIA ============ */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #d4cab8, #b8956a);
  aspect-ratio: 1;
  filter: grayscale(20%);
  transition: filter 0.4s ease;
}

.foto-placeholder:hover { filter: grayscale(0%); }

/* ============ BLOG ============ */
.lista-posts {
  max-width: 800px;
  margin: 0 auto;
}

.post {
  padding: 40px 0;
  border-bottom: 1px solid rgba(184, 149, 106, 0.25);
}

.post:last-child { border-bottom: none; }

.post-fecha {
  color: #b8956a;
  font-size: 0.7em;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'Cormorant Garamond', serif;
  color: #0a0a0a;
  font-size: 2em;
  font-weight: 500;
  margin: 14px 0 18px;
}

.leer-mas {
  color: #b8956a;
  text-decoration: none;
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  border-bottom: 1px solid #b8956a;
  padding-bottom: 3px;
}

/* ============ REDES ============ */
.iconos-redes {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.red-social {
  background: transparent;
  color: #0a0a0a;
  padding: 14px 32px;
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-weight: 500;
  border: 1px solid #0a0a0a;
  transition: all 0.3s;
}

.red-social:hover {
  background: #0a0a0a;
  color: #f5f0e8;
}

/* ============ FOOTER ============ */
footer {
  background: #0a0a0a;
  color: #f5f0e8;
  padding: 80px 24px 40px;
  text-align: center;
}

.footer-content { max-width: 700px; margin: 0 auto; }

.footer-linea {
  width: 60px;
  height: 1px;
  background: #b8956a;
  margin: 0 auto 32px;
}

.footer-content h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2em;
  font-weight: 500;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.footer-content p {
  margin-bottom: 8px;
  opacity: 0.7;
  font-size: 0.95em;
}

.footer-content a { color: #b8956a; text-decoration: none; }

.footer-copy {
  margin-top: 40px !important;
  padding-top: 32px;
  border-top: 1px solid rgba(245, 240, 232, 0.1);
  font-size: 0.7em !important;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.5 !important;
}

/* ============ RESPONSIVO ============ */
@media (max-width: 768px) {
  .nav-container { padding: 0 24px; }
  .seccion { padding: 80px 20px; }
  .seccion-titulo { margin-bottom: 16px; }
  .subtitulo { margin-bottom: 40px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f0e8;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 24px 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .navbar.scrolled .nav-links { top: 64px; }

  .menu-toggle:checked ~ .navbar .nav-links {
    transform: translateX(0);
  }

  .nav-link {
    padding: 20px 32px;
    border-bottom: 1px solid rgba(184, 149, 106, 0.15);
    color: #0a0a0a !important;
    font-size: 0.85em;
  }

  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  .grid-3 { grid-template-columns: 1fr; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }
  .metodos-donacion { flex-direction: column; }
  .metodo {
    border-right: 1px solid rgba(184, 149, 106, 0.3);
    border-bottom: none;
  }

  .evento { flex-direction: column; align-items: stretch; }
  .evento-fecha {
    flex-direction: row;
    justify-content: center;
    gap: 16px;
    padding: 20px;
    border-right: none;
    border-bottom: 1px solid rgba(184, 149, 106, 0.3);
  }
  .fecha-dia { font-size: 1.8em; }

  .video-placeholder { padding: 60px 24px; }
}
`;
}

module.exports = { generarPlantillaCatedral: generarPlantilla };