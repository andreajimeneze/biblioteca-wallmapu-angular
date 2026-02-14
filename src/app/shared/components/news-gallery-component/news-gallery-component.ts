import { NgOptimizedImage } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { NewsGalleryModel } from '@core/models/news-gallery-model';
import { ModalImageComponent } from "../modal-image-component/modal-image-component";

@Component({
  selector: 'app-news-gallery-component',
  imports: [
    NgOptimizedImage,
    ModalImageComponent
],
  templateUrl: './news-gallery-component.html',
})
export class NewsGalleryComponent {
  readonly newsGalleryList = input<NewsGalleryModel[]>([]);

  readonly isImageModalOpen = signal(false);
  readonly selectedImage = signal("");
}
