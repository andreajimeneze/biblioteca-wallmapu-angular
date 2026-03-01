import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { BookModel } from '@features/book/models/book-model';
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-book-form-component',
  imports: [
    JsonPipe,
    NgOptimizedImage,
    EditorialSelectComponents,
    MessageErrorComponent
],
  templateUrl: './book-form-component.html',
})
export class BookFormComponent {
  readonly bookModel = input<BookModel | null>(null);
  readonly onFormSubmit = output<BookModel>();

  readonly imageError = signal<string | null>(null);
  imagePreview = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly formData = signal<Partial<BookModel>>({});

  private readonly effect = effect(() => {
    const book = this.bookModel();
    if (book) {
      this.formData.set(book);
    }
  });

  protected updateTitle(value: string, input: HTMLInputElement) {
    this.updateField('title', value, input);
  }

  protected updateDescription(value: string, input: HTMLTextAreaElement) { 
    this.updateField('description', value, input);
  }

  protected updateISBN(value: string, input: HTMLInputElement) { 
    this.updateField('isbn', value, input);
  }

  protected updateYear(value: string, input: HTMLInputElement) { 
    this.updateField('publication_year', value, input);
  }

  protected updatePages(value: string, input: HTMLInputElement) { 
    this.updateField('pages', value, input);
  }

  protected updateEdition(value: string, input: HTMLInputElement) { 
    this.updateField('edition', value, input);
  }

  protected updateDewey(value: string, input: HTMLInputElement) { 
    this.updateField('dewey_number', value, input);
  }

  protected updateCutter(value: string, input: HTMLInputElement) { 
    this.updateField('cutter', value, input);
  }

  private updateField<K extends keyof BookModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof BookModel, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;
      case 'description':
        if (value.length > 256) return null;
        return value;
      case 'isbn':
        if (!/^(?:\d{9}[\dX]|\d{13})$/.test(value)) return null;
        return value;
      case 'publication_year':
        if (!/^\d*$/.test(value)) return null; 
        if (value.length > 4) return null;
        return value;
      case 'pages':
        if (!/^\d*$/.test(value)) return null; 
        if (value.length > 4) return null;
        return value;
      case 'edition':
        if (!/^[a-zA-Z0-9\s°\-\.]*$/.test(value)) return null;
        if (value.length > 50) return null;
        return value;
      case 'dewey_number':
        if (!/^[0-9.]*$/.test(value)) return null;  // solo números y puntos
        if (value.length > 10) return null;
        return value;
      case 'cutter':
        if (!/^[a-zA-Z0-9]*$/.test(value)) return null; // solo letras y números
        if (value.length > 10) return null;
        return value;            
      default:
        return value;
    }
  }

  protected onChangeImages(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.imageError.set('Debes seleccionar una imagen');
      return;
    }

    const file = input.files[0];

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      this.imageError.set('El archivo debe ser una imagen');
      return;
    }

    this.imageError.set(null);

    // Guardar en modelo
    //this.bookModel.update(b => ({
    //  ...b,
    //  image: file
    //}));

    // Generar preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();
  }
}
