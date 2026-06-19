// Plantilla ACOGEDORA: mix serif suave + sans humanista, terracota + crema + verde oliva

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
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap" rel="stylesheet">
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

<header class="hero" ${fotoPrincipal ? `style="background-image: linear-gradient(rgba(60,30,20,0.5), rgba(60,30,20,0.5)), url('${fotoPrincipal}')"` : ''}>
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
<section id="horarios" class="seccion seccion-clara">
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
      <strong>Dirección</strong>
      <span>${direccionCompleta}</span>
    </div>
    ${direccion ? `
    <div class="mapa-contenedor">
      <iframe src="${mapaSrc}" width="100%" height="400" style="border:0;border-radius:16px;" allowfullscreen="" loading="lazy"></iframe>
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
    { fecha_dia: '15', fecha_mes: 'JUN', titulo: 'Vigilia de oración', hora: '20:00' },
    { fecha_dia: '22', fecha_mes: 'JUN', titulo: 'Encuentro de jóvenes', hora: '18:00' },
    { fecha_dia: '05', fecha_mes: 'JUL', titulo: 'Retiro espiritual', hora: '09:00' },
  ];
  return `
<section id="eventos" class="seccion seccion-clara">
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
<section id="transmision" class="seccion">
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
<section id="ministerios" class="seccion seccion-clara">
  <div class="contenedor">
    <h2>Nuestros ministerios</h2>
    <p class="subtitulo">${c.ministerios_intro || 'Hay un lugar para ti en nuestra familia'}</p>
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
  return `
<section id="donaciones" class="seccion">
  <div class="contenedor">
    <h2>Donaciones</h2>
    <p class="subtitulo">${c.donaciones_intro || 'Tu generosidad sostiene la obra'}</p>
    <div class="metodos-donacion">
      <div class="metodo">Transferencia</div>
      <div class="metodo">Tarjeta</div>
      <div class="metodo">Pago móvil</div>
    </div>
    <a href="#contacto" class="btn-cta">Quiero donar</a>
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

function seccionRedes(whatsappLink) {
  return `
<section id="redes" class="seccion seccion-clara">
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
// CSS - Estilo cálido, terracota + crema + serif suave
// ============================================
function cssBase() {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Nunito Sans', -apple-system, sans-serif;
  color: #3d2e26;
  line-height: 1.7;
  background: #fdf8f3;
}

/* NAVBAR */
.menu-toggle { display: none; }

.navbar {
  position: sticky;
  top: 0;
  background: #fdf8f3;
  border-bottom: 1px solid #ebe0d2;
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

.logo { height: 48px; width: auto; border-radius: 8px; }

.logo-text {
  font-family: 'Fraunces', serif;
  font-size: 1.4em;
  font-weight: 600;
  color: #c87456;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  color: #5a4a3e;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95em;
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
  width: 26px;
  height: 3px;
  background: #c87456;
  border-radius: 2px;
  transition: all 0.3s;
}

/* HERO */
.hero {
  min-height: 75vh;
  background-size: cover;
  background-position: center;
  background-color: #c87456;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 80px 24px;
}

.hero-content { max-width: 700px; }

.hero h1 {
  font-family: 'Fraunces', serif;
  font-size: 3.6em;
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.1;
}

.hero .lema {
  font-size: 1.25em;
  margin-bottom: 40px;
  opacity: 0.95;
  font-style: italic;
}

.btn-cta {
  display: inline-block;
  background: #fdf8f3;
  color: #c87456;
  padding: 16px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1em;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-cta:hover {
  background: #f5e9d8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(200,116,86,0.25);
}

/* SECCIONES */
.seccion {
  padding: 90px 24px;
  scroll-margin-top: 90px;
}

.seccion-clara { background: #f5e9d8; }

.contenedor { max-width: 1100px; margin: 0 auto; }

h2 {
  font-family: 'Fraunces', serif;
  font-size: 2.6em;
  color: #6b4423;
  text-align: center;
  margin-bottom: 14px;
  font-weight: 600;
}

.subtitulo {
  text-align: center;
  color: #8a7263;
  font-size: 1.1em;
  margin-bottom: 50px;
  font-style: italic;
}

/* CARDS */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  background: #fdf8f3;
  padding: 32px 28px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(107,68,35,0.06);
  transition: all 0.3s;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(107,68,35,0.12);
}

.card h3 {
  font-family: 'Fraunces', serif;
  color: #6b4423;
  font-size: 1.35em;
  margin-bottom: 12px;
  font-weight: 600;
}

.card p { color: #5a4a3e; margin-bottom: 12px; }

.card .meta {
  display: block;
  color: #7a8f5e;
  font-size: 0.9em;
  font-weight: 600;
  margin-top: 8px;
}

.btn-secundario {
  background: transparent;
  color: #c87456;
  border: 2px solid #c87456;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-secundario:hover {
  background: #c87456;
  color: white;
}

/* UBICACIÓN */
.ubicacion-box {
  background: #fdf8f3;
  max-width: 600px;
  margin: 40px auto 0;
  padding: 28px;
  border-radius: 20px;
  border-left: 5px solid #7a8f5e;
  text-align: left;
}

.ubicacion-box strong {
  color: #7a8f5e;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
}

.ubicacion-box span { color: #6b4423; font-size: 1.1em; }

.mapa-contenedor {
  max-width: 900px;
  margin: 32px auto 0;
}

/* EVENTOS */
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
  background: #fdf8f3;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(107,68,35,0.05);
  transition: transform 0.3s;
}

.evento:hover { transform: translateX(6px); }

.evento-fecha {
  background: #c87456;
  color: white;
  padding: 22px 28px;
  text-align: center;
  min-width: 100px;
  display: flex;
  flex-direction: column;
}

.fecha-dia { font-family: 'Fraunces', serif; font-size: 2em; font-weight: 700; line-height: 1; }
.fecha-mes { font-size: 0.85em; opacity: 0.9; margin-top: 4px; }

.evento-info { padding: 20px 24px; }
.evento-info h3 { font-family: 'Fraunces', serif; color: #6b4423; font-size: 1.25em; }
.evento-hora { color: #7a8f5e; font-weight: 600; font-size: 0.9em; }

/* VIDEO */
.video-placeholder {
  background: #6b4423;
  color: white;
  max-width: 700px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
}

.video-placeholder p { font-size: 1.2em; margin-bottom: 12px; }
.video-placeholder .nota { font-size: 0.9em; opacity: 0.8; }

/* FORMULARIO */
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
  border: 2px solid #ebe0d2;
  border-radius: 12px;
  font-size: 1em;
  font-family: inherit;
  background: #fdf8f3;
}

.form-contacto input:focus,
.form-contacto textarea:focus {
  outline: none;
  border-color: #c87456;
}

.btn-whatsapp {
  background: #7a8f5e;
  color: white;
  text-decoration: none;
  padding: 16px;
  border-radius: 50px;
  font-weight: 600;
  text-align: center;
  transition: background 0.2s;
}

.btn-whatsapp:hover { background: #6a7e4f; }

/* PASOS NUEVOS */
.lista-pasos {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #fdf8f3;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(107,68,35,0.05);
}

.paso-numero {
  background: #c87456;
  color: white;
  min-width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 1.1em;
}

.paso p { flex: 1; padding-top: 10px; }

/* DONACIONES */
.metodos-donacion {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.metodo {
  background: #fdf8f3;
  padding: 22px 32px;
  border-radius: 16px;
  border: 2px solid #ebe0d2;
  color: #6b4423;
  font-weight: 600;
}

#donaciones { text-align: center; }
#donaciones .btn-cta {
  background: #c87456;
  color: white;
}
#donaciones .btn-cta:hover {
  background: #b06143;
}

/* GALERIA */
.grid-galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.foto-placeholder {
  background: linear-gradient(135deg, #e8d5b8, #d4b88a);
  aspect-ratio: 1;
  border-radius: 16px;
}

/* BLOG */
.lista-posts {
  max-width: 750px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post {
  background: #fdf8f3;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(107,68,35,0.05);
}

.post-fecha {
  color: #7a8f5e;
  font-size: 0.85em;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.post h3 {
  font-family: 'Fraunces', serif;
  color: #6b4423;
  font-size: 1.4em;
  margin: 10px 0 14px;
}

.leer-mas {
  color: #c87456;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid #c87456;
  padding-bottom: 2px;
}

/* REDES */
.iconos-redes {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.red-social {
  background: #c87456;
  color: white;
  padding: 14px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.red-social:hover {
  background: #7a8f5e;
  transform: translateY(-2px);
}

/* FOOTER */
footer {
  background: #6b4423;
  color: white;
  padding: 50px 24px;
  text-align: center;
}

.footer-content { max-width: 600px; margin: 0 auto; }

.footer-content h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.6em;
  margin-bottom: 12px;
}

.footer-content p { margin-bottom: 8px; opacity: 0.85; }
.footer-content a { color: #f5e9d8; text-decoration: none; }

.footer-copy {
  margin-top: 24px !important;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.15);
  font-size: 0.85em;
  opacity: 0.7;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .hero h1 { font-size: 2.4em; }
  .hero .lema { font-size: 1.1em; }
  h2 { font-size: 1.9em; }
  .seccion { padding: 64px 20px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fdf8f3;
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
    padding: 16px 24px;
    border-bottom: 1px solid #ebe0d2;
    font-size: 1.05em;
  }

  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(7px, 7px);
  }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(2) { opacity: 0; }
  .menu-toggle:checked ~ .navbar .hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .grid-3 { grid-template-columns: 1fr; }
  .grid-galeria { grid-template-columns: repeat(2, 1fr); }
  .metodos-donacion { flex-direction: column; align-items: center; }
}
`;
}

module.exports = { generarPlantillaAcogedora: generarPlantilla };