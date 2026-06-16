# INAOE - Solicitud de Admisión a Posgrados

Formulario completo para solicitud de admisión a los programas de posgrado del Instituto Nacional de Astrofísica, Óptica y Electrónica (INAOE).

## Estructura del Proyecto

## Tecnologías Utilizadas

- HTML5
- CSS3 (con Framework GOV.MX)
- JavaScript (jQuery)
- jQuery UI Datepicker
- Bootstrap (Gob.mx framework)
- FontAwesome

## Características

- Formulario completo con todos los campos requeridos
- Validación en tiempo real
- Campos de solo números con alertas
- Selector de fecha de nacimiento (datepicker)
- Selección dinámica de posgrado (Maestría/Doctorado)
- Sección condicional para tipo de titulación "Otro"
- Periodos dinámicos según tipo de posgrado
- Sección de evaluación solo para Maestría
- Tablas para experiencia laboral y publicaciones
- Modal de resumen antes de enviar
- Diseño responsivo (adaptado a móviles, tablets y escritorio)

## Cómo Usar

1. Clonar o descargar todos los archivos
2. Mantener la estructura de carpetas
3. Abrir `index.html` en un navegador web

No se requiere servidor backend para el funcionamiento básico (solo frontend estático).

## Campos del Formulario

### Datos Generales
- Nacionalidad
- CURP
- Nombre(s), Apellidos
- Sexo, Fecha y Lugar de nacimiento
- Datos de contacto (teléfonos, email)

### Domicilio
- Código postal, Estado, Municipio
- Localidad, Colonia
- Tipo de calle, Calle, Números exterior/interior
- País

### Contacto de Emergencia
- Datos de contacto y parentesco

### Datos Académicos
- Posgrado (Maestría/Doctorado) y especialidad
- Año y período de ingreso
- Forma de evaluación (solo Maestría)
- Institución previa, grado, año y promedio
- Tipo de titulación

### Idiomas
- Niveles de inglés (básico/intermedio/avanzado) para 4 habilidades

### Experiencia Laboral
- Tabla con hasta 3 experiencias

### Publicaciones
- Hasta 3 publicaciones científicas

### Información Adicional
- Motivación para estudiar en INAOE
- Medio de difusión

## Responsive Design

- **Escritorio (>1600px):** Layout amplio
- **Laptops (992px-1600px):** Layout estándar
- **Tablets (768px-992px):** Ajustes de padding
- **Móviles (<768px):** Botones a ancho completo, radios más grandes
- **Móviles pequeños (<480px):** Texto más pequeño

## Validaciones Incluidas

- Campos obligatorios (*)
- Validación de solo números con alertas visuales
- CURP deshabilitado para extranjeros
- Validación en tiempo real al perder foco
- Alerta de errores al enviar
- Resumen antes de confirmar envío

## Autor

INAOE - Instituto Nacional de Astrofísica, Óptica y Electrónica

## Licencia

Uso académico e institucional