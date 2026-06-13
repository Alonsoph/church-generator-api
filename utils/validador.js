function validarHTML(html) {
  if (!html || typeof html !== 'string') {
    return false;
  }
  
  const tieneEtiquetasBasicas = html.includes('<html') && html.includes('</html>');
  const noTieneSintaxisMaliciosa = !html.includes('<script') && !html.includes('javascript:');
  
  return tieneEtiquetasBasicas && noTieneSintaxisMaliciosa;
}

module.exports = { validarHTML };