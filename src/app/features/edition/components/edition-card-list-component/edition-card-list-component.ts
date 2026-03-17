import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-edition-card-list-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './edition-card-list-component.html',
})
export class EditionCardListComponent {
  private readonly router = inject(Router);
  
  readonly isLoading = input<boolean>(false);
  readonly editionDetailList = input<EditionDetailModel[]>([]);


  protected navigateToEditionDitail(item: EditionDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.HOME.BOOK, item.id_edition]);
  }
}
