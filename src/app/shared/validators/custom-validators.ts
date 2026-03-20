import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CustomValidators = {
  required(message = 'Este campo es requerido'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isEmpty =
        control.value === null ||
        control.value === undefined ||
        control.value === '' ||
        (typeof control.value === 'string' && control.value.trim() === '');
      return isEmpty ? { required: { message } } : null;
    };
  },

  minLength(min: number, message?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length >= min
        ? null
        : { minLength: { message: message || `Debe tener al menos ${min} caracteres` } };
    };
  },

  maxLength(max: number, message?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length <= max
        ? null
        : { maxLength: { message: message || `No debe superar los ${max} caracteres` } };
    };
  },

  pattern(regex: RegExp, message: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value || regex.test(control.value)
        ? null
        : { pattern: { message } };
    };
  },

  rut(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const cleanValue = value.replace(/[^0-9kK]/g, '');
      if (cleanValue.length < 8 || cleanValue.length > 9) {
        return { rut: { message: 'RUT inválido' } };
      }

      const body = cleanValue.slice(0, -1);
      const dv = cleanValue.slice(-1).toUpperCase();

      let sum = 0;
      let multiplier = 2;

      for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }

      const expectedDv = 11 - (sum % 11);
      const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : String(expectedDv);

      return calculatedDv === dv
        ? null
        : { rut: { message: 'RUT inválido' } };
    };
  },

  phone(): ValidatorFn {
    const phoneRegex = /^\+?569\d{8}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      return phoneRegex.test(value.replace(/\s/g, ''))
        ? null
        : { phone: { message: 'Teléfono inválido (formato: +56912345678)' } };
    };
  },

  email(message = 'Email inválido'): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value || emailRegex.test(control.value)
        ? null
        : { email: { message } };
    };
  },

  numberRange(min: number, max: number, message?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      if (isNaN(value)) return null;
      return value >= min && value <= max
        ? null
        : { numberRange: { message: message || `El valor debe estar entre ${min} y ${max}` } };
    };
  },

  year(message?: string): ValidatorFn {
    const currentYear = new Date().getFullYear();
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      if (!control.value || isNaN(value)) return null;
      return value >= 1000 && value <= currentYear + 1
        ? null
        : { year: { message: message || `Año inválido (1000-${currentYear + 1})` } };
    };
  },

  isbn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.replace(/[-\s]/g, '') || '';
      if (!value) return null;

      const isValidISBN10 = /^(\d{9}[\dXx])$/.test(value) && (() => {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += (10 - i) * parseInt(value[i], 10);
        }
        const dv = value[9]?.toUpperCase() === 'X' ? 10 : parseInt(value[9], 10);
        sum += dv;
        return sum % 11 === 0;
      })();

      const isValidISBN13 = /^(\d{13})$/.test(value) && (() => {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          sum += parseInt(value[i], 10) * (i % 2 === 0 ? 1 : 3);
        }
        const dv = (10 - (sum % 10)) % 10;
        return dv === parseInt(value[12], 10);
      })();

      return isValidISBN10 || isValidISBN13
        ? null
        : { isbn: { message: 'ISBN inválido' } };
    };
  },
};
