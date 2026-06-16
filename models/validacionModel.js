class ValidacionModel {

    static esSoloNumeros(valor) {
        return /^\d+$/.test(valor);
    }

    static esCampoVacio(valor) {
        return valor.trim() === "";
    }

    static validarCamposObligatorios(campos) {
        let errores = [];

        campos.forEach(campo => {
            if (this.esCampoVacio(campo.value)) {
                errores.push(campo);
            }
        });

        return errores;
    }

}