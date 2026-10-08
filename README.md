# Gestor_participantes

# Fase 1: Estructura del proyecto y entorno de ejecución

## 1. Organización de archivos

Crear una estructura de carpetas organizada, separando claramente los diferentes tipos de archivos del proyecto:

- **HTML:**
  - `index.html`
  - `panel.html`
  - `ayuda.html`

- **CSS:** Hojas de estilo del proyecto.

- **JavaScript:** Scripts encargados de la lógica y funcionamiento de la aplicación.

---

## 2. Separación de responsabilidades en JavaScript

El código JavaScript se dividirá en **archivos diferentes**, con el objetivo de mantener una estructura más organizada y facilitar el mantenimiento del proyecto.

### Lógica pura / Negocio

Contendrá funciones independientes de la interfaz gráfica. Estas funciones:

- Reciben parámetros.
- Realizan operaciones o validaciones.
- Devuelven datos.
- No modifican directamente el DOM.

Ejemplos:

- Validaciones.
- Cálculos de estadísticas.
- Generación de identificadores.
- Manipulación de cookies.
- Procesamiento de datos.

### Interfaz / DOM

Contendrá todo lo relacionado con la interacción con el usuario y la página web.

Se encargará de:

- Gestionar eventos.
- Leer los datos de los formularios.
- Crear tarjetas y elementos HTML.
- Actualizar las vistas.
- Modificar el DOM.
- Llamar a las funciones de la lógica de negocio.

---

## 3. Servidor local

El proyecto se ejecutara mediante un **servidor web local**.

En este caso usaré:

- **Live Server** de Visual Studio Code.