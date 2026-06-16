// Controller.js
class AdmisionController {
    constructor(modeloInstancia, vistaInstancia) {
        this.model = modeloInstancia;
        this.view = vistaInstancia;

        this.vincularEventosUI();
        // Validar campos numéricos
this.view.camposNumericos.forEach(campo => {

    campo.addEventListener("input", (e) => {

        let valorOriginal = e.target.value;

        let valorLimpio = valorOriginal.replace(/\D/g, '');

        if (valorOriginal !== valorLimpio) {

            alert("Este campo sólo acepta números");

            e.target.value = valorLimpio;
        }

    });

});
    }

    // Enlace de listeners de eventos del DOM
    vincularEventosUI() {
        // Evento de intercambio de Nacionalidad
        this.view.radiosNacionalidad.forEach(radio => {
            radio.addEventListener('change', (e) => this.procesarCambioNacionalidad(e.target.value));
        });

        // Evento de selección de tipo de Posgrado
        this.view.radiosPosgrado.forEach(radio => {
            radio.addEventListener('change', (e) => this.procesarCambioPosgrado(e.target.value));
        });

        // Evento de selección de Mecanismo de Titulación
        this.view.radiosTitulacion.forEach(radio => {
            radio.addEventListener('change', (e) => this.procesarCambioTitulacion(e.target.value));
        });

        // Intercepción del proceso nativo de submit
        this.view.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validarYEnviarFormulario();
        });
    }
validarCamposObligatorios() {

    let errores = ValidacionModel.validarCamposObligatorios(
        this.view.camposObligatorios
    );

    this.view.camposObligatorios.forEach(campo => {
        campo.classList.remove("input-error");
    });

    if (errores.length > 0) {

        errores.forEach(campo => {
            campo.classList.add("input-error");
        });

        alert("Debes llenar todos los campos obligatorios.");

        return false;
    }

    return true;
}
    // Modifica los requerimientos de la CURP según el origen geográfico declarado
    procesarCambioNacionalidad(tipoNacionalidad) {
        if (tipoNacionalidad === 'Otra (Extranjera)') {
            this.view.linkCurp.classList.add('deshabilitado-total');
            this.view.inputCurp.removeAttribute('required');
        } else {
            this.view.linkCurp.classList.remove('deshabilitado-total');
            this.view.inputCurp.setAttribute('required', 'required');
        }
    }

    // Ejecuta las mutaciones estructurales del formulario asociadas al Posgrado
    procesarCambioPosgrado(tipoPosgrado) {
        if (tipoPosgrado === 'Maestría') {
            this.view.divMaestrias.style.display = 'block';
            this.view.selectMaestria.setAttribute('required', 'required');
            
            this.view.divDoctorados.style.display = 'none';
            this.view.selectDoctorado.removeAttribute('required');
            this.view.selectDoctorado.value = '';

            this.view.divEvaluacionContainer.style.display = 'block';
            this.view.inyectarPeriodosOpciones(['Otoño (Agosto)', 'Primavera (Enero)']);
            
        } else if (tipoPosgrado === 'Doctorado') {
            this.view.divDoctorados.style.display = 'block';
            this.view.selectDoctorado.setAttribute('required', 'required');
            
            this.view.divMaestrias.style.display = 'none';
            this.view.selectMaestria.removeAttribute('required');
            this.view.selectMaestria.value = '';

            this.view.divEvaluacionContainer.style.display = 'none';
            this.view.form.querySelectorAll('input[name="formaEvaluacion"]').forEach(radio => radio.checked = false);
            this.view.inyectarPeriodosOpciones(['Otoño (Agosto)', 'Primavera (Enero)', 'Verano (Junio)']);
        }
    }

    // Controla la visibilidad y obligatoriedad del campo de especificación de titulación
    procesarCambioTitulacion(metodoTitulacion) {
        if (metodoTitulacion === 'Otro') {
            this.view.divEspecificarTitulacionContainer.style.display = 'block';
            this.view.inputEspecificarTitulacion.setAttribute('required', 'required');
        } else {
            this.view.divEspecificarTitulacionContainer.style.display = 'none';
            this.view.inputEspecificarTitulacion.removeAttribute('required');
            this.view.inputEspecificarTitulacion.value = '';
        }
    }

    // Evalúa la totalidad del ecosistema de reglas de validación previas a la transmisión JSON
    validarYEnviarFormulario() {
        this.view.limpiarValidacionesAnteriores();
        let estructuraValida = true;

        // 1. Auditoría automática de campos obligatorios activos por atributo [required]
        const inputsObligatorios = this.view.form.querySelectorAll('[required]');
        inputsObligatorios.forEach(campo => {
            if (campo.type === 'radio') {
                const radiosGrupo = this.view.form.querySelectorAll(`input[name="${campo.name}"]:checked`);
                if (radiosGrupo.length === 0) {
                    estructuraValida = false;
                    this.view.inyectarErrorEnCampo(campo, 'Debe seleccionar una opción obligatoria.');
                }
            } else {
                if (!campo.value.trim() || campo.value === 'SELECCIONA') {
                    estructuraValida = false;
                    this.view.inyectarErrorEnCampo(campo, 'Este campo es de llenado obligatorio.');
                }
            }
        });

        // 2. Validación profunda de lógica de datos mediante el Modelo
        const campoCurp = document.getElementById('curp');
        const nacionalidadActiva = this.view.form.querySelector('input[name="nacionalidad"]:checked')?.value;
        if (nacionalidadActiva === 'Mexicana' && campoCurp.value.trim()) {
            if (!this.model.validarCURP(campoCurp.value)) {
                estructuraValida = false;
                this.view.inyectarErrorEnCampo(campoCurp, 'La estructura de la CURP introducida no es válida.');
            }
        }

        const campoEmail = document.getElementById('email');
        if (campoEmail.value.trim() && !this.model.validarEmail(campoEmail.value)) {
            estructuraValida = false;
            this.view.inyectarErrorEnCampo(campoEmail, 'El correo electrónico no posee un dominio válido.');
        }

        // 3. Resolución final del formulario tras análisis sintáctico
        if (!estructuraValida) {
            this.view.alternarBannerInformativo('error');
            return;
        }

        // Ejecución de guardado y transferencia en caso de éxito total
        this.model.mapearDatosFormulario(this.view.form);
        this.model.enviarDatos()
            .then(respuesta => {
                if (respuesta.codigo === 200) {
                    this.view.alternarBannerInformativo('exito');
                    this.view.form.reset();
                    // Revierte selectores condicionales a su estado base oculto
                    this.procesarCambioPosgrado('');
                    this.procesarCambioTitulacion('');
                }
            })
            .catch(error => console.error("Anomalía crítica crítica detectada en el envío de datos: ", error));
    }
}

// Inicialización del ecosistema de scripts una vez completado el procesamiento del DOM
document.addEventListener('DOMContentLoaded', () => {
    const appAdmision = new AdmisionController(new AdmisionModel(), new AdmisionView());
});