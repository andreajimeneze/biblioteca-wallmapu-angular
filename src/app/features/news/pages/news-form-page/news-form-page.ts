import { Component, computed, inject, signal } from '@angular/core';
import { NewsFormComponent } from "@features/news/components/news-form-component/news-form-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NewsFormModel } from '@features/news/models/news-form-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, NEVER, of, tap } from 'rxjs';
import { NewsService } from '@features/news/services/news-service';
import { Router } from '@angular/router';
import { ImageListComponent } from "@features/news-gallery/components/image-list-component/image-list-component";
import { NewsGalleryModel } from '@core/models/news-gallery-model';
import { ImagePreviewVM } from '@features/news-gallery/models/image-preview.vm';
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { CreateNewsGalleryModel } from '@features/news-gallery/models/create-news-gallery-model';

@Component({
  selector: 'app-news-form-page',
  imports: [NewsFormComponent, SectionHeaderComponent, ImageListComponent, MessageErrorComponent],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  // ─── NAVEGACIÓN
  private readonly state = history.state as {
    newsWithImagesModel: NewsWithImagesModel ;
  };
  
  private readonly router = inject(Router);

  // ─── ESTADOS
  readonly newsFormModel = signal<NewsFormModel>(
    {
      id_news: this.state.newsWithImagesModel?.id_news ?? '',
      title: this.state.newsWithImagesModel?.title ?? '',
      subtitle: this.state.newsWithImagesModel?.subtitle ?? '',
      body: this.state.newsWithImagesModel?.body ?? '',
    }
  );
  readonly imagesPreviewVMList = signal<ImagePreviewVM[]>(
    this.state.newsWithImagesModel?.images?.map(e => ({
      id: e.id_news_gallery,
      alt: e.alt,
      preview: e.url,
      isNew: false,
    })) ?? []
  );
  readonly newsGalleryModelList = signal<NewsGalleryModel[]>(this.state.newsWithImagesModel?.images ?? [])
  readonly isEditMode = computed(() => !!this.newsFormModel()?.id_news);
  readonly actionText = computed(() => this.isEditMode() ? 'Modificar Noticia' : 'Crear Noticia');
  readonly isLoading = computed(() => this.newsRX.isLoading() || this.createGalleryRX.isLoading() || this.deleteGalleryRX.isLoading());
  readonly errorMessage = computed(() => {
    if (this.localErrorMessage()) return this.localErrorMessage();

    if (this.newsRX.error()?.message) return this.newsRX.error()!.message;
    if (this.createGalleryRX.error()?.message) return this.createGalleryRX.error()!.message;
    if (this.deleteGalleryRX.error()?.message) return this.deleteGalleryRX.error()!.message;
    return null;
  });
  readonly localErrorMessage = signal<string | null>(null);

  // ─── SERVICIOS
  private readonly newsService = inject(NewsService);
  private readonly newsGaleryService = inject(NewsGalleryService)

  private readonly submitPayload = signal<{ 
    id_news: number; 
    newsFormModel: NewsFormModel; 
  } | null>(null);
  
  // ─── RX RESOURCE
  // CREATE NEWS
  private readonly newsRX = rxResource({
    params: () => this.submitPayload(),
    stream: ({ params: payload }) => {
      if (!payload) return of(null);

      const request$ =
      payload.id_news > 0
        ? this.newsService.update(payload.id_news, payload.newsFormModel)
        : this.newsService.create(payload.newsFormModel);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap((result) => {
          const onlyNewImages = this.imagesPreviewVMList().filter(filter => filter.isNew);
          const files = onlyNewImages.map(img => img.file!);
          const alts = onlyNewImages.map(img => img.alt?.trim() || 'Imagen sin nombre');
      
          if (onlyNewImages.length === 0) {
            this.routeGoBack();
            return;
          }

          this.createGalleryPayload.set({
            id_news: result.id_news,
            createNewsGalleryModel: {
              files,
              alts,
            },
          });
        })
      );
    },
  });
  
  // CREATE GALLERY IMAGES
  private readonly createGalleryPayload = signal<{
    id_news: number | null;
    createNewsGalleryModel: CreateNewsGalleryModel;
  } | null>(null);
  
  private readonly createGalleryRX = rxResource({
    params: () => this.createGalleryPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      if (!params.id_news) return of(null);

      return this.newsGaleryService.create(
        params.id_news,
        params.createNewsGalleryModel.files,
        params.createNewsGalleryModel.alts
      ).pipe(
        map(r => {
          if (!r.isSuccess) throw new Error(r.message);
          return r.result;
        }),
        tap(() => {
          this.routeGoBack();
        })
      );
    }
  });

  // DELETE GALERY IMAGE
  private readonly deleteGalleryPayload = signal<number | null>(null);

  private readonly deleteGalleryRX = rxResource({
    params: () => this.deleteGalleryPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsGaleryService.delete(params).pipe(
        map(r => {
          if (!r.isSuccess) throw new Error(r.message);
          return r.result;
        }),
        tap(() => {
          this.imagesPreviewVMList.update(list =>
            list.filter(i => i.id !== params)
          );
        })
      );
    }
  });

  // ─── ACCIONES
  protected onFormSubmit(item: NewsFormModel) {
    this.submitPayload.set({
      id_news: item.id_news,
      newsFormModel: item,
    })
  }

  protected onChangeImagesPreviewVMList(images: ImagePreviewVM[]) {
    this.imagesPreviewVMList.update(list => {
      const combined = [...list, ...images];
  
      if (combined.length > 3) {
        // Opción: mostrar alerta / mensaje de error
        this.localErrorMessage.set('Solo se pueden agregar 3 Imagnes');
        return list; // no agregamos nada
      }
  
      return combined;
    });

    //this.imagesPreviewVMList.update(list => [
    //  ...list,
    //  ...images
    //])
  }

  protected onUpdateImagesPreviewVMList(images: ImagePreviewVM[]) {
    this.imagesPreviewVMList.set(images);
  }

  protected onDeleteImagesPreviewVM(image: ImagePreviewVM) {
    if (image.isNew) {
      this.imagesPreviewVMList.update(list => list.filter(i => i !== image));
      return;
    }

    if (!image.id) return;
    this.deleteGalleryPayload.set(image.id);
  }

  protected routeGoBack() {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.ROOT]);
  }
}
