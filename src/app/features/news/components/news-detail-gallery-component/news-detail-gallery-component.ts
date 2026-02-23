import { NgOptimizedImage } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { NewsWithImagesModel } from '@core/models/news-model';
import { ModalImageComponent } from "@shared/components/modal-image-component/modal-image-component";

@Component({
  selector: 'app-news-detail-gallery-component',
  imports: [
    NgOptimizedImage,
    ModalImageComponent
],
  templateUrl: './news-detail-gallery-component.html',
})
export class NewsDetailGalleryComponent {
  readonly newsWithImages = input<NewsWithImagesModel | null>(null)

  readonly isImageModalOpen = signal(false);
  readonly selectedImage = signal("");
}
