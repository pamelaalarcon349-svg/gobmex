// Model.js
class AdmisionModel {
    constructor() {
        this.datos = {};
    }

    // Regla de negocio: Validación del formato oficial de la CURP mexicana
    validarCURP(curp) {
        const regexCurp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CH|CH|CL|CM|CS|DF|DG|GR|GT|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS)[B-DF-HJ-NP-TV-XYZ]{3}[A-Z\d])(\d)$/;
        return regexCurp.test(curp.toUpperCase());
    }

    // Regla de negocio: Validación estándar de correo electrónico
    validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    // Recolecta de forma exhaustiva todos los campos declarados en el HTML
    mapearDatosFormulario(formElement) {
        // Recolección automatizada de campos directos con ID
        this.datos = {
            nacionalidad: formElement.querySelector('input[name="nacionalidad"]:checked')?.value || '',
            curp: document.getElementById('curp').value,
            nombre: document.getElementById('nombre').value,
            primerApellido: document.getElementById('primerApellido').value,
            segundoApellido: document.getElementById('segundoApellido').value,
            sexo: document.getElementById('sexo').value,
            fechaNacimiento: document.getElementById('fecha_nacimiento').value,
            lugarNacimiento: document.getElementById('lugarNacimiento').value,
            lada: document.getElementById('lada').value,
            telFijo: document.getElementById('telFijo').value,
            ext: document.getElementById('ext').value,
            telMovil: document.getElementById('telMovil').value,
            email: document.getElementById('email').value,
            domicilio: {
                cp: document.getElementById('cp').value,
                estado: document.getElementById('estado').value,
                municipio: document.getElementById('municipio').value,
                localidad: document.getElementById('localidad').value,
                colonia: document.getElementById('colonia').value,
                tipoCalle: document.getElementById('tipoCalle').value,
                calle: document.getElementById('calle').value,
                numExt: document.getElementById('numExt').value,
                numInt: document.getElementById('numInt').value,
                pais: document.getElementById('pais').value
            },
            contactoEmergencia: {
                lada: document.getElementById('ladaEmergencia').value,
                telFijo: document.getElementById('telFijoEmergencia').value,
                ext: document.getElementById('extEmergencia').value,
                telMovil: document.getElementById('telMovilEmergencia').value,
                parentesco: document.getElementById('parentesco').value
            },
            datosAcademicos: {
                posgradoInteres: formElement.querySelector('input[name="posgrado"]:checked')?.value || '',
                maestriaSeleccionada: document.getElementById('maestriaSelect').value,
                doctoradoSeleccionado: document.getElementById('doctoradoSelect').value,
                anioIngreso: document.getElementById('anioIngreso').value,
                periodoIngreso: formElement.querySelector('input[name="periodoIngreso"]:checked')?.value || '',
                formaEvaluacion: formElement.querySelector('input[name="formaEvaluacion"]:checked')?.value || ''
            },
            estudiosPrevios: {
                institucion: document.getElementById('institucion').value,
                gradoAcademico: document.getElementById('gradoAcademico').value,
                anioGrado: document.getElementById('anioGrado').value,
                promedio: document.getElementById('promedio').value,
                tipoTitulacion: formElement.querySelector('input[name="titulacion"]:checked')?.value || '',
                especificacionTitulacion: document.getElementById('especificarTitulacion').value
            }
        };

        // Recolección de la tabla de Idioma Inglés
        this.datos.dominioIngles = {
            expresionEscrita: formElement.querySelector('input[name="ingles1"]:checked')?.value || '',
            expresionOral: formElement.querySelector('input[name="ingles2"]:checked')?.value || '',
            comprensionLectora: formElement.querySelector('input[name="ingles3"]:checked')?.value || '',
            comprensionAuditiva: formElement.querySelector('input[name="ingles4"]:checked')?.value || ''
        };

        // Recolección matricial de la tabla de Experiencia Laboral
        this.datos.experienciaLaboral = [];
        const filasLaborales = formElement.querySelectorAll('table:nth-of-type(2) tbody tr');
        filasLaborales.forEach(fila => {
            const inputs = fila.querySelectorAll('input');
            const select = fila.querySelector('select');
            
            const institucion = inputs[0]?.value || '';
            const tipoExperiencia = select?.value || '';
            const puesto = inputs[1]?.value || '';
            const tiempo = inputs[2]?.value || '';

            // Solo agrega registros si contienen información relevante
            if (institucion || puesto || tiempo) {
                this.datos.experienciaLaboral.push({
                    institucion,
                    tipoExperiencia,
                    puestoFunciones: puesto,
                    tiempoLaborado: tiempo
                });
            }
        });

        // Recolección de la sección de Publicaciones Científicas
        this.datos.publicaciones = [];
        const bloquesPublicaciones = formElement.querySelectorAll('h2:nth-of-type(5) ~ .row.g-3');
        bloquesPublicaciones.forEach(bloque => {
            const titulo = bloque.querySelector('input')?.value || '';
            const descripcion = bloque.querySelector('textarea')?.value || '';

            if (titulo || descripcion) {
                this.datos.publicaciones.push({ titulo, descripcion });
            }
        });
    }

    // Orquestación del envío asíncrono de los datos limpios al servidor
    enviarDatos() {
        return new Promise((resolve, reject) => {
            console.log("Estructura JSON generada por el Modelo:", JSON.stringify(this.datos, null, 2));
            
            // Simulación de pasarela de red con API Fetch ficticia
            setTimeout(() => {
                resolve({ codigo: 200, mensaje: "Datos transferidos exitosamente al servidor." });
            }, 1000);
        });
    }
}