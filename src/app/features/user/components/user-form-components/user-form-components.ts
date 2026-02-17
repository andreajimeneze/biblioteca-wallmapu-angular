import { Component, effect, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { CommuneSelectComponents } from "@features/commune/components/commune-select-components/commune-select-components";
import { UserModel } from '@features/user/models/user-model';
import { AuthUser } from '@features/auth/models/auth-user';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-form-components',
  imports: [
    NgOptimizedImage,
    DatePipe,
    MessageErrorComponent, 
    CommuneSelectComponents
  ],
  templateUrl: './user-form-components.html',
})
export class UserFormComponents {
  readonly user = input.required<UserModel>();
  readonly authUser = input.required<AuthUser>()
  readonly loading = input<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  /* -- Form data ----------------------------------------- */
  readonly formData = signal<Partial<UserModel>>({});

  private readonly syncFormEffect = effect(() => {
    const user = this.user();
    if (!user) return; 

    this.formData.set({
      name: user.name ?? '',
      lastname: user.lastname ?? '',
      rut: user.rut ?? '',
      address: user.address ?? '',
      phone: user.phone ?? ''
    });
  });

  /* -- Form Updates -------------------------------------- */
  protected updatePhone(value: string, input: HTMLInputElement) { 
    this.updateField('phone', value, input); 
  }
  protected updateName(value: string) { this.updateField('name', value); }
  protected updateLastname(value: string) { this.updateField('lastname', value); }
  protected updateRut(value: string) { this.updateField('rut', value); }
  protected updateAddress(value: string) { this.updateField('address', value); }
  
  private updateField<K extends keyof UserModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);
    if (sanitized === null) {
      // ✅ Forzar el valor anterior de vuelta en el DOM
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    } // valor inválido, no actualiza

    this.formData.update(data => ({ ...data, [key]: value }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof UserModel, value: string): string | null {
    console.log(`${key} - ${value}`)
    switch (key){
      case 'phone':
        if (!/^\d*$/.test(value)) return null;       // solo números
        if (value.length > 12) return null;           // máximo 12
        
        return value;
      default:
        return value;
    }
  }

  /* -- Submit -------------------------------------------- */
  onSubmit(event: Event) {

  }
}
