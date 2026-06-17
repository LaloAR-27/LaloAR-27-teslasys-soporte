/* ================================================================
   TeslaSys Chile - Sistema de Registro de Solicitudes de Soporte
   Archivo: script.js
   ----------------------------------------------------------------
   Contenidos aplicados:
   - Variables (let / const)
   - Estructuras de control (if / else, for / forEach)
   - Arreglos y Objetos
   - Funciones (reutilización y claridad)
   - Manipulación del DOM
   - Validación de formularios
   ================================================================ */


/* ---------- 1. Arreglo global de solicitudes ---------- */
let solicitudes = [];


/* ---------- 2. Iconos SVG por tipo de solicitud ---------- */
const iconosTipo = {
    Hardware:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    Software:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    Redes:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0114 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>',
    Seguridad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
};


/* ---------- 3. Referencias del DOM (capturadas una sola vez) ---------- */
const inputNombre      = document.getElementById('nombre');
const inputCorreo      = document.getElementById('correo');
const inputArea        = document.getElementById('area');
const inputTipo        = document.getElementById('tipo');
const inputDescripcion = document.getElementById('descripcion');

const btnRegistrar = document.getElementById('btnRegistrar');
const btnLimpiar   = document.getElementById('btnLimpiar');

const cuerpoTabla     = document.getElementById('cuerpoTabla');
const estadoVacio     = document.getElementById('estadoVacio');
const tablaElemento   = document.querySelector('.tabla');
const contador        = document.getElementById('contador');
const mensajeElemento = document.getElementById('mensaje');


/* ================================================================
   FUNCIÓN: registrarSolicitud
   - Captura los datos del formulario
   - Valida la información
   - Crea el objeto solicitud
   - Lo agrega al arreglo con push()
   - Actualiza la tabla en el DOM
   ================================================================ */
function registrarSolicitud() {

    // (a) Captura de datos en variables
    let nombre      = inputNombre.value.trim();
    let correo      = inputCorreo.value.trim();
    let area        = inputArea.value.trim();
    let tipo        = inputTipo.value;
    let descripcion = inputDescripcion.value.trim();

    // (b) Validaciones con if / else
    let errores = [];

    if (nombre === '') {
        errores.push('El nombre del colaborador');
        marcarError(inputNombre);
    } else {
        quitarError(inputNombre);
    }

    if (correo === '') {
        errores.push('El correo electrónico');
        marcarError(inputCorreo);
    } else if (!correo.includes('@')) {
        errores.push('Un correo electrónico válido (debe contener @)');
        marcarError(inputCorreo);
    } else {
        quitarError(inputCorreo);
    }

    if (area === '') {
        errores.push('El área de trabajo');
        marcarError(inputArea);
    } else {
        quitarError(inputArea);
    }

    if (tipo === '') {
        errores.push('El tipo de solicitud');
        marcarError(inputTipo);
    } else {
        quitarError(inputTipo);
    }

    if (descripcion === '') {
        errores.push('La descripción del problema');
        marcarError(inputDescripcion);
    } else {
        quitarError(inputDescripcion);
    }

    // (c) Si hay errores, mostrar mensaje y detener
    if (errores.length > 0) {
        let textoError = 'Por favor complete: ' + errores.join(', ') + '.';
        mostrarMensaje(textoError, 'error');
        return;
    }

    // (d) Crear el objeto solicitud
    const nuevaSolicitud = {
        nombre: nombre,
        correo: correo,
        area: area,
        tipo: tipo,
        descripcion: descripcion
    };

    // (e) Agregar al arreglo
    solicitudes.push(nuevaSolicitud);

    // (f) Actualizar la tabla y mostrar éxito
    renderizarTabla();
    mostrarMensaje('Solicitud registrada correctamente.', 'exito');

    // (g) Limpiar el formulario después de registrar
    limpiarCampos();
}


/* ================================================================
   FUNCIÓN: limpiarFormulario
   - Vacía todos los campos del formulario
   - Quita estados de error
   - Oculta cualquier mensaje visible
   ================================================================ */
function limpiarFormulario() {
    limpiarCampos();
    ocultarMensaje();
    mostrarMensaje('Formulario limpiado.', 'exito');

    // Auto-ocultar el aviso luego de 2 segundos
    setTimeout(ocultarMensaje, 2000);
}


/* ---------- Función auxiliar: vaciar inputs ---------- */
function limpiarCampos() {
    inputNombre.value      = '';
    inputCorreo.value      = '';
    inputArea.value        = '';
    inputTipo.value        = '';
    inputDescripcion.value = '';

    // Quitar marcas de error de todos los campos
    const campos = [inputNombre, inputCorreo, inputArea, inputTipo, inputDescripcion];
    campos.forEach(function (campo) {
        quitarError(campo);
    });
}


