import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, tap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { Router } from '@angular/router';
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { CreateEditionModel, UpdateEditionModel } from '@features/edition/models/edition-model';
import { EditionFormVM } from '@features/edition/models/vm.edition-form-model';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { CopyListComponents } from "@features/copy/components/copy-list-components/copy-list-components";
import { CopyService } from '@features/copy/services/copy-service';
import { CopyWithStatusModel } from '@features/copy/models/copy-model';

@Component({
  selector: 'app-edition-form-page',
  imports: [
    SectionHeaderComponent,
    EditionFormComponents,
    MessageErrorComponent,
    ModalDeleteComponent,
    MessageSuccessComponent,
    CopyListComponents
],
  templateUrl: './edition-form-page.html',
})
export class EditionFormPage {
  private readonly router = inject(Router);

  private readonly state = history.state as {
    book_title: string,
    id_book: number,
    id_edition: number,
  }

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly editionService = inject(EditionService);
  private readonly getEditionPayload = signal<number | null>(this.state.id_edition);
  private readonly addBaseEditionPayload = signal<CreateEditionModel | UpdateEditionModel | null>(null);
  private readonly addEditionPayload = signal<CreateEditionModel | UpdateEditionModel | null>(null);

  private readonly copyService = inject(CopyService)
  private readonly getCopyPayload = signal<number | null>(this.state.id_edition);
  private readonly deleteCopyPayload = signal<number | null>(null);
  protected readonly computedCopyList = computed<CopyWithStatusModel[]>(() => this.getCopyRX.value() ?? [])

  private readonly editionImageService = inject(EditionImageService);
  private readonly uploadImagePayload = signal<File | null>(null);
  private readonly deleteImagePayload = signal<number | null>(null);

  protected readonly isEditMode = computed<boolean>(() => !!this.getEditionPayload())
  protected readonly title = computed<string>(() => 
    this.isEditMode() 
    ? `Modificar ejemplar de: ${ this.state.book_title }` 
    : `Crear ejemplar para: ${ this.state.book_title }`
  )
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getEditionRX,
      this.addEditionRX,
      this.uploadEditionImageRX,
      this.deleteEditionImageRX,
      this.getCopyRX,
      this.deleteCopyRX,
    ].some(r => r.isLoading())
  );
  protected readonly editionFormVMComputed = computed<EditionFormVM>(() => {
    const edition = this.getEditionRX.value();

    return {
      id_edition: edition?.id_edition ?? this.state.id_edition,
      edition: edition?.edition ?? '',
      isbn: edition?.isbn ?? '',
      publication_year: edition?.publication_year ?? 0,
      pages: edition?.pages ?? 0,
      cover_image: edition?.cover_image ?? null,
      book_id: edition?.book?.id_book ?? this.state.id_book,
      editorial_id: edition?.editorial?.id_editorial ?? 0,
      created_at: edition?.created_at ?? '',
      updated_at: edition?.updated_at ?? '',
      file: null,
      isNewImg: !edition?.cover_image,
      copies: edition?.copies ?? []
    };
  });
  
  private readonly getEditionRX = rxResource({
    params: () => this.getEditionPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition == 0) return of(null);

      return this.editionService.getById(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly addEditionRX = rxResource({
    params: () => this.addEditionPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      this.successMessage.set(null);

      const request$ = 'id_edition' in params && params.id_edition > 0
      ? this.editionService.update(params.id_edition, params)
      : this.editionService.create(params) 

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.result;
        }),
        tap(edition => {
          this.getEditionPayload.set(edition.id_edition); 
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly uploadEditionImageRX = rxResource({
    params: () => this.uploadImagePayload(),
    stream: ({ params: file }) => {
      if (!file) return of(null);
      this.successMessage.set(null);

      return this.editionImageService.create(file).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.result;
        }),
        tap(url => {
          const base = this.addBaseEditionPayload();
          if (!base) return;
  
          this.addEditionPayload.set({
            ...base,
            cover_image: url
          });
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly deleteEditionImageRX = rxResource({
    params: () => this.deleteImagePayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);
      this.successMessage.set(null);

      return this.editionImageService.delete(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.result;
        }),
        tap(() => {
          this.getEditionRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });
  
  private readonly getCopyRX = rxResource({
    params: () => this.getCopyPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);
      this.successMessage.set(null);

      return this.copyService.getAllByEditionId(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });  

  private readonly deleteCopyRX = rxResource({
    params: () => this.deleteCopyPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy) return of(null);
      this.successMessage.set(null);
      
      return this.copyService.delete(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.result;
        }),
        tap(() => {
          this.openDeleteModal.set(false);
          this.getCopyRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  protected formSubmit(form: EditionFormVM): void {
    const payload: CreateEditionModel | UpdateEditionModel =
    form.id_edition === 0
      ? (form as CreateEditionModel)
      : (form as UpdateEditionModel);

    this.addBaseEditionPayload.set(payload);

    if (form.file) {
      // subir imagen primero
      this.uploadImagePayload.set(form.file);
    } else {
      // guardar directamente
      this.addEditionPayload.set(payload);
    }
  }

  protected deleteImage(id_edition: number): void {
    this.deleteImagePayload.set(id_edition);
  }

  protected onCeateCopy(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.COPY.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: this.editionFormVMComputed()?.id_edition,
        id_copy: 0,
      }
    }); 
  }

  protected onEditEdition(item: CopyWithStatusModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.COPY.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: item.edition_id,
        id_copy: item.id_copy,
      }
    }); 
  }

  // onDelete --------------------------------------------------------
  protected readonly openDeleteModal = signal<boolean>(false);
  readonly selectedCopyToDelete = signal<CopyWithStatusModel | null>(null);
  
  protected onDeleteCopy(item: CopyWithStatusModel): void {
    if (!item) return;
    this.selectedCopyToDelete.set(item);
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    const selectedBookToDelete = this.selectedCopyToDelete();
    if (!selectedBookToDelete) return;
    this.deleteCopyPayload.set(selectedBookToDelete.id_copy);
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }
  // -----------------------------------------------------------------
  
  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM, this.state.id_book]);
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
