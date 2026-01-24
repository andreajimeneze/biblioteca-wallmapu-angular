import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NewsService } from '@core/services/news-service';
import { News } from '@shared/models/news';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-news-list-component',
  imports: [
    NgOptimizedImage,
    RouterLink
],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent implements OnInit {
  private newsService = inject(NewsService);
  
  news = signal<News[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    
    this.newsService.getAll().subscribe({
      next: (news) => {
        this.news.set(news);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando libros:', err);
        this.loading.set(false);
      }
    });
  }  
}
