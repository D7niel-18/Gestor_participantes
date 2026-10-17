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
        const coincideNombre = participante.nombre.toLowerCase().includes(textoBusqueda);
        const coincideModalidad =modalidadSeleccionada === 'todas' || participante.modalidad === modalidadSeleccionada;
        
        return coincideNombre && coincideModalidad;
    });

    if (listaFiltrada.length === 0) {
        mensajeBusqueda.textContent = 'No se han encontrado participantes.';
    } else {
        mensajeBusqueda.textContent = '';
    }

    mostrarParticipantes(listaFiltrada);
}

// Escuchadores de eventos de búsqueda y filtro
buscarNombre.addEventListener('input', aplicarFiltros);
filtroModalidad.addEventListener('change', aplicarFiltros);

// Mostrar los participantes al cargar la página
aplicarFiltros();