/* ================================================================
   FUNCIÓN: renderizarTabla
   - Recorre el arreglo de solicitudes con forEach
   - Genera dinámicamente las filas de la tabla
   - Manipula el DOM sin recargar la página
   ================================================================ */
function renderizarTabla() {

    // Limpiar el contenido previo
    cuerpoTabla.innerHTML = '';

    // Mostrar estado vacío o tabla según corresponda
    if (solicitudes.length === 0) {
        estadoVacio.classList.remove('estado-vacio--oculto');
        tablaElemento.classList.add('tabla--oculta');
    } else {
        estadoVacio.classList.add('estado-vacio--oculto');
        tablaElemento.classList.remove('tabla--oculta');
    }

    // Recorrer el arreglo con forEach y construir filas
    solicitudes.forEach(function (solicitud, indice) {

        const fila = document.createElement('tr');

        const claseTipo = 'tipo-badge--' + solicitud.tipo.toLowerCase();
        const icono     = iconosTipo[solicitud.tipo] || '';

        fila.innerHTML =
            '<td class="tabla__numero">' + (indice + 1) + '</td>' +
            '<td class="tabla__nombre">' + escaparHTML(solicitud.nombre) + '</td>' +
            '<td>' + escaparHTML(solicitud.area) + '</td>' +
            '<td>' +
                '<span class="tipo-badge ' + claseTipo + '">' +
                    icono +
                    escaparHTML(solicitud.tipo) +
                '</span>' +
            '</td>' +
            '<td class="tabla__descripcion">' + escaparHTML(solicitud.descripcion) + '</td>' +
            '<td>' +
                '<button class="btn-eliminar" data-indice="' + indice + '" ' +
                    'aria-label="Eliminar solicitud ' + (indice + 1) + '">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>' +
                    '</svg>' +
                '</button>' +
            '</td>';

        cuerpoTabla.appendChild(fila);
    });

    // Actualizar contador total
    contador.textContent = solicitudes.length;

    // Conectar los botones de eliminar de cada fila
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const i = parseInt(boton.getAttribute('data-indice'), 10);
            eliminarSolicitud(i);
        });
    });
}


/* ================================================================
   FUNCIÓN: eliminarSolicitud
   - Elimina una solicitud del arreglo según su índice
   - Vuelve a renderizar la tabla
   ================================================================ */
function eliminarSolicitud(indice) {
    if (indice >= 0 && indice < solicitudes.length) {
        solicitudes.splice(indice, 1);
        renderizarTabla();
        mostrarMensaje('Solicitud eliminada correctamente.', 'exito');
        setTimeout(ocultarMensaje, 2500);
    }
}


/* ================================================================
   FUNCIONES AUXILIARES DE UI
   ================================================================ */

/* Mostrar mensaje en pantalla mediante el DOM */
function mostrarMensaje(texto, tipo) {

    const iconoExito = '<svg class="mensaje__icono" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    const iconoError = '<svg class="mensaje__icono" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    mensajeElemento.className = 'mensaje mensaje--visible';

    if (tipo === 'exito') {
        mensajeElemento.classList.add('mensaje--exito');
        mensajeElemento.innerHTML = iconoExito + '<span>' + texto + '</span>';
    } else {
        mensajeElemento.classList.add('mensaje--error');
        mensajeElemento.innerHTML = iconoError + '<span>' + texto + '</span>';
    }
}

/* Ocultar mensaje */
function ocultarMensaje() {
    mensajeElemento.className = 'mensaje';
    mensajeElemento.innerHTML = '';
}

/* Marcar campo con error visual */
function marcarError(campo) {
    campo.classList.add('form__input--error');
}

/* Quitar error visual */
function quitarError(campo) {
    campo.classList.remove('form__input--error');
}

/* Escapar HTML para evitar inyección desde inputs del usuario */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}


/* ================================================================
   EVENTOS - Conexión de botones con sus funciones
   ================================================================ */
btnRegistrar.addEventListener('click', registrarSolicitud);
btnLimpiar.addEventListener('click', limpiarFormulario);

// Quitar mensaje de error de un campo al empezar a escribir
const todosLosCampos = [inputNombre, inputCorreo, inputArea, inputTipo, inputDescripcion];
todosLosCampos.forEach(function (campo) {
    campo.addEventListener('input',  function () { quitarError(campo); });
    campo.addEventListener('change', function () { quitarError(campo); });
});


/* ================================================================
   INICIALIZACIÓN
   ================================================================ */
renderizarTabla();
