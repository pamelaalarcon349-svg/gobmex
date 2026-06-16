class AdmisionModel {
    constructor() {
        this.datos = {};
    }

    obtenerValor(id) {
        const elemento = document.getElementById(id);
        return elemento ? elemento.value.trim() : '';
    }

    obtenerTextoSelect(id) {
        const select = document.getElementById(id);
        if (!select || select.selectedIndex < 0) return '';
        return select.options[select.selectedIndex].text.trim();
    }

    obtenerRadio(formulario, nombre) {
        return formulario.querySelector(`input[name="${nombre}"]:checked`)?.value || '';
    }

    obtenerPosgradoDetalle(formulario) {
        const tipo = this.obtenerRadio(formulario, 'posgrado');

        if (tipo === 'Maestría') {
            const especialidad = this.obtenerTextoSelect('maestriaSelect');
            return especialidad && especialidad !== 'SELECCIONA'
                ? `Maestría en ${especialidad}`
                : 'Maestría';
        }

        if (tipo === 'Doctorado') {
            const especialidad = this.obtenerTextoSelect('doctoradoSelect');
            return especialidad && especialidad !== 'SELECCIONA'
                ? `Doctorado en ${especialidad}`
                : 'Doctorado';
        }

        return 'No seleccionado';
    }

    obtenerTipoTitulacion(formulario) {
        const tipo = this.obtenerRadio(formulario, 'titulacion') || 'No seleccionado';
        if (tipo !== 'Otro') return tipo;

        return `${tipo} - ${this.obtenerValor('especificarTitulacion') || 'No especificado'}`;
    }

    mapearDatosFormulario(formulario) {
        this.datos = {
            nacionalidad: this.obtenerRadio(formulario, 'nacionalidad'),
            curp: this.obtenerValor('curp'),
            nombre: this.obtenerValor('nombre'),
            primerApellido: this.obtenerValor('primerApellido'),
            segundoApellido: this.obtenerValor('segundoApellido'),
            sexo: this.obtenerValor('sexo'),
            fechaNacimiento: this.obtenerValor('fecha_nacimiento'),
            lugarNacimiento: this.obtenerValor('lugarNacimiento'),
            lada: this.obtenerValor('lada'),
            telFijo: this.obtenerValor('telFijo'),
            ext: this.obtenerValor('ext'),
            telMovil: this.obtenerValor('telMovil'),
            email: this.obtenerValor('email'),
            domicilio: {
                cp: this.obtenerValor('cp'),
                estado: this.obtenerValor('estado'),
                municipio: this.obtenerValor('municipio'),
                localidad: this.obtenerValor('localidad'),
                colonia: this.obtenerValor('colonia'),
                tipoCalle: this.obtenerValor('tipoCalle'),
                calle: this.obtenerValor('calle'),
                numExt: this.obtenerValor('numExt'),
                numInt: this.obtenerValor('numInt'),
                pais: this.obtenerValor('pais')
            },
            contactoEmergencia: {
                nombre: this.obtenerValor('nombreEmergencia'),
                primerApellido: this.obtenerValor('primerApellidoEmergencia'),
                segundoApellido: this.obtenerValor('segundoApellidoEmergencia'),
                lada: this.obtenerValor('ladaEmergencia'),
                telFijo: this.obtenerValor('telFijoEmergencia'),
                ext: this.obtenerValor('extEmergencia'),
                telMovil: this.obtenerValor('telMovilEmergencia'),
                parentesco: this.obtenerValor('parentesco')
            },
            datosAcademicos: {
                posgrado: this.obtenerRadio(formulario, 'posgrado'),
                posgradoDetalle: this.obtenerPosgradoDetalle(formulario),
                maestria: this.obtenerValor('maestriaSelect'),
                doctorado: this.obtenerValor('doctoradoSelect'),
                anioIngreso: this.obtenerValor('anioIngreso'),
                periodo: this.obtenerRadio(formulario, 'periodo'),
                formaEvaluacion: this.obtenerRadio(formulario, 'formaEvaluacion')
            },
            estudiosPrevios: {
                institucion: this.obtenerValor('institucion'),
                gradoAcademico: this.obtenerValor('gradoAcademico'),
                anioGrado: this.obtenerValor('anioGrado'),
                promedio: this.obtenerValor('promedio'),
                tipoTitulacion: this.obtenerTipoTitulacion(formulario)
            },
            dominioIngles: {
                expresionEscrita: this.obtenerRadio(formulario, 'ingles1') || 'No especificado',
                expresionOral: this.obtenerRadio(formulario, 'ingles2') || 'No especificado',
                comprensionLectora: this.obtenerRadio(formulario, 'ingles3') || 'No especificado',
                comprensionAuditiva: this.obtenerRadio(formulario, 'ingles4') || 'No especificado'
            },
            motivacion: {
                razon: this.obtenerValor('razon'),
                medio: this.obtenerRadio(formulario, 'medio')
            }
        };

        return this.datos;
    }

    enviarDatos() {
        console.log('Estructura JSON generada por el Modelo:', JSON.stringify(this.datos, null, 2));
        return Promise.resolve({ codigo: 200, mensaje: 'Datos transferidos exitosamente al servidor.' });
    }
}
