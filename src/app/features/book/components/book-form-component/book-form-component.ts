import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { BookModel } from '@features/book/models/book-model';
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";
import { AuthorListComponents } from "@features/book-author/components/author-list-components/author-list-components";
import { SubjectListComponents } from "@features/book-subject/components/subject-list-components/subject-list-components";

@Component({
  selector: 'app-book-form-component',
  imports: [
    JsonPipe,
    MessageErrorComponent,
    GenreSelectComponents,
    AuthorSelectComponents,
    SubjectSelectComponents,
    AuthorListComponents,
    SubjectListComponents
],
  templateUrl: './book-form-component.html',
})
export class BookFormComponent {
  readonly bookModel = input<BookModel | null>(null);
  readonly onFormSubmit = output<BookModel>();

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

  protected updateSummary(value: string, input: HTMLTextAreaElement) {
    this.updateField('summary', value, input);
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
      default:
        return value;
    }
  }

  /*  

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
  */
  protected formSubmit(event: Event): void {
    event.preventDefault();
  }
}
