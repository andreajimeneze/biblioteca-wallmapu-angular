import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, tap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { EditionModelVM } from '@features/edition/models/vm.edition-model';
import { EditionModel } from '@features/edition/models/edition-model';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-edition-form-page',
  imports: [
    SectionHeaderComponent,
    EditionFormComponents,
    MessageErrorComponent
],
  templateUrl: './edition-form-page.html',
})
export class EditionFormPage {
  private readonly state = history.state as {
    title: string,
    id_book: number;
    id_edition: number;
  };

  private readonly router = inject(Router);
  protected readonly vmEditionForm = signal<EditionModelVM>({
    id_edition: this.state.id_edition,
    edition: '',
    isbn: '',
    publication_year: 0,
    pages: 0,
    cover_image: null,
    created_at: '',
    updated_at: '',
    book_id: this.state.id_book,
    editorial_id: 0,
    isNewImg: true
  });
  protected readonly isEditMode = signal<boolean>(this.vmEditionForm().id_edition > 0)
  protected readonly title = computed<string>(() => this.isEditMode() ? `Modificar Ejemplar para: ${this.state.title}` : `Crear Ejemplar para: ${this.state.title}`)
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.editionGetRX,
      this.uploadEditionImageRX,
      this.editionRX,
      this.deleteEditionImageRX
    ].some(r => r.isLoading())
  );
  private readonly editionService = inject(EditionService);
  private readonly editionIdPayload = signal<number | null>(this.vmEditionForm().id_edition);

  private readonly editionGetRX = rxResource({
    params: () => this.editionIdPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition == 0) return of(null);

      return this.editionService.getById(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(edition => {
          if (!edition) {
            this.isEditMode.set(false);
            return;
          }

          this.editionIdPayload.set(null);

          this.vmEditionForm.update(e => ({ 
            ...e, 
            ...edition,
            isNewImg: !edition.cover_image
          })); 
          
          this.isEditMode.set(true);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly editionPayload = signal<EditionModel | null>(null);

  private readonly editionRX = rxResource({
    params: () => this.editionPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      const request$ = params.id_edition == 0 
      ? this.editionService.create(params)
      : this.editionService.update(params.id_edition, params) 

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(edition => {
          this.editionPayload.set(null);
          this.editionIdPayload.set(edition.id_edition); 
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly editionImageService = inject(EditionImageService);
  private readonly uploadImagePayload = signal<File | null>(null);

  private readonly uploadEditionImageRX = rxResource({
    params: () => this.uploadImagePayload(),
    stream: ({ params: file }) => {
      if (!file) return of(null);

      return this.editionImageService.create(file).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(url => {
          if (!url) return;

          this.editionPayload.set({
            ...this.vmEditionForm(),
            cover_image: url
          });
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly deleteImagePayload = signal<number | null>(null);

  private readonly deleteEditionImageRX = rxResource({
    params: () => this.deleteImagePayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);

      return this.editionImageService.delete(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(response => {
          this.deleteImagePayload.set(null);

          this.vmEditionForm.update(e => ({
            ...e,
            cover_image: null,
            isNewImg: true
          }));

          this.editionPayload.set({
            ...this.vmEditionForm(),
          });
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  protected formSubmit(form: EditionModelVM): void {
    this.vmEditionForm.update(e => ({ 
      ...e, 
      ...form
    }));
  
    if (form.file) {
      this.uploadImagePayload.set(form.file);
    } else {
      this.editionPayload.set(this.vmEditionForm());
    }
  }

  protected deleteImage(id_edition: number): void {
    this.deleteImagePayload.set(id_edition);
  }

  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM, this.vmEditionForm().book_id]);
  }
}
