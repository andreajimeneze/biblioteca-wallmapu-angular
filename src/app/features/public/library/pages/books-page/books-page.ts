import { Component } from '@angular/core';
import { HeaderComponent } from '@shared/components/header-component/header-component';
import { BookListComponent } from "../../components/book-list-component/book-list-component";

@Component({
  selector: 'app-books-page',
  imports: [
    HeaderComponent,
    BookListComponent
],
  templateUrl: './books-page.html',
})
export class BooksPage {

}
