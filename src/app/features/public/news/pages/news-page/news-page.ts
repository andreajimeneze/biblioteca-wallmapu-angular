import { Component } from '@angular/core';
import { HeaderComponent } from '@shared/components/header-component/header-component';
import { NewsListComponent } from "../../components/news-list-component/news-list-component";

@Component({
  selector: 'app-news-page',
  imports: [
    HeaderComponent,
    NewsListComponent,
],
  templateUrl: './news-page.html',
})
export class NewsPage {

}
