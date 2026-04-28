import { DatePipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';
import { ButtonClearComponent } from "@shared/components/button-clear-component/button-clear-component";
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-author-form-components',
  imports: [
    DatePipe,
    ButtonClearComponent,
    ButtonCreateComponent,
    LoadingComponent
],
  templateUrl: './author-form-components.html',
})
export class AuthorFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly author = input<AuthorModel | null>(null);
  protected readonly onFormSubmit = output<AuthorModel>();
  protected readonly onClear = output<void>();

  protected readonly errorMessage = signal<string | null>(null); 
  protected readonly actionText = computed<string>(() => this.author() ? 'Modificar Autor' : 'Crear Autor');
  protected readonly formData = signal<Partial<AuthorModel>>({});

  private readonly updateFormEffect = effect(() => {
    const item = this.author();
    if (!item) {
      this.formData.set({ id_author: 0 });  
      return
    };

    this.formData.set(item);
  });

  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof AuthorModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; 
      return;
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof AuthorModel, value: string): string | null {
    switch (key){
      case 'name':
        if (value.length > 100) return null;
        return value;       
      default:
        return value;
    }
  }

  protected submitForm(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: AuthorModel = {
      ...data
    } as AuthorModel;

    this.errorMessage.set(null);
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<AuthorModel>): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';
    
    return null;
  }
}
