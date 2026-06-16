// View.js
class AdmisionView {
    constructor() {
        // Elementos raíz del formulario y flujos principales
        this.form = document.getElementById('formAdmision');
        this.radiosNacionalidad = document.getElementsByName('nacionalidad');
        this.linkCurp = document.getElementById('linkCurp');
        this.inputCurp = document.getElementById('curp');

        // Mapeo exhaustivo de secciones académicas y sus selectores derivados
        this.radiosPosgrado = document.getElementsByName('posgrado');
        this.divMaestrias = document.getElementById('maestrias');
        this.divDoctorados = document.getElementById('doctorados');
        this.selectMaestria = document.getElementById('maestriaSelect');
        this.selectDoctorado = document.getElementById('doctoradoSelect');
        this.divPeriodoOptions = document.getElementById('opcionesPeriodo');
        this.divEvaluacionContainer = document.getElementById('evaluacionContainer');

        // Mapeo de la sección de titulación alternativa
        this.radiosTitulacion = document.getElementsByName('titulacion');
        this.divEspecificarTitulacionContainer = document.getElementById('especificarTitulacionContainer');
        this.inputEspecificarTitulacion = document.getElementById('especificarTitulacion');

        // Contenedores globales de estatus operativo
        this.alertaExito = document.getElementById('alertaExito');
        this.alertaError = document.getElementById('alertaError');
         // ===== CAMPOS NUMÉRICOS =====
        this.camposNumericos = document.querySelectorAll('.solo-numeros');

        // ===== CAMPOS OBLIGATORIOS =====
        this.camposObligatorios = [
            document.getElementById('curp'),
            document.getElementById('nombre'),
            document.getElementById('primerApellido'),
            document.getElementById('sexo'),
            document.getElementById('fechaNacimiento'),
            document.getElementById('lugarNacimiento'),
            document.getElementById('lada'),
            document.getElementById('telMovil'),
            document.getElementById('email'),
            document.getElementById('cp'),
            document.getElementById('estado'),
            document.getElementById('municipio'),
            document.getElementById('localidad'),
            document.getElementById('colonia'),
            document.getElementById('tipoCalle'),
            document.getElementById('calle'),
            document.getElementById('numExt'),
            document.getElementById('pais')
        ];


        this.establecerComportamientoInicial();
        
    }

    // Configura los estados iniciales ocultos solicitados por la lógica de negocio
    establecerComportamientoInicial() {
        this.divMaestrias.style.display = 'none';
        this.divDoctorados.style.display = 'none';
        this.divEvaluacionContainer.style.display = 'none';
        this.divEspecificarTitulacionContainer.style.display = 'none';

        // Escucha y restringe de manera activa entradas no numéricas en campos con la clase asignada
        document.body.addEventListener('keypress', (e) => {
            if (e.target.classList.contains('solo-numeros')) {
                if (!/[\d]/.test(e.key)) {
                    e.preventDefault();
                    this.desplegarNotificacionFlotanteNumeros();
                }
            }
        });
    }

    // Modifica dinámicamente el listado de radios asignados a la sección de Periodos de Ingreso
    inyectarPeriodosOpciones(periodos) {
        this.divPeriodoOptions.innerHTML = '';
        periodos.forEach(periodo => {
            const divRadio = document.createElement('div');
            divRadio.className = 'radio';
            divRadio.innerHTML = `<label><input type="radio" name="periodoIngreso" value="${periodo}" required> ${periodo}</label>`;
            this.divPeriodoOptions.appendChild(divRadio);
        });
    }

    // Despliega una alerta temporal y no invasiva para advertir la restricción numérica
    desplegarNotificacionFlotanteNumeros() {
        if (!document.querySelector('.alerta-numeros')) {
            const alerta = document.createElement('div');
            alerta.className = 'alerta-numeros';
            alerta.innerText = 'Sólo se admiten números en este campo';
            document.body.appendChild(alerta);
            setTimeout(() => alerta.remove(), 2500);
        }
    }

    // Visualiza un mensaje de error enfocado en un campo de texto o selector específico
    inyectarErrorEnCampo(elementoCampo, mensajeError) {
        elementoCampo.classList.add('input-error');
        const grupoFormulario = elementoCampo.closest('.form-group') || elementoCampo.parentElement;
        const etiquetaMensaje = grupoFormulario.querySelector('.error-mensaje');
        if (etiquetaMensaje) {
            etiquetaMensaje.innerText = mensajeError;
        }
    }

    // Restablece por completo todas las anomalías visuales e indicadores de error previos
    limpiarValidacionesAnteriores() {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        document.querySelectorAll('.error-mensaje').forEach(el => el.innerText = '');
        this.alertaExito.style.display = 'none';
        this.alertaError.style.display = 'none';
    }

    // Despliega los banners globales de control superiores
    alternarBannerInformativo(tipoResultado) {
        if (tipoResultado === 'exito') {
            this.alertaExito.style.display = 'block';
        } else if (tipoResultado === 'error') {
            this.alertaError.style.display = 'block';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}