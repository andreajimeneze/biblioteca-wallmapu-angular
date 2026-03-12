import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EditionCopyModel } from '@features/edition-copy/models/edition-copy-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-edition-copy-list-components',
  imports: 
  [
    DatePipe,
    NgOptimizedImage,
    LoadingComponent
  ],
  templateUrl: './edition-copy-list-components.html',
})
export class EditionCopyListComponents {
  readonly editionCopyModel = input.required<EditionCopyModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly onEdit = output<EditionCopyModel>();
  readonly onDelete = output<EditionCopyModel>();

  protected edit(item: EditionCopyModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: EditionCopyModel): void {
    this.onDelete.emit(item);
  }
}
