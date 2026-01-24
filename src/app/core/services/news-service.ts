import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { News } from '@shared/models/news';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiService = inject(ApiResponseService<News>);

  getLast3(): Observable<News[]> {
    return of(this.news.slice(0, 3));
  }

  getAll(): Observable<News[]> {
    return of(this.news);
  }

  getById(id: number): Observable<News> {
    const book = this.news.find(b => b.id === id);
    return of(book!);
  }
  
  news: News[] = [
    {
      id: 1,
      title: 'Título Noticia 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/news-01.jpg',
      date: '2026-01-01'
    },
    {
      id: 2,
      title: 'Título Noticia 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/news-02.jpg',
      date: '2026-02-01'
    },
    {
      id: 3,
      title: 'Título Noticia 3',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/news-03.jpg',
      date: '2026-03-01'
    },
    {
      id: 4,
      title: 'Título Noticia 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/news-01.jpg',
      date: '2026-01-01'
    },
    {
      id: 5,
      title: 'Título Noticia 5',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/news-02.jpg',
      date: '2026-02-01'
    },
    {
      id: 6,
      title: 'Título Noticia 6',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/news-03.jpg',
      date: '2026-03-01'
    }    
  ];
}
