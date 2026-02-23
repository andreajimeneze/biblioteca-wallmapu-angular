import { Component, input, output } from '@angular/core';
import { ImagePreviewVM } from '@features/news-gallery/models/image-preview.vm';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-image-list-component',
  imports: [
    LoadingComponent
],
  templateUrl: './image-list-component.html',
})
export class ImageListComponent {
  readonly isLoading = input<boolean>(false);
  readonly imagesPreviewVMList = input.required<ImagePreviewVM[]>();
  readonly updateImagesPreviewVMList = output<ImagePreviewVM[]>();
  readonly deleteImagesPreviewVM = output<ImagePreviewVM>();

  protected updateImageAlt(item: ImagePreviewVM, alt: string) {
    const updated = this.imagesPreviewVMList().map(e =>
      e === item
      ? { ...e, alt: alt.trim() || 'Imagen sin Nombre' }
      : e
    )

    this.updateImagesPreviewVMList.emit(updated);
  }

  protected onDeleteImagesPreviewVM(item: ImagePreviewVM) {
    this.deleteImagesPreviewVM.emit(item)
  }
}
