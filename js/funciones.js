/* Ejemplo: Colección de participantes */
/* Se declara con let porque la importación de JSON sustituye la colección entera */
let participantes = [
    {
        id: 483721,
        nombre: "Ana García",
        edad: 17,
        tipo: "estudiante",
        modalidad: "presencial",
        experiencia: 4,
        fechaInscripcion: "2026-10-08T08:30:00.000Z"
    },
    {
        id: 483722,
        nombre: "Daniel Jiménez",
        edad: 18,
        tipo: "profesional",
        modalidad: "online",
        experiencia: 2,
        fechaInscripcion: "2026-10-08T08:30:00.000Z"
    },
    {
        id: 483723,
        nombre: "María López",
        edad: 19,
        tipo: "invitado",
        modalidad: "presencial",
        experiencia: 3,
        fechaInscripcion: "2026-10-08T08:30:00.000Z"
    },
];

/* Funciones */

function validarParticipante(datos) {

    /* Variables y constantes */

    const nombreLimpio = datos.nombre.trim();

    const edadLimpia = Number(datos.edad);

    const experienciaLimpia = Number(datos.experiencia);
    const errores = [];


    // Lógica de validación - Nombre, edad, tipo, modalidad, experiencia.

    if (nombreLimpio.length < 2 || nombreLimpio.length > 60) {
        errores.push("El nombre debe tener entre 2 y 60 caracteres.");
    }
    if (String(datos.edad).trim() === "" || !Number.isInteger(edadLimpia) || isNaN(edadLimpia) || !Number.isFinite(edadLimpia) || edadLimpia < 0 || edadLimpia > 120) {
        errores.push("La edad debe ser un número entero válido entre 0 y 120.");
    }
    if (datos.tipo !== "estudiante" && datos.tipo !== "profesional" && datos.tipo !== "invitado") {
        errores.push("El tipo de participante no es válido.");
    }
    if (datos.modalidad !== "presencial" && datos.modalidad !== "online") {
        errores.push("La modalidad no es válida.");
    }
    if (String(datos.experiencia).trim() === "" || !Number.isFinite(experienciaLimpia) || experienciaLimpia < 0 || experienciaLimpia > 10) {
        errores.push("La experiencia debe ser un número válido entre 0 y 10.");
    }

    // Es válido solo si no se ha acumulado ningún error
    const esValido = errores.length === 0;

    return {esValido: esValido, errores: errores};
}

function validarColeccionJSON(datos) {

    const errores = [];

    // La colección debe ser un array

    if (!Array.isArray(datos)) {
        return {
            esValido: false,
            errores: ["El JSON debe ser un array de participantes."]
        };
    }

    const idsVistos = new Set();

    datos.forEach((participante, indice) => {

        const posicion = `Participante ${indice + 1}`;

        // Cada elemento debe ser un objeto

        if (typeof participante !== "object" || participante === null || Array.isArray(participante)) {
            errores.push(`${posicion}: no es un objeto válido.`);
            return;
        }

        // Identificador: entero y sin duplicados dentro de la lista importada

        if (!Number.isInteger(participante.id)) {
            errores.push(`${posicion}: el id debe ser un número entero.`);
        } else if (idsVistos.has(participante.id)) {
            errores.push(`${posicion}: el id ${participante.id} está duplicado.`);
        } else {
            idsVistos.add(participante.id);
        }

        // Tipos de dato básicos (para no romper validarParticipante con datos raros)

        if (typeof participante.nombre !== "string"
            || typeof participante.edad !== "number"
            || typeof participante.experiencia !== "number") {
            errores.push(`${posicion}: nombre debe ser texto, y edad y experiencia deben ser números.`);
        } else {
            // Mismas reglas que en el registro
            const resultado = validarParticipante(participante);
            for (const error of resultado.errores) {
                errores.push(`${posicion}: ${error}`);
            }
        }

        // Fecha de inscripción válida

        if (typeof participante.fechaInscripcion !== "string"
            || isNaN(new Date(participante.fechaInscripcion).getTime())) {
            errores.push(`${posicion}: la fecha de inscripción no es válida.`);
        }
    });

    return {esValido: errores.length === 0, errores: errores};
}

function generarId(participantes){
    let numero = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const numeroIntentosMaximos = 10;
    let numeroIntentos = 0;

    while (participantes.some(participante => participante.id === numero) && numeroIntentos < numeroIntentosMaximos) {
        numero = Math.floor(Math.random() * (999999 - 100000) + 100000);
        numeroIntentos++;
    }
    return numero;
}

