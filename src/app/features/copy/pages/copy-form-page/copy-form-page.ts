import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { CopyFormComponents } from "@features/copy/components/copy-form-components/copy-form-components";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { CopyFormVM } from '@features/copy/models/copy-model.vm';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { CopyService } from '@features/copy/services/copy-service';
import { CreateCopyModel, UpdateCopyModel } from '@features/copy/models/copy-model';

@Component({
  selector: 'app-copy-form-page',
  imports: [
    SectionHeaderComponent, 
    CopyFormComponents, 
    MessageSuccessComponent, 
    MessageErrorComponent
  ],
  templateUrl: './copy-form-page.html',
})
export class CopyFormPage {
  private readonly router = inject(Router);

  readonly state = history.state as {
    book_title: string,
    id_book: number,
    id_edition: number,
    id_copy: number,
  }

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly copyService = inject(CopyService);
  private readonly getCopyPayload = signal<number | null>(this.state.id_copy);
  private readonly saveCopyPayload = signal<CreateCopyModel | UpdateCopyModel | null>(null);
  protected readonly computedCopyFormVM = computed<CopyFormVM>(() => {
    const item = this.getCopyRX.value();

    return {
      id_copy: item?.id_copy ?? this.state.id_copy,
      edition_id: item?.edition_id ?? this.state.id_edition,
      signature_topography: item?.signature_topography ?? '',
      copy_number: item?.copy_number ?? 0,
      barcode: item?.barcode ?? '',
      created_at: item?.created_at ?? '',
      updated_at: item?.updated_at ?? '',
      status_id: item?.status?.id_status ?? 0,
    }
  });
  protected readonly book_edition_name = computed<string>(() => 
    this.computedCopyFormVM().id_copy > 0
    ? `Modificar copia de: ${ this.state.book_title }` 
    : `Crear copia para: ${ this.state.book_title }`
  )
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getCopyRX,
      this.saveCopyRX,
    ].some(r => r.isLoading())
  );

  private readonly getCopyRX = rxResource({
    params: () => this.getCopyPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy || id_copy == 0) return of(null);
      this.successMessage.set(null);
      this.errorMessage.set(null);

      return this.copyService.getById(id_copy).pipe(
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

  private readonly saveCopyRX = rxResource({
    params: () => this.saveCopyPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_copy' in params && params.id_copy > 0
        ? this.copyService.update(params.id_copy, params)
        : this.copyService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.result;
        }),
        tap(copy => {
          this.getCopyPayload.set(copy.id_copy);
          this.getCopyRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  protected formSubmit(form: CopyFormVM): void {
    const payload: CreateCopyModel | UpdateCopyModel = form.id_copy > 0
    ? {
        id_copy: form.id_copy,
        signature_topography: form.signature_topography,
        edition_id: form.edition_id,
        copy_number: form.copy_number,
        status_id: form.status_id,
      }
    : {
        signature_topography: form.signature_topography,
        edition_id: form.edition_id,
        copy_number: form.copy_number,
      };

    this.saveCopyPayload.set(payload);
  }

  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: this.state.id_edition,
      }
    }); 
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
