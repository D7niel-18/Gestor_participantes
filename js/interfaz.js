function crearTarjeta(participante) {
    // Crear la tarjeta principal

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-participante');

    // Identificador

    const identificador = document.createElement('p');
    identificador.textContent = `ID: ${participante.id}`;
    tarjeta.append(identificador);

    // Nombre

    const nombre = document.createElement('p');
    nombre.textContent = `Nombre: ${participante.nombre}`;
    tarjeta.append(nombre);

    // Tipo

    const tipo = document.createElement('p');
    tipo.textContent = `Tipo: ${participante.tipo}`;
    tarjeta.append(tipo);

    // Modalidad

    const modalidad = document.createElement('p');
    modalidad.textContent = `Modalidad: ${participante.modalidad}`;
    tarjeta.append(modalidad);

    // Clasificación por edad

    const clasificacionEdad = participante.edad < 18

        ? 'Menor de edad'

        : 'Mayor de edad';

    const edad = document.createElement('p');

    edad.textContent = `Edad: ${participante.edad} años (${clasificacionEdad})`;

    tarjeta.append(edad);

    // Clasificación por experiencia
    let clasificacionExperiencia;

    if (participante.experiencia >= 0 && participante.experiencia < 4) {
        clasificacionExperiencia = 'Inicial';
    } else if (participante.experiencia >= 4 && participante.experiencia < 7) {
        clasificacionExperiencia = 'Intermedia';
    } else if (participante.experiencia >= 7 && participante.experiencia <= 10) {
        clasificacionExperiencia = 'Avanzada';
    } else {
        clasificacionExperiencia = 'Fuera de rango';
    }


    const experiencia = document.createElement('p');
    experiencia.textContent =
        `Experiencia: ${participante.experiencia} años (${clasificacionExperiencia})`;
    tarjeta.append(experiencia);

    // Fecha y hora de inscripción

    const fecha = new Date(participante.fechaInscripcion);
    const fechaFormateada = fecha.toLocaleString('es-ES');
    const fechaInscripcion = document.createElement('p');

    fechaInscripcion.textContent = `Fecha de inscripción: ${fechaFormateada}`;
    tarjeta.append(fechaInscripcion);

    // Botón de borrado
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = 'Borrar';
    botonBorrar.type = 'button';
    botonBorrar.dataset.id = participante.id;
    botonBorrar.addEventListener('click', function () {
        const confirmar = confirm(
            `¿Quieres eliminar a ${participante.nombre}?`
        );
        if (confirmar) {

            const indice = participantes.findIndex(
                p => p.id === Number(botonBorrar.dataset.id)
            );
            if (indice !== -1) {
                participantes.splice(indice, 1);
                // Reaplicar los filtros para mantener la vista filtrada
                aplicarFiltros();
                actualizarVistaEstadisticas();
            }
        }
    });
    tarjeta.append(botonBorrar);
    // Devolver la tarjeta completa
    return tarjeta;
}



function actualizarVistaEstadisticas() {
    const panel = document.getElementById('panel-estadisticas');
    // Las estadísticas siempre se calculan sobre la colección completa
    const estadisticas = calcularEstadisticas(participantes);

    panel.replaceChildren();

    for (const [clave, valor] of Object.entries(estadisticas)) {
        const parrafo = document.createElement('p');

        parrafo.textContent = `${clave}: ${valor}`;
        panel.append(parrafo);

    }

    // El panel del iframe se mantiene sincronizado con la colección completa
    enviarResumenAlPanel();

}


const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const buscarNombre = document.getElementById('buscar-nombre');
const filtroModalidad = document.getElementById('filtro-modalidad');
const mensajeBusqueda = document.getElementById('mensaje-busqueda');

function mostrarParticipantes(lista = participantes) {
    // Vaciar el contenedor antes de volver a dibujar las tarjetas

    contenedorTarjetas.replaceChildren();

    // Recorrer los participantes recibidos (por defecto, todos)

    for (const participante of lista) {

        // Crear la tarjeta del participante
        const tarjeta = crearTarjeta(participante);

        // Insertar la tarjeta en el contenedor
        contenedorTarjetas.append(tarjeta);

    }

}

