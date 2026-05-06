import { Component, input, output, signal } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonNotificationComponent } from "@shared/components/button-notification-component/button-notification-component";
import { CreateNotificationByEmailModel } from '@features/notification/models/notification-model';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-notification-form-components',
  imports: [
    JsonPipe,
    LoadingComponent,
    ButtonNotificationComponent,
    MessageErrorComponent,
  ],
  templateUrl: './notification-form-components.html',
})
export class NotificationFormComponents {
  protected readonly isLoading = input<boolean>(false);
  protected readonly onFormSubmit = output<CreateNotificationByEmailModel>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formData = signal<Partial<CreateNotificationByEmailModel>>({ is_priority: false });

  protected updatePriority(value: boolean) {
    this.formData.update(data => ({ ...data, is_priority: value }));
  }

  protected updateEmail(value: string, input: HTMLInputElement) {
    this.updateField('email', value, input);
  }

  protected updateTitle(value: string, input: HTMLInputElement) {
    this.updateField('title', value, input);
  }

  protected updateMessage(value: string, input: HTMLTextAreaElement) {
    this.updateField('message', value, input);
  }

  private updateField<K extends keyof CreateNotificationByEmailModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof CreateNotificationByEmailModel, value: string): string | null {
    switch (key){
      case 'email':
        if (value.length > 50) return null;
        return value;    
      case 'title':
        if (value.length > 50) return null;
        return value;
      case 'message':
        if (value.length > 256) return null;
        return value;  
      default:
        return value;
    }
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();

    const data = this.formData();

    this.errorMessage.set(null);
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: CreateNotificationByEmailModel = {
      ...data
    } as CreateNotificationByEmailModel;

    console.log(submitData)
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<CreateNotificationByEmailModel>): string | null {
    if (!data.email)
      return 'El Email es obligatorio';
  
    if (!this.isValidEmail(data.email))
      return 'El formato del email no es válido';
  
    if (!data.title)
      return 'El titulo es obligatorio';
  
    if (!data.message)
      return 'El mensaje es obligatorio';
    
    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
