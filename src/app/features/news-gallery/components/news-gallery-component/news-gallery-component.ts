import { NgOptimizedImage } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { NewsGalleryModel } from '@features/news-gallery/models/news-gallery-model';
import { ModalImageComponent } from "@shared/components/modal-image-component/modal-image-component";

@Component({
  selector: 'app-news-gallery-component',
  imports: [
    NgOptimizedImage,
    ModalImageComponent,
  ],
  templateUrl: './news-gallery-component.html',
})
export class NewsGalleryComponent {
  readonly newsGalleryList = input<NewsGalleryModel[]>([]);

  readonly isImageModalOpen = signal(false);
  readonly selectedImage = signal("");
}
