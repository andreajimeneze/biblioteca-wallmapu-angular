import { Component, input, output } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';

@Component({
  selector: 'app-author-list-components',
  imports: [],
  templateUrl: './author-list-components.html',
})
export class AuthorListComponents {
  readonly authorList = input<AuthorModel[]>();
  readonly delete = output<AuthorModel>();

  protected onDelete(item: AuthorModel): void {
    this.delete.emit(item);
  }
}
