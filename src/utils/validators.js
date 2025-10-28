/**
 * Validadores para formularios
 */

export const validators = {
    /**
     * Valida email
     */
    email: (value) => {
      if (!value) return 'El email es obligatorio';
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? true : 'Email inválido';
    },
  
    /**
     * Valida CUIT
     */
    cuit: (value) => {
      if (!value) return 'El CUIT es obligatorio';
      const regex = /^\d{2}-?\d{8}-?\d{1}$/;
      return regex.test(value) ? true : 'Formato de CUIT inválido (ej: 30-12345678-9)';
    },
  
    /**
     * Valida DNI
     */
    dni: (value) => {
      if (!value) return 'El DNI es obligatorio';
      const regex = /^\d{7,8}$/;
      return regex.test(value) ? true : 'DNI inválido (7 u 8 dígitos)';
    },
  
    /**
     * Valida WhatsApp
     */
    whatsapp: (value) => {
      if (!value) return 'El número de WhatsApp es obligatorio';
      const cleaned = value.replace(/\D/g, '');
      const regex = /^\d{10,15}$/;
      return regex.test(cleaned) ? true : 'Formato de WhatsApp inválido';
    },
  
    /**
     * Valida patente
     */
    patente: (value) => {
      if (!value) return 'La patente es obligatoria';
      // Acepta patentes viejas (ABC123) y nuevas (AB123CD)
      const regex = /^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/;
      return regex.test(value.toUpperCase()) ? true : 'Formato de patente inválido';
    },
  
    /**
     * Campo requerido
     */
    required: (fieldName = 'Este campo') => (value) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} es obligatorio`;
      }
      return true;
    },
  
    /**
     * Longitud mínima
     */
    minLength: (min, fieldName = 'Este campo') => (value) => {
      if (!value || value.length < min) {
        return `${fieldName} debe tener al menos ${min} caracteres`;
      }
      return true;
    },
  
    /**
     * Longitud máxima
     */
    maxLength: (max, fieldName = 'Este campo') => (value) => {
      if (value && value.length > max) {
        return `${fieldName} no puede tener más de ${max} caracteres`;
      }
      return true;
    },
  
    /**
     * Valor numérico
     */
    number: (fieldName = 'Este campo') => (value) => {
      if (!value) return `${fieldName} es obligatorio`;
      if (isNaN(value)) return `${fieldName} debe ser un número`;
      return true;
    },
  
    /**
     * Valor mínimo
     */
    min: (minValue, fieldName = 'Este campo') => (value) => {
      if (!value) return `${fieldName} es obligatorio`;
      if (Number(value) < minValue) {
        return `${fieldName} debe ser mayor o igual a ${minValue}`;
      }
      return true;
    },
  
    /**
     * Valor máximo
     */
    max: (maxValue, fieldName = 'Este campo') => (value) => {
      if (!value) return `${fieldName} es obligatorio`;
      if (Number(value) > maxValue) {
        return `${fieldName} debe ser menor o igual a ${maxValue}`;
      }
      return true;
    },
  
    /**
     * Rango de valores
     */
    range: (min, max, fieldName = 'Este campo') => (value) => {
      if (!value) return `${fieldName} es obligatorio`;
      const num = Number(value);
      if (num < min || num > max) {
        return `${fieldName} debe estar entre ${min} y ${max}`;
      }
      return true;
    },
  
    /**
     * Año válido
     */
    year: (value) => {
      if (!value) return 'El año es obligatorio';
      const currentYear = new Date().getFullYear();
      const year = Number(value);
      if (year < 1900 || year > currentYear + 1) {
        return `Año inválido (debe estar entre 1900 y ${currentYear + 1})`;
      }
      return true;
    },
  
    /**
     * Validación condicional
     */
    requiredIf: (condition, fieldName = 'Este campo') => (value) => {
      if (condition && (!value || (typeof value === 'string' && !value.trim()))) {
        return `${fieldName} es obligatorio`;
      }
      return true;
    }
  };
  
  /**
   * Ejecuta múltiples validaciones
   */
  export const validate = (value, validatorFunctions) => {
    for (const validator of validatorFunctions) {
      const result = validator(value);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
  
  /**
   * Valida un objeto completo
   */
  export const validateForm = (formData, rules) => {
    const errors = {};
    
    for (const field in rules) {
      const value = formData[field];
      const fieldRules = rules[field];
      
      for (const validator of fieldRules) {
        const result = validator(value);
        if (result !== true) {
          errors[field] = result;
          break;
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  