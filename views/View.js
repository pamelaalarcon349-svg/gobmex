class AdmisionView {
    constructor() {
        this.form = document.getElementById('formAdmision');
        this.alertaExito = document.getElementById('alertaExito');
        this.alertaError = document.getElementById('alertaError');
        this.linkCurp = document.getElementById('linkCurp');
        this.inputCurp = document.getElementById('curp');
        this.divMaestrias = document.getElementById('maestrias');
        this.divDoctorados = document.getElementById('doctorados');
        this.selectMaestria = document.getElementById('maestriaSelect');
        this.selectDoctorado = document.getElementById('doctoradoSelect');
        this.opcionesPeriodo = document.getElementById('opcionesPeriodo');
        this.errorPeriodo = document.getElementById('errorPeriodo');
        this.evaluacionContainer = document.getElementById('evaluacionContainer');
        this.especificarTitulacionContainer = document.getElementById('especificarTitulacionContainer');
        this.especificarTitulacion = document.getElementById('especificarTitulacion');
        this.modalResumen = document.getElementById('modalResumen');
        this.contenidoResumen = document.getElementById('contenidoResumen');
    }

    inicializarCalendario() {
        const campoFecha = document.getElementById('fecha_nacimiento');
        if (!campoFecha) return;

        if (window.jQuery && window.jQuery.fn.datepicker) {
            window.jQuery('#fecha_nacimiento').datepicker({
                changeYear: true,
                yearRange: '-100:+0',
                dateFormat: 'dd/mm/yy'
            });
            return;
        }

        campoFecha.type = 'date';
        campoFecha.removeAttribute('readonly');
        campoFecha.addEventListener('click', () => {
            if (campoFecha.showPicker) campoFecha.showPicker();
        });
    }

    ocultarElementosIniciales() {
        this.mostrarElemento(this.divMaestrias, false, false);
        this.mostrarElemento(this.divDoctorados, false, false);
        this.mostrarElemento(this.evaluacionContainer, false, false);
        this.mostrarElemento(this.especificarTitulacionContainer, false, false);
    }

    mostrarElemento(elemento, visible, animado = true) {
        if (!elemento) return;

        if (animado && window.jQuery) {
            const $elemento = window.jQuery(elemento);
            visible ? $elemento.slideDown(300) : $elemento.slideUp(300);
            return;
        }

        elemento.style.display = visible ? 'block' : 'none';
    }

    actualizarCurp(esExtranjero) {
        if (!this.inputCurp || !this.linkCurp) return;

        if (esExtranjero) {
            this.inputCurp.disabled = true;
            this.inputCurp.value = '';
            this.limpiarErrorCampo(this.inputCurp);
            this.linkCurp.classList.add('deshabilitado-total');
            return;
        }

        this.inputCurp.disabled = false;
        this.linkCurp.classList.remove('deshabilitado-total');
    }

    actualizarTitulacion(mostrarCampo) {
        this.mostrarElemento(this.especificarTitulacionContainer, mostrarCampo);
        if (!this.especificarTitulacion) return;

        this.especificarTitulacion.required = mostrarCampo;
        if (!mostrarCampo) {
            this.especificarTitulacion.value = '';
            this.limpiarErrorCampo(this.especificarTitulacion);
        }
    }

    actualizarPosgrado(tipoPosgrado) {
        const esMaestria = tipoPosgrado === 'Maestría';
        const esDoctorado = tipoPosgrado === 'Doctorado';

        this.mostrarElemento(this.divMaestrias, esMaestria);
        this.mostrarElemento(this.divDoctorados, esDoctorado);
        this.mostrarElemento(this.evaluacionContainer, esMaestria);

        if (!esMaestria && this.selectMaestria) {
            this.selectMaestria.selectedIndex = 0;
            this.limpiarErrorCampo(this.selectMaestria);
        }

        if (!esDoctorado && this.selectDoctorado) {
            this.selectDoctorado.selectedIndex = 0;
            this.limpiarErrorCampo(this.selectDoctorado);
        }

        if (!esMaestria) {
            this.form.querySelectorAll('input[name="formaEvaluacion"]').forEach(radio => {
                radio.checked = false;
            });
        }
    }

    renderizarPeriodos(tipoPosgrado) {
        if (!this.opcionesPeriodo) return;

        const periodos = tipoPosgrado === 'Doctorado'
            ? ['Agosto-Diciembre', 'Enero-Mayo']
            : ['Agosto-Diciembre'];

        this.opcionesPeriodo.innerHTML = periodos.map(periodo => `
                        <div class="radio">
                            <label><input type="radio" name="periodo" value="${periodo}"> ${periodo.toUpperCase()}</label>
                        </div>
                    `).join('');

        this.limpiarErrorPeriodo();
    }

    mostrarAlertaNumeros() {
        document.querySelectorAll('.alerta-numeros').forEach(alerta => alerta.remove());

        const alerta = document.createElement('div');
        alerta.className = 'alerta-numeros';
        alerta.textContent = 'Solo se aceptan números en este campo';
        document.body.appendChild(alerta);

        setTimeout(() => alerta.remove(), 2500);
    }

    limpiarCampoNumerico(campo) {
        const valorOriginal = campo.value;
        const valorLimpio = ValidacionModel.soloNumeros(valorOriginal);

        if (valorOriginal !== valorLimpio) {
            campo.value = valorLimpio;
            this.mostrarAlertaNumeros();
        }
    }

    limpiarErrorCampo(campo) {
        if (!campo) return;

        campo.classList.remove('input-error');
        const contenedor = campo.closest('.form-group') || campo.parentElement;
        const mensaje = contenedor?.querySelector('.error-mensaje');
        if (mensaje) mensaje.textContent = '';
    }

    mostrarErrorCampo(campo, mensaje) {
        if (!campo) return;

        campo.classList.add('input-error');
        const contenedor = campo.closest('.form-group') || campo.parentElement;
        const mensajeError = contenedor?.querySelector('.error-mensaje');
        if (mensajeError) mensajeError.textContent = mensaje;
    }

    mostrarErrorGrupoRadio(radio, mensaje) {
        const contenedor = radio.closest('.form-group') || radio.parentElement;
        contenedor?.classList.add('input-error');
        const mensajeError = contenedor?.querySelector('.error-mensaje');
        if (mensajeError) mensajeError.textContent = mensaje;
    }

    limpiarErrorGrupoRadio(radio) {
        const contenedor = radio.closest('.form-group') || radio.parentElement;
        contenedor?.classList.remove('input-error');
        const mensajeError = contenedor?.querySelector('.error-mensaje');
        if (mensajeError) mensajeError.textContent = '';
    }

    limpiarValidaciones() {
        document.querySelectorAll('.input-error').forEach(campo => campo.classList.remove('input-error'));
        document.querySelectorAll('.error-mensaje').forEach(mensaje => {
            mensaje.textContent = '';
        });
        this.ocultarBanners();
    }

    ocultarBanners() {
        if (this.alertaExito) this.alertaExito.style.display = 'none';
        if (this.alertaError) this.alertaError.style.display = 'none';
    }

    mostrarBanner(tipo) {
        this.ocultarBanners();

        if (tipo === 'exito' && this.alertaExito) {
            this.alertaExito.style.display = 'block';
        }

        if (tipo === 'error' && this.alertaError) {
            this.alertaError.style.display = 'block';
        }
    }

    mostrarErrorPeriodo(mensaje) {
        if (this.errorPeriodo) this.errorPeriodo.textContent = mensaje;
    }

    limpiarErrorPeriodo() {
        if (this.errorPeriodo) this.errorPeriodo.textContent = '';
    }

    desplazarPrimerError() {
        const primerError = document.querySelector('.input-error');
        if (!primerError) return;

        const top = primerError.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    escaparHtml(valor) {
        return String(valor || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    texto(valor, respaldo = 'No especificado') {
        return this.escaparHtml(valor || respaldo);
    }

    construirResumen(datos) {
        const nombreCompleto = `${datos.nombre} ${datos.primerApellido} ${datos.segundoApellido}`.trim();
        const direccion = `${datos.domicilio.calle} ${datos.domicilio.numExt}, ${datos.domicilio.colonia}, CP ${datos.domicilio.cp}, ${datos.domicilio.municipio}, ${datos.domicilio.estado}`.trim();
        const formaEvaluacion = datos.datosAcademicos.formaEvaluacion
            ? `<li><strong>Forma de Evaluación:</strong> ${this.texto(datos.datosAcademicos.formaEvaluacion)}</li>`
            : '';

        return `
                <div class="section-title"> Datos personales</div>
                <ul>
                    <li><strong>Posgrado seleccionado:</strong> ${this.texto(datos.datosAcademicos.posgradoDetalle, 'No seleccionado')}</li>
                    <li><strong>Año de ingreso:</strong> ${this.texto(datos.datosAcademicos.anioIngreso)}</li>
                    <li><strong>Periodo:</strong> ${this.texto(datos.datosAcademicos.periodo, 'No seleccionado')}</li>
                    ${formaEvaluacion}
                    <li><strong>Nacionalidad:</strong> ${this.texto(datos.nacionalidad)}</li>
                    <li><strong>CURP:</strong> ${this.texto(datos.curp)}</li>
                    <li><strong>Nombre completo:</strong> ${this.texto(nombreCompleto)}</li>
                    <li><strong>Sexo:</strong> ${this.texto(datos.sexo)}</li>
                    <li><strong>Fecha de nacimiento:</strong> ${this.texto(datos.fechaNacimiento, 'No especificada')}</li>
                    <li><strong>Lugar de nacimiento:</strong> ${this.texto(datos.lugarNacimiento)}</li>
                    <li><strong>Teléfono móvil:</strong> ${this.texto(datos.telMovil)}</li>
                    <li><strong>Correo electrónico:</strong> ${this.texto(datos.email)}</li>
                    <li><strong>Dirección completa:</strong> ${this.texto(direccion)}</li>
                </ul>
                <div class="section-title">Datos académicos</div>
                <ul>
                    <li><strong>Institución de procedencia:</strong> ${this.texto(datos.estudiosPrevios.institucion, 'No especificada')}</li>
                    <li><strong>Grado obtenido:</strong> ${this.texto(datos.estudiosPrevios.gradoAcademico)}</li>
                    <li><strong>Año de obtención:</strong> ${this.texto(datos.estudiosPrevios.anioGrado)}</li>
                    <li><strong>Promedio:</strong> ${this.texto(datos.estudiosPrevios.promedio)}</li>
                    <li><strong>Tipo de titulación:</strong> ${this.texto(datos.estudiosPrevios.tipoTitulacion)}</li>
                </ul>
                <div class="section-title">Dominio del inglés</div>
                <ul>
                    <li><strong>Expresión escrita:</strong> ${this.texto(datos.dominioIngles.expresionEscrita)}</li>
                    <li><strong>Expresión oral:</strong> ${this.texto(datos.dominioIngles.expresionOral)}</li>
                    <li><strong>Comprensión lectora:</strong> ${this.texto(datos.dominioIngles.comprensionLectora)}</li>
                    <li><strong>Comprensión auditiva:</strong> ${this.texto(datos.dominioIngles.comprensionAuditiva)}</li>
                </ul>
                <div class="section-title"> Motivación</div>
                <ul>
                    <li><strong>Razón para estudiar en INAOE:</strong> ${this.texto(datos.motivacion.razon, 'No especificada')}</li>
                </ul>
            `;
    }

    mostrarResumen(html) {
        if (this.contenidoResumen) this.contenidoResumen.innerHTML = html;

        if (window.jQuery && window.jQuery.fn.modal) {
            window.jQuery(this.modalResumen).modal('show');
            return;
        }

        if (this.modalResumen) this.modalResumen.style.display = 'block';
    }

    ocultarResumen() {
        if (window.jQuery && window.jQuery.fn.modal) {
            window.jQuery(this.modalResumen).modal('hide');
            return;
        }

        if (this.modalResumen) this.modalResumen.style.display = 'none';
    }
}
