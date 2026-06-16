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

            // ===== VALIDACIÓN AL ENVIAR =====
            $('#btnEnviarModal').on('click', function(e) {
                e.preventDefault();
                let esValido = true;
                $('#alertaExito').fadeOut();
                $('#alertaError').fadeOut();
                
                $('#formAdmision [required]').each(function() {
                    let $el = $(this);
                    if ($el.prop('disabled')) return;
                    let valor = $el.val() ? $el.val().trim() : "";
                    let $contenedorError = $el.siblings('.error-mensaje');
                    
                    if ($el.attr('type') === 'radio') {
                        let name = $el.attr('name');
                        if ($(`input[name="${name}"]:checked`).length === 0) {
                            esValido = false;
                            let $radioGroup = $el.closest('.form-group');
                            $radioGroup.find('.error-mensaje').first().text('Este campo es obligatorio');
                        }
                        return;
                    }
                    
                    if (valor === "" || valor === "SELECCIONA") {
                        esValido = false;
                        $el.addClass('input-error');
                        $contenedorError.text('Este campo es obligatorio');
                    }
                });
                
                let posgradoSeleccionado = $('input[name="posgrado"]:checked').val();
                if (posgradoSeleccionado === "Maestría") {
                    let maestriaVal = $('#maestriaSelect').val();
                    if (!maestriaVal || maestriaVal === "SELECCIONA") {
                        esValido = false;
                        $('#maestriaSelect').addClass('input-error');
                    }
                } else if (posgradoSeleccionado === "Doctorado") {
                    let doctoradoVal = $('#doctoradoSelect').val();
                    if (!doctoradoVal || doctoradoVal === "SELECCIONA") {
                        esValido = false;
                        $('#doctoradoSelect').addClass('input-error');
                    }
                }
                
                if ($('input[name="periodo"]:checked').length === 0) {
                    esValido = false;
                    $('#errorPeriodo').text('Este campo es obligatorio');
                } else {
                    $('#errorPeriodo').text('');
                }
                
                if (esValido) {
                    $('#alertaExito').fadeIn();
                    mostrarResumen();
                } else {
                    $('#alertaError').fadeIn();
                    $('html, body').animate({ scrollTop: $('.input-error').first().offset().top - 100 }, 500);
                }
            });

            function getPosgradoDetalle() {
                let tipo = $('input[name="posgrado"]:checked').val();
                if (tipo === "Maestría") {
                    let especialidad = $("#maestriaSelect option:selected").text();
                    return especialidad && especialidad !== "SELECCIONA" ? `Maestría en ${especialidad}` : "Maestría";
                } else if (tipo === "Doctorado") {
                    let especialidad = $("#doctoradoSelect option:selected").text();
                    return especialidad && especialidad !== "SELECCIONA" ? `Doctorado en ${especialidad}` : "Doctorado";
                }
                return "No seleccionado";
            }

            function getNivelIngles(name) {
                let val = $(`input[name="${name}"]:checked`).val();
                return val ? val : "No especificado";
            }

            function mostrarResumen() {
                let tipoTitulacion = $('input[name="titulacion"]:checked').val() || "No seleccionado";
                if (tipoTitulacion === "Otro") {
                    tipoTitulacion += ` - ${$("#especificarTitulacion").val() || "No especificado"}`;
                }
                
                let formaEval = $('input[name="formaEvaluacion"]:checked').val();
                let evalHtml = formaEval ? `<li><strong>Forma de Evaluación:</strong> ${formaEval}</li>` : '';
                
                let html = '<div class="section-title"> Datos personales</div><ul>';
                html += `<li><strong>Posgrado seleccionado:</strong> ${getPosgradoDetalle()}</li>`;
                html += `<li><strong>Año de ingreso:</strong> ${$("#anioIngreso").val() || "No especificado"}</li>`;
                html += `<li><strong>Periodo:</strong> ${$('input[name="periodo"]:checked').val() || "No seleccionado"}</li>`;
                html += evalHtml;
                html += `<li><strong>Nacionalidad:</strong> ${$('input[name="nacionalidad"]:checked').val() || "No especificado"}</li>`;
                html += `<li><strong>CURP:</strong> ${$("#curp").val() || "No especificado"}</li>`;
                html += `<li><strong>Nombre completo:</strong> ${$("#nombre").val() || ""} ${$("#primerApellido").val() || ""} ${$("#segundoApellido").val() || ""}</li>`;
                html += `<li><strong>Sexo:</strong> ${$("#sexo").val() || "No especificado"}</li>`;
                html += `<li><strong>Fecha de nacimiento:</strong> ${$("#fecha_nacimiento").val() || "No especificada"}</li>`;
                html += `<li><strong>Lugar de nacimiento:</strong> ${$("#lugarNacimiento").val() || "No especificado"}</li>`;
                html += `<li><strong>Teléfono móvil:</strong> ${$("#telMovil").val() || "No especificado"}</li>`;
                html += `<li><strong>Correo electrónico:</strong> ${$("#email").val() || "No especificado"}</li>`;
                html += `<li><strong>Dirección completa:</strong> ${$("#calle").val() || ""} ${$("#numExt").val() || ""}, ${$("#colonia").val() || ""}, CP ${$("#cp").val() || ""}, ${$("#municipio").val() || ""}, ${$("#estado").val() || ""}</li>`;
                html += `</ul><div class="section-title">Datos académicos</div><ul>`;
                html += `<li><strong>Institución de procedencia:</strong> ${$("#institucion").val() || "No especificada"}</li>`;
                html += `<li><strong>Grado obtenido:</strong> ${$("#gradoAcademico").val() || "No especificado"}</li>`;
                html += `<li><strong>Año de obtención:</strong> ${$("#anioGrado").val() || "No especificado"}</li>`;
                html += `<li><strong>Promedio:</strong> ${$("#promedio").val() || "No especificado"}</li>`;
                html += `<li><strong>Tipo de titulación:</strong> ${tipoTitulacion}</li>`;
                html += `</ul><div class="section-title">Dominio del inglés</div><ul>`;
                html += `<li><strong>Expresión escrita:</strong> ${getNivelIngles("ingles1")}</li>`;
                html += `<li><strong>Expresión oral:</strong> ${getNivelIngles("ingles2")}</li>`;
                html += `<li><strong>Comprensión lectora:</strong> ${getNivelIngles("ingles3")}</li>`;
                html += `<li><strong>Comprensión auditiva:</strong> ${getNivelIngles("ingles4")}</li>`;
                html += `</ul><div class="section-title"> Motivación</div><ul>`;
                html += `<li><strong>Razón para estudiar en INAOE:</strong> ${$("#razon").val() || "No especificada"}</li>`;
                html += `</ul>`;
                
                $("#contenidoResumen").html(html);
                $("#modalResumen").modal("show");
            }

            $("#confirmarEnvio").on("click", function() {
                $("#modalResumen").modal("hide");
                alert("Solicitud enviada con éxito. Pronto recibirás respuesta del INAOE.");

                
            });
