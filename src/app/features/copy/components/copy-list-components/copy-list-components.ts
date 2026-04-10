import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CopyWithStatusModel } from '@features/copy/models/copy-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-copy-list-components',
  imports: [
    DatePipe,
    LoadingComponent,
  ],
  templateUrl: './copy-list-components.html',
})
export class CopyListComponents {
  readonly copyList = input.required<CopyWithStatusModel[]>();
  readonly isLoading = input.required<boolean>();
  readonly onEdit = output<CopyWithStatusModel>();
  readonly onDelete = output<CopyWithStatusModel>();

  protected edit(item: CopyWithStatusModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: CopyWithStatusModel): void {
    this.onDelete.emit(item);
  }
}
