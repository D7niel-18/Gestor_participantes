- **LINK CHAT:** https://gemini.google.com/share/d/1IABlRg3wc1s_uc1GQyer-JTExZ_dl9mk?usp=sharing

# Gestor de Inscripciones

Aplicación web hecha con HTML, CSS y JavaScript puro (sin librerías) para gestionar los participantes de un evento. Permite darlos de alta, listarlos, filtrarlos, borrarlos, ver estadísticas, importar y exportar los datos en JSON y guardar preferencias de visualización.

## Estructura del proyecto

```
├── index.html          Página principal
├── panel.html          Panel de resumen (se muestra dentro de un iframe en index.html)
├── ayuda.html          Página de ayuda e información del navegador
├── styles/
│   └── style.css       Estilos (incluye las clases tema-oscuro y tamano-grande)
└── js/
    ├── funciones.js    Lógica pura (validaciones, estadísticas, cookies)
    ├── interfaz.js     Eventos y manipulación del DOM de index.html
    ├── panel.js        Recibe mensajes y pinta el resumen en panel.html
    └── ayuda.js        Muestra la información del navegador en ayuda.html
```

## Cómo ejecutarlo

Las cookies **no funcionan** si abres `index.html`, así que hay que servir la carpeta con un servidor local:

- **VS Code:** extensión *Live Server* → clic derecho sobre `index.html` → *Open with Live Server*.

## Funcionalidades

### 1. Alta de participantes
Formulario con nombre, edad, tipo, modalidad y experiencia. La validación se hace íntegramente con JavaScript (el formulario usa `novalidate`) y los errores se muestran en pantalla:

| Campo | Regla |
|---|---|
| Nombre | Entre 2 y 60 caracteres |
| Edad | Número entero entre 0 y 120 |
| Tipo | `estudiante`, `profesional` o `invitado` |
| Modalidad | `presencial` u `online` |
| Experiencia | Número entre 0 y 10 |

Cada participante recibe un identificador aleatorio de 6 dígitos (se evita repetirlo) y la fecha y hora de su inscripción.

### 2. Listado en tarjetas
Cada participante se muestra en una tarjeta creada con `createElement` con:
- Clasificación por edad: *Menor de edad* o *Mayor de edad*.
- Clasificación por experiencia: *Inicial* (menos de 4), *Intermedia* (de 4 a menos de 7) o *Avanzada* (de 7 a 10).
- Fecha de inscripción con formato español.
- Botón **Borrar**, que pide confirmación antes de eliminar.

### 3. Búsqueda y filtros combinados
Se puede buscar por nombre (sin distinguir mayúsculas) y filtrar por modalidad a la vez, y la lista se actualiza en tiempo real. Si no hay coincidencias, se muestra un aviso.

### 4. Estadísticas globales
Total de participantes, menores y mayores de edad, presenciales y online, conteo por tipo, edad media, mínima y máxima, experiencia media de los participantes presenciales y primer menor de edad. **Las estadísticas nunca se filtran**: siempre reflejan la colección completa.

### 5. Importar y exportar JSON
- **Exportar:** vuelca la colección actual en el área de texto.
- **Importar:** valida la sintaxis y después todos los datos (que sea un array, que no haya ids repetidos, las mismas reglas del alta y que la fecha sea válida). La importación es **atómica**: si hay un solo error, no se importa nada y se muestra la lista de errores.

### 6. Panel en iframe y comunicación con `postMessage`
`index.html` incluye `panel.html` en un iframe. Ambas páginas se comunican con `postMessage`:
- La página principal envía el resumen (total, presenciales, online y último inscrito) y el estado de los filtros.
- El panel avisa con `panel-listo` al cargarse para recibir el estado actual.
- Ambos lados comprueban el origen del mensaje y el emisor, y validan los datos recibidos.

### 7. Preferencias con cookies
Tema (claro u oscuro) y tamaño de letra (normal o grande). Al cambiarlos se aplican las clases `tema-oscuro` y `tamano-grande` al `<body>` y se guardan en cookies durante 30 días (`path=/`, `SameSite=Lax` y `Secure` en HTTPS). Al cargar la página se restauran, y el botón **Restablecer** borra las cookies y vuelve a los valores por defecto.

### 8. Ayuda e información del navegador
El botón **Ayuda e Info** abre `ayuda.html`, que explica el funcionamiento y muestra datos leídos de `navigator` y `window`: idioma, estado de conexión (se actualiza al perderla o recuperarla), agente de usuario, tamaño de la ventana (se actualiza al redimensionar) y resolución de la pantalla.

## Decisiones de diseño

- **Separación de responsabilidades:** `funciones.js` contiene la lógica sin tocar el DOM (salvo el acceso a `document.cookie` de las funciones de cookies); `interfaz.js` gestiona eventos y manipulación del DOM.
- **Sin `innerHTML`:** todo el contenido dinámico se crea con `createElement` y `textContent`.
- **Vista única de renderizado:** tras cualquier cambio en los datos se llama a `aplicarFiltros()` y `actualizarVistaEstadisticas()`.