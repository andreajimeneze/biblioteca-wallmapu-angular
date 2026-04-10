import { Component, effect, input, output, signal } from '@angular/core';
import { CopyFormVM } from '@features/copy/models/copy-model.vm';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { CopyStatusSelectComponents } from "@features/copy-status/components/copy-status-select-components/copy-status-select-components";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-copy-form-components',
  imports: [
    DatePipe,
    LoadingComponent, 
    MessageErrorComponent, 
    CopyStatusSelectComponents
  ],
  templateUrl: './copy-form-components.html',
})
export class CopyFormComponents {
  readonly isLoading = input<boolean>(true);
  readonly copyFormVM = input<CopyFormVM | null>(null);
  readonly onFormSubmit = output<CopyFormVM>();  
  
  protected readonly toggleStatus = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formData = signal<Partial<CopyFormVM>>({});  
  
  private readonly updateEffect = effect(() => {
    const item = this.copyFormVM();
    if (!item) return;

    this.formData.set(item);
  });

  protected updateTopography(value: string, input: HTMLInputElement) {
    this.updateField('signature_topography', value, input);
  }

  protected updateCopyNumber(value: string, input: HTMLInputElement) {
    this.updateField('copy_number', value, input);
  }

  protected updateStatus(value: number) {
    this.updateField('status_id', value.toString());
  }

  private updateField<K extends keyof CopyFormVM>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof CopyFormVM, value: string): string | number  | null {
    switch (key){
      case 'signature_topography':
        if (value.length > 50) return null;
        return value;    
      case 'copy_number':
        if (!/^[0-9]*$/.test(value)) return null;
        if (value.length > 2) return null;
        return Number(value);   
      default:
        return value;
    }
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData = {
      ...data
    } as CopyFormVM;

    this.errorMessage.set(null);
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<CopyFormVM>): string | null {
    if (data.copy_number == null)
      return 'El número de copia es requerido';

    if (data.copy_number <= 0)
      return 'El número de copia debe ser mayor a 0';
    
    return null;
  }

  protected activateStatusBtn(event: Event): void {
    event.preventDefault();
    this.toggleStatus.update(value => !value);
  }
}