function calcularEstadisticas(participantes) {

    const totalParticipantes = participantes.length;

    let menoresEdad = 0;
    let mayoresEdad = 0;
    let totalPresenciales = 0;
    let totalOnline = 0;
    let totalEstudiantes = 0;
    let totalProfesionales = 0;
    let totalInvitados = 0;

    let totalExperiencia = 0;
    let totalExperienciaPresenciales = 0;
    let experienciaMedia = "Sin datos";

    let totalEdad = 0;
    let edadMedia = "Sin datos";
    let edadMinima = "Sin datos";
    let edadMaxima = "Sin datos";

    let primerMenorEdad = "No hay menores de edad";

    // Comprobar si la lista está vacía

    if (totalParticipantes === 0) {
        return {
            totalParticipantes: 0,
            menoresEdad: 0,
            mayoresEdad: 0,
            totalPresenciales: 0,
            totalOnline: 0,
            totalEstudiantes: 0,
            totalProfesionales: 0,
            totalInvitados: 0,
            experienciaMedia: "Sin datos",
            edadMedia: "Sin datos",
            edadMinima: "Sin datos",
            edadMaxima: "Sin datos",
            primerMenorEdad: "No hay menores de edad"
        };
    }

    // Inicializar la edad mínima y máxima

    edadMinima = participantes[0].edad;
    edadMaxima = participantes[0].edad;

    // Conteo por modalidad, tipo y edad.
    // Cálculo de la suma de edades y búsqueda de extremos.

    for (const participante of participantes) {

        // Conteo por edad

        if (participante.edad < 18) {
            menoresEdad++;
        } else {
            mayoresEdad++;
        }

        // Conteo por modalidad

        if (participante.modalidad === "presencial") {
            totalPresenciales++;
        } else if (participante.modalidad === "online") {
            totalOnline++;
        }

        // Conteo por tipo de participante

        if (participante.tipo === "estudiante") {
            totalEstudiantes++;
        } else if (participante.tipo === "profesional") {
            totalProfesionales++;
        } else if (participante.tipo === "invitado") {
            totalInvitados++;
        }

        // Sumar edades

        totalEdad += participante.edad;

        // Buscar edad mínima

        if (participante.edad < edadMinima) {
            edadMinima = participante.edad;
        }

        // Buscar edad máxima

        if (participante.edad > edadMaxima) {
            edadMaxima = participante.edad;
        }
    }

    // Calcular edad media

    if (totalParticipantes > 0) {
        edadMedia = totalEdad / totalParticipantes;
    }

    // Experiencia media de participantes presenciales

    for (const participante of participantes) {

        if (participante.modalidad === "online") {
            continue;
        }

        totalExperiencia += participante.experiencia;
        totalExperienciaPresenciales++;
    }

    if (totalExperienciaPresenciales > 0) {
        experienciaMedia =
            totalExperiencia / totalExperienciaPresenciales;
    }

    // Buscar al primer menor de edad

    for (const participante of participantes) {

        if (participante.edad < 18) {
            primerMenorEdad = participante.nombre;
            break;
        }
    }

    // Devolver todas las estadísticas

    return {
        totalParticipantes,
        menoresEdad,
        mayoresEdad,
        totalPresenciales,
        totalOnline,
        totalEstudiantes,
        totalProfesionales,
        totalInvitados,
        experienciaMedia,
        edadMedia,
        edadMinima,
        edadMaxima,
        primerMenorEdad
    };
}

function guardarCookie(nombre, valor, dias) {

    const maxAge = dias * 24 * 60 * 60;

    const valorCodificado = encodeURIComponent(valor);

    let cookie = nombre + "=" + valorCodificado;
    cookie += "; Max-Age=" + maxAge;
    cookie += "; path=/";
    cookie += "; SameSite=Lax";

    if (location.protocol === "https:") {
        cookie += "; Secure";
    }

    document.cookie = cookie;
}


function leerCookie(nombre) {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        const partes = cookie.split("=");

        if (partes[0] === nombre) {
            return partes.slice(1).join("=");
        }
    }

    return null;
}

function borrarCookie(nombre) {
    document.cookie = `${nombre}=; Max-Age=0; path=/; SameSite=Lax`;
}