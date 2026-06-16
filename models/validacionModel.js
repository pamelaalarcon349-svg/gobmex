class ValidacionModel {
    static esCampoVacio(valor) {
        return String(valor || '').trim() === '';
    }

    static esSeleccionInvalida(valor) {
        const valorNormalizado = String(valor || '').trim();
        return valorNormalizado === '' || valorNormalizado === 'SELECCIONA';
    }

    static soloNumeros(valor) {
        return String(valor || '').replace(/\D/g, '');
    }

    static validarCURP(curp) {
        const regexCurp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GR|GT|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS)[B-DF-HJ-NP-TV-XYZ]{3}[A-Z\d])(\d)$/;
        return regexCurp.test(String(curp || '').toUpperCase());
    }

    static validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
    }
}