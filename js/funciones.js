/* Ejemplo: Colección de participantes */
const participantes = [
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
    }
];

/* Funciones */
function validarParticipante(datos) {
    /* Variables y constantes */
    const nombreLimpio = datos.nombre.trim();
    const edadLimpia = Number(datos.edad);
    const experienciaLimpia = Number(datos.experiencia);
    const errores = [];

}