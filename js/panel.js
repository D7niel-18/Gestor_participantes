const totalInscritos = document.getElementById('total-inscritos');
const cantidadesModalidad = document.getElementById('cantidades-modalidad');
const ultimoInscrito = document.getElementById('ultimo-inscrito');

// Línea extra para mostrar el estado de los filtros de la página principal
const filtroActivo = document.createElement('p');
filtroActivo.id = 'filtro-activo';
document.getElementById('contenido-panel').append(filtroActivo);

// En file:// el origen es la cadena "null" y no sirve como destino: se usa '*'
function origenDestino() {
    return location.origin === 'null' ? '*' : location.origin;
}

function esEnteroNoNegativo(valor) {
    return Number.isInteger(valor) && valor >= 0;
}

function mostrarResumen(datos) {
    if (!esEnteroNoNegativo(datos.total)
        || !esEnteroNoNegativo(datos.presenciales)
        || !esEnteroNoNegativo(datos.online)) {
        return;
    }

    if (datos.total === 0) {
        totalInscritos.textContent = 'Sin inscripciones';
    } else {
        totalInscritos.textContent = `Total de inscritos: ${datos.total}`;
    }

    cantidadesModalidad.replaceChildren();

    const presenciales = document.createElement('p');
    presenciales.textContent = `Presenciales: ${datos.presenciales}`;
    const online = document.createElement('p');
    online.textContent = `Online: ${datos.online}`;
    cantidadesModalidad.append(presenciales, online);

    ultimoInscrito.replaceChildren();

    if (datos.ultimo && typeof datos.ultimo.nombre === 'string') {
        const fecha = new Date(datos.ultimo.fechaInscripcion);
        const fechaTexto = isNaN(fecha.getTime())
            ? 'fecha desconocida'
            : fecha.toLocaleString('es-ES');

        const parrafo = document.createElement('p');
        parrafo.textContent = `Último inscrito: ${datos.ultimo.nombre} (${fechaTexto})`;
        ultimoInscrito.append(parrafo);
    }
}

function mostrarFiltros(datos) {
    if (!esEnteroNoNegativo(datos.mostrados)
        || !esEnteroNoNegativo(datos.total)
        || typeof datos.texto !== 'string'
        || typeof datos.modalidad !== 'string') {
        return;
    }

    if (datos.texto === '' && datos.modalidad === 'todas') {
        filtroActivo.textContent = 'Sin filtros activos.';
    } else {
        const texto = datos.texto === '' ? '(cualquiera)' : datos.texto;
        filtroActivo.textContent =
            `Filtros activos: nombre ${texto}, modalidad ${datos.modalidad}. ` +
            `Mostrando ${datos.mostrados} de ${datos.total}.`;
    }
}

// Mensajes que llegan de la página principal
window.addEventListener('message', function (event) {

    // Seguridad: mismo origen y emisor = la ventana que contiene al iframe
    if (event.origin !== location.origin) {
        return;
    }
    if (event.source !== window.parent) {
        return;
    }

    const datos = event.data;

    if (!datos || typeof datos !== 'object') {
        return;
    }

    if (datos.tipo === 'resumen') {
        mostrarResumen(datos);
    } else if (datos.tipo === 'filtros') {
        mostrarFiltros(datos);
    }
});

// Avisar a la página principal de que el panel está listo para recibir datos
if (window.parent !== window) {
    window.parent.postMessage({ tipo: 'panel-listo' }, origenDestino());
}