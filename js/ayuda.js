const contenedorNavegador = document.getElementById('datos-navegador');

// Crea un párrafo con un id y lo añade al contenedor
function crearLinea(id) {
    const linea = document.createElement('p');
    linea.id = id;
    contenedorNavegador.append(linea);
    return linea;
}

const lineaIdioma = crearLinea('dato-idioma');
const lineaConexion = crearLinea('dato-conexion');
const lineaNavegador = crearLinea('dato-navegador');
const lineaVentana = crearLinea('dato-ventana');
const lineaPantalla = crearLinea('dato-pantalla');

function mostrarIdioma() {
    const idiomas = navigator.languages && navigator.languages.length > 0
        ? navigator.languages.join(', ')
        : navigator.language;

    lineaIdioma.textContent =
        `Idioma preferido: ${navigator.language} (lista: ${idiomas})`;
}

function mostrarConexion() {
    lineaConexion.textContent = navigator.onLine
        ? 'Estado de conexión: en línea'
        : 'Estado de conexión: sin conexión';
}

function mostrarNavegador() {
    lineaNavegador.textContent = `Agente de usuario: ${navigator.userAgent}`;
}

function mostrarVentana() {
    lineaVentana.textContent =
        `Tamaño de la ventana: ${window.innerWidth} x ${window.innerHeight} px`;
}

function mostrarPantalla() {
    lineaPantalla.textContent =
        `Resolución de la pantalla: ${screen.width} x ${screen.height} px`;
}

// Datos iniciales
mostrarIdioma();
mostrarConexion();
mostrarNavegador();
mostrarVentana();
mostrarPantalla();

// Actualización en vivo
window.addEventListener('online', mostrarConexion);
window.addEventListener('offline', mostrarConexion);
window.addEventListener('resize', mostrarVentana);