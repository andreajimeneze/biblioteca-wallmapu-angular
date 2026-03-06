import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { BookFormComponent } from '@features/book/components/book-form-component/book-form-component';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-book-form-page',
  imports: [
    SectionHeaderComponent,
    BookFormComponent,
],
  templateUrl: './book-form-page.html',
})
export class BookFormPage {
  private readonly state = history.state as { bookModel: BookDetailModel };
  private readonly router = inject(Router);

  readonly bookModel = signal<BookDetailModel>(this.state.bookModel);
  readonly isEditMode = computed<boolean>(() => !!this.bookModel());
  readonly headerText = computed<string>(() => this.isEditMode() ? "Modificar lLibro" : "Crear lLibro");

  protected navigateGoBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.ROOT]);
  }
}
