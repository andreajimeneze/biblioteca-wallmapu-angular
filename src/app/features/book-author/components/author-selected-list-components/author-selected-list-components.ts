import { Component, input, output } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';

@Component({
  selector: 'app-author-selected-list-components',
  imports: [],
  templateUrl: './author-selected-list-components.html',
})
export class AuthorSelectedListComponents {
  readonly authorList = input<AuthorModel[]>();
  readonly onDelete = output<AuthorModel>();

  protected delete(item: AuthorModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
  
    this.onDelete.emit(item);
  }
}