function aplicarFiltros() {
    const textoBusqueda = buscarNombre.value.trim().toLowerCase();
    const modalidadSeleccionada = filtroModalidad.value;

    // Ambas condiciones deben cumplirse a la vez
    const listaFiltrada = participantes.filter(participante => {
        const coincideNombre = participante.nombre
            .toLowerCase()
            .includes(textoBusqueda);

        const coincideModalidad =
            modalidadSeleccionada === 'todas' ||
            participante.modalidad === modalidadSeleccionada;

        return coincideNombre && coincideModalidad;
    });

    if (listaFiltrada.length === 0) {
        mensajeBusqueda.textContent = 'No se han encontrado participantes.';
    } else {
        mensajeBusqueda.textContent = '';
    }

    mostrarParticipantes(listaFiltrada);

    enviarFiltrosAlPanel(listaFiltrada.length, textoBusqueda, modalidadSeleccionada);
}

// Escuchadores de eventos de búsqueda y filtro
buscarNombre.addEventListener('input', aplicarFiltros);
filtroModalidad.addEventListener('change', aplicarFiltros);

// Exportar / importar JSON

const areaJson = document.getElementById('json-datos');
const erroresJson = document.getElementById('errores-json');
const botonExportar = document.getElementById('btn-exportar-json');
const botonImportar = document.getElementById('btn-importar-json');

botonExportar.addEventListener('click', function () {
    erroresJson.replaceChildren();
    areaJson.value = JSON.stringify(participantes, null, 2);
});

botonImportar.addEventListener('click', function () {
    erroresJson.replaceChildren();

    let datos;

    // 1. Sintaxis JSON
    try {
        datos = JSON.parse(areaJson.value);
    } catch (error) {
        erroresJson.textContent = 'El texto no es un JSON válido: ' + error.message;
        return;
    }

    // 2. Validación de la colección completa (todo o nada)
    const resultado = validarColeccionJSON(datos);

    if (!resultado.esValido) {
        for (const mensaje of resultado.errores) {
            const parrafo = document.createElement('p');
            parrafo.textContent = mensaje;
            erroresJson.append(parrafo);
        }
        // No se modifica el array global
        return;
    }

    // 3. Todo correcto: sustituir la colección y refrescar la pantalla
    participantes = datos;
    aplicarFiltros();
    actualizarVistaEstadisticas();
});

// Comunicación con el iframe (postMessage)

const iframePanel = document.getElementById('iframe-panel');

// En file:// el origen es la cadena "null" y no sirve como destino: se usa '*'
function origenDestino() {
    return location.origin === 'null' ? '*' : location.origin;
}

function enviarAlPanel(mensaje) {
    if (!iframePanel.contentWindow) {
        return;
    }
    iframePanel.contentWindow.postMessage(mensaje, origenDestino());
}

function enviarResumenAlPanel() {
    const ultimo = participantes.length > 0
        ? participantes[participantes.length - 1]
        : null;

    enviarAlPanel({
        tipo: 'resumen',
        total: participantes.length,
        presenciales: participantes.filter(p => p.modalidad === 'presencial').length,
        online: participantes.filter(p => p.modalidad === 'online').length,
        ultimo: ultimo
            ? { nombre: ultimo.nombre, fechaInscripcion: ultimo.fechaInscripcion }
            : null
    });
}

function enviarFiltrosAlPanel(mostrados, texto, modalidad) {
    enviarAlPanel({
        tipo: 'filtros',
        mostrados: mostrados,
        total: participantes.length,
        texto: texto,
        modalidad: modalidad
    });
}

// Mensajes que llegan desde el iframe: solo se aceptan los de nuestro propio iframe
window.addEventListener('message', function (event) {
    if (event.origin !== location.origin) {
        return;
    }
    if (event.source !== iframePanel.contentWindow) {
        return;
    }
    if (!event.data || event.data.tipo !== 'panel-listo') {
        return;
    }

    // El panel acaba de cargarse (o recargarse): reenviarle el estado actual
    enviarResumenAlPanel();
    aplicarFiltros();
});

// Por si el iframe terminó de cargar antes de que existiera este escuchador
window.addEventListener('load', function () {
    enviarResumenAlPanel();
    aplicarFiltros();
});

// Preferencias (tema y tamaño de letra) con cookies

const selectTema = document.getElementById('select-tema');
const selectTamano = document.getElementById('select-tamano');
const botonGuardarPref = document.getElementById('btn-guardar-pref');
const botonRestablecerPref = document.getElementById('btn-restablecer-pref');

