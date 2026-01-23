import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { News } from '@shared/models/news';

@Component({
  selector: 'app-latest-news-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './latest-news-component.html',
})
export class LatestNewsComponent {
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
    }
  ];
}
