import { Component, effect, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { CommuneSelectComponents } from "@features/commune/components/commune-select-components/commune-select-components";
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { UserRoleSelectComponents } from "@features/user-role/components/user-role-select-components/user-role-select-components";
import { UserProfileVM } from '@features/user/models/user-profile.vm';

@Component({
  selector: 'app-user-form-components',
  imports: [
    CommonModule,
    NgOptimizedImage,
    DatePipe,
    MessageErrorComponent,
    CommuneSelectComponents,
    UserStatusSelectComponents,
    UserRoleSelectComponents
],
  templateUrl: './user-form-components.html',
})
export class UserFormComponents {
  readonly userProfileVM = input<UserProfileVM | null>(null);
  readonly formSubmit = output<UserProfileVM>();

  readonly errorMessage = signal<string | null>(null);

  /* -- Form data ----------------------------------------- */
  readonly formData = signal<Partial<UserProfileVM>>({});

  private readonly syncFormEffect = effect(() => {
    const user = this.userProfileVM();
    if (!user) return; 

    this.formData.set({
      name: user.name ?? '',
      lastname: user.lastname ?? '',
      rut: user.rut ?? '',
      address: user.address ?? '',
      phone: user.phone ?? '',
      commune_id: user.commune_id ?? 0,
    });
  });

  /* -- Form Updates -------------------------------------- */
  protected updatePhone(value: string, input: HTMLInputElement) { 
    this.updateField('phone', value, input); 
  }
  protected updateName(value: string, input: HTMLInputElement) { 
    this.updateField('name', value, input); 
  }
  protected updateLastname(value: string, input: HTMLInputElement) {
    this.updateField('lastname', value, input); 
  }
  protected updateRut(value: string, input: HTMLInputElement) { 
    this.updateField('rut', value, input); 
  }
  protected updateAddress(value: string, input: HTMLInputElement) { 
    this.updateField('address', value, input); 
  }
  protected updateCommune(id: number | null) {
    this.formData.update(data => ({ ...data, commune_id: id ?? 0 }));
  }

  private updateField<K extends keyof UserProfileVM>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: value }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof UserProfileVM, value: string): string | null {
    switch (key){
      case 'phone':
        if (!/^\d*$/.test(value)) return null; // solo números
        if (value.length > 9) return null; // máximo 9
        return value;
      case 'name':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return null; // solo texto
        if (value.length > 45) return null;
        return value;
      case 'lastname':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return null;
        if (value.length > 45) return null;
        return value;
      case 'rut':
        if (!/^[\d\-kK]*$/.test(value)) return null; // solo números, guión y K k
        if (value.length > 10) return null;
        return value;   
      case 'address':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\,\-\°\#\.]*$/.test(value)) return null; // solo texto, números y caracteres
        if (value.length > 256) return null;
        return value;       
      default:
        return value;
    }
  }

  /* -- Submit -------------------------------------------- */
  onSubmit(event: Event) {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    if (data.commune_id == 0) {
      this.errorMessage.set('La comuna es requerida');
      return;
    }

    const original = this.userProfileVM(); // 👈 VM completo del input
    
    if (!original) {
      this.errorMessage.set('No se encontró el usuario original');
      return;
    }

    const completeVM: UserProfileVM = {
      ...original,
      ...data,
    };

    this.errorMessage.set(null)
    this.formSubmit.emit(completeVM); // ✅ emite al padre
  }
  
  private validateFormOnSubmit(data: Partial<UserProfileVM>): string | null {
    if (!data.name?.trim())           return 'El nombre es requerido';
    if (data.name.length < 2)         return 'El nombre debe tener al menos 2 caracteres';
  
    if (!data.lastname?.trim())       return 'El apellido es requerido';
    if (data.lastname.length < 2)     return 'El apellido debe tener al menos 2 caracteres';
  
    if (!data.rut?.trim())            return 'El RUT es requerido';
    if (!this.validateRut(data.rut))  return 'El RUT no es válido';
  
    if (!data.phone?.trim())          return 'El teléfono es requerido';
    if (data.phone.length < 9)        return 'El teléfono debe tener 9 dígitos';
  
    if (!data.address?.trim())        return 'La dirección es requerida';
    if (data.address.length < 5)      return 'La dirección es muy corta';
  
    return null; // ✅ sin errores
  }

  private validateRut(rut: string): boolean {
    // Formato esperado: 12345678-9 o 12345678-K
    if (!/^\d{7,8}-[\dkK]$/.test(rut)) return false;
  
    const [body, dv] = rut.split('-');
    
    let sum = 0;
    let multiplier = 2;
  
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
  
    const remainder = 11 - (sum % 11);
    const expected = remainder === 11 ? '0' : remainder === 10 ? 'k' : String(remainder);
  
    return dv.toLowerCase() === expected;
  }
}