const DIAS_PREFERENCIAS = 30;
const TEMAS_VALIDOS = ['claro', 'oscuro'];
const TAMANOS_VALIDOS = ['normal', 'grande'];

function aplicarPreferencias(tema, tamano) {
    document.body.classList.toggle('tema-oscuro', tema === 'oscuro');
    document.body.classList.toggle('tamano-grande', tamano === 'grande');

    selectTema.value = tema;
    selectTamano.value = tamano;
}

function guardarPreferencias() {
    guardarCookie('tema', selectTema.value, DIAS_PREFERENCIAS);
    guardarCookie('tamano', selectTamano.value, DIAS_PREFERENCIAS);
}

function restaurarPreferencias() {
    const temaGuardado = leerCookie('tema');
    const tamanoGuardado = leerCookie('tamano');

    // Solo se aceptan valores conocidos; si no, se usan los de por defecto
    const tema = TEMAS_VALIDOS.includes(temaGuardado) ? temaGuardado : 'claro';
    const tamano = TAMANOS_VALIDOS.includes(tamanoGuardado) ? tamanoGuardado : 'normal';

    aplicarPreferencias(tema, tamano);
}

// Mensaje visible junto a los botones de preferencias
const mensajePref = document.createElement('span');
mensajePref.id = 'mensaje-pref';
botonRestablecerPref.after(mensajePref);

function guardarYAvisar() {
    guardarPreferencias();

    // Comprobar que la cookie realmente se ha guardado
    if (leerCookie('tema') === selectTema.value
        && leerCookie('tamano') === selectTamano.value) {
        mensajePref.textContent = 'Preferencias guardadas.';
    } else {
        mensajePref.textContent =
            'No se pudieron guardar (las cookies no funcionan con file://; usa un servidor local).';
    }
}

selectTema.addEventListener('change', function () {
    aplicarPreferencias(selectTema.value, selectTamano.value);
    guardarYAvisar();
});

selectTamano.addEventListener('change', function () {
    aplicarPreferencias(selectTema.value, selectTamano.value);
    guardarYAvisar();
});

botonGuardarPref.addEventListener('click', function () {
    aplicarPreferencias(selectTema.value, selectTamano.value);
    guardarYAvisar();
});

botonRestablecerPref.addEventListener('click', function () {
    borrarCookie('tema');
    borrarCookie('tamano');
    aplicarPreferencias('claro', 'normal');
    mensajePref.textContent = 'Preferencias restablecidas.';
});

document.addEventListener('DOMContentLoaded', restaurarPreferencias);

// Alta de participantes

const formParticipante = document.getElementById('form-participante');
const erroresForm = document.getElementById('errores-form');

formParticipante.addEventListener('submit', function (evento) {
    // Evitar que el navegador recargue la página
    evento.preventDefault();
    erroresForm.replaceChildren();

    const datos = {
        nombre: formParticipante.elements['nombre'].value,
        edad: formParticipante.elements['edad'].value,
        tipo: formParticipante.elements['tipo'].value,
        modalidad: formParticipante.elements['modalidad'].value,
        experiencia: formParticipante.elements['experiencia'].value
    };

    const resultado = validarParticipante(datos);

    if (!resultado.esValido) {
        for (const mensaje of resultado.errores) {
            const parrafo = document.createElement('p');
            parrafo.textContent = mensaje;
            erroresForm.append(parrafo);
        }
        return;
    }

    const nuevoParticipante = {
        id: generarId(participantes),
        nombre: datos.nombre.trim(),
        edad: Number(datos.edad),
        tipo: datos.tipo,
        modalidad: datos.modalidad,
        experiencia: Number(datos.experiencia),
        fechaInscripcion: new Date().toISOString()
    };

    participantes.push(nuevoParticipante);
    formParticipante.reset();

    aplicarFiltros();
    actualizarVistaEstadisticas();
});

// Botón de ayuda: abre la página de ayuda en una pestaña nueva
document.getElementById('btn-abrir-ayuda').addEventListener('click', function () {
    window.open('ayuda.html', '_blank');
});

// Mostrar los participantes y las estadísticas al cargar la página
aplicarFiltros();
actualizarVistaEstadisticas();