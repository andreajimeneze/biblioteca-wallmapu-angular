import { Component, input, output } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';

@Component({
  selector: 'app-author-list-components',
  imports: [],
  templateUrl: './author-list-components.html',
})
export class AuthorListComponents {
  readonly authorList = input<AuthorModel[]>();
  readonly onDelete = output<AuthorModel>();

  protected delete(item: AuthorModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
  
    this.onDelete.emit(item);
  }
}
