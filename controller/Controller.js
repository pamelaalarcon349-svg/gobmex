class AdmisionController {
    constructor(modelo, vista) {
        this.model = modelo;
        this.view = vista;
        this.inicializar();
    }

    inicializar() {
        this.view.inicializarCalendario();
        this.view.ocultarElementosIniciales();
        this.vincularEventos();
        this.actualizarCurp();
        this.actualizarTitulacion();
        this.actualizarPosgrado();
    }

    vincularEventos() {
        this.view.form.addEventListener('submit', evento => {
            evento.preventDefault();
            this.validarYMostrarResumen();
        });

        document.querySelectorAll('input[name="nacionalidad"]').forEach(radio => {
            radio.addEventListener('change', () => this.actualizarCurp());
        });

        document.querySelectorAll('input[name="titulacion"]').forEach(radio => {
            radio.addEventListener('change', () => this.actualizarTitulacion());
        });

        document.querySelectorAll('input[name="posgrado"]').forEach(radio => {
            radio.addEventListener('change', () => this.actualizarPosgrado());
        });

        document.addEventListener('input', evento => {
            if (evento.target.classList.contains('solo-numeros')) {
                this.view.limpiarCampoNumerico(evento.target);
            }

            if (evento.target.matches('#formAdmision [required]')) {
                this.limpiarErrorSiTieneValor(evento.target);
            }
        });

        document.addEventListener('paste', evento => {
            if (evento.target.classList.contains('solo-numeros')) {
                setTimeout(() => this.view.limpiarCampoNumerico(evento.target), 10);
            }
        });

        document.addEventListener('change', evento => {
            if (evento.target.matches('#formAdmision [required]')) {
                if (evento.target.type === 'radio') {
                    this.view.limpiarErrorGrupoRadio(evento.target);
                    return;
                }

                this.limpiarErrorSiTieneValor(evento.target);
            }

            if (evento.target.name === 'periodo') {
                this.view.limpiarErrorPeriodo();
            }
        });

        [this.view.selectMaestria, this.view.selectDoctorado].forEach(select => {
            select?.addEventListener('change', () => this.view.limpiarErrorCampo(select));
        });

        document.querySelectorAll('#formAdmision [required]').forEach(campo => {
            campo.addEventListener('blur', () => this.validarCampoObligatorio(campo));
        });

        document.getElementById('btnEnviarModal')?.addEventListener('click', evento => {
            evento.preventDefault();
            this.validarYMostrarResumen();
        });

        document.getElementById('confirmarEnvio')?.addEventListener('click', () => {
            this.view.ocultarResumen();
            alert('Solicitud enviada con éxito. Pronto recibirás respuesta del INAOE.');
        });
    }

    actualizarCurp() {
        const nacionalidad = this.view.form.querySelector('input[name="nacionalidad"]:checked')?.value;
        this.view.actualizarCurp(nacionalidad === 'Otra (Extranjera)');
    }

    actualizarTitulacion() {
        const titulacion = this.view.form.querySelector('input[name="titulacion"]:checked')?.value;
        this.view.actualizarTitulacion(titulacion === 'Otro');
    }

    actualizarPosgrado() {
        const posgrado = this.view.form.querySelector('input[name="posgrado"]:checked')?.value || '';
        this.view.actualizarPosgrado(posgrado);
        this.view.renderizarPeriodos(posgrado);
    }

    limpiarErrorSiTieneValor(campo) {
        if (campo.disabled || campo.type === 'radio') return;

        if (!ValidacionModel.esSeleccionInvalida(campo.value)) {
            this.view.limpiarErrorCampo(campo);
        }
    }

    validarCampoObligatorio(campo) {
        if (campo.disabled || campo.type === 'radio') return true;

        if (ValidacionModel.esSeleccionInvalida(campo.value)) {
            this.view.mostrarErrorCampo(campo, 'Este campo es obligatorio');
            return false;
        }

        this.view.limpiarErrorCampo(campo);
        return true;
    }

    validarCamposRequeridos() {
        let esValido = true;
        const radiosRevisados = new Set();

        this.view.form.querySelectorAll('[required]').forEach(campo => {
            if (campo.disabled) return;

            if (campo.type === 'radio') {
                if (radiosRevisados.has(campo.name)) return;
                radiosRevisados.add(campo.name);

                const seleccionado = this.view.form.querySelector(`input[name="${campo.name}"]:checked`);
                if (!seleccionado) {
                    esValido = false;
                    this.view.mostrarErrorGrupoRadio(campo, 'Este campo es obligatorio');
                }
                return;
            }

            if (!this.validarCampoObligatorio(campo)) {
                esValido = false;
            }
        });

        return esValido;
    }

    validarSelectPosgrado() {
        const posgrado = this.view.form.querySelector('input[name="posgrado"]:checked')?.value;

        if (posgrado === 'Maestría' && ValidacionModel.esSeleccionInvalida(this.view.selectMaestria.value)) {
            this.view.mostrarErrorCampo(this.view.selectMaestria, 'Este campo es obligatorio');
            return false;
        }

        if (posgrado === 'Doctorado' && ValidacionModel.esSeleccionInvalida(this.view.selectDoctorado.value)) {
            this.view.mostrarErrorCampo(this.view.selectDoctorado, 'Este campo es obligatorio');
            return false;
        }

        return true;
    }

    validarPeriodo() {
        if (this.view.form.querySelector('input[name="periodo"]:checked')) {
            this.view.limpiarErrorPeriodo();
            return true;
        }

        this.view.mostrarErrorPeriodo('Este campo es obligatorio');
        return false;
    }

    validarYMostrarResumen() {
        this.view.limpiarValidaciones();

        const requeridosValidos = this.validarCamposRequeridos();
        const posgradoValido = this.validarSelectPosgrado();
        const periodoValido = this.validarPeriodo();
        const esValido = requeridosValidos && posgradoValido && periodoValido;

        if (!esValido) {
            this.view.mostrarBanner('error');
            this.view.desplazarPrimerError();
            return;
        }

        const datos = this.model.mapearDatosFormulario(this.view.form);
        this.model.enviarDatos();
        this.view.mostrarBanner('exito');
        this.view.mostrarResumen(this.view.construirResumen(datos));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdmisionController(new AdmisionModel(), new AdmisionView());
});
