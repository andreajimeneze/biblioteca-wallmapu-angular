import { Component, computed, inject, signal } from '@angular/core';
import { NewsFormComponent } from "@features/news/components/news-form-component/news-form-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NewsFormModel } from '@features/news/models/news-form-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { NewsService } from '@features/news/services/news-service';

@Component({
  selector: 'app-news-form-page',
  imports: [NewsFormComponent, SectionHeaderComponent],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  // ─── NAVEGACIÓN
  private readonly state = history.state as {
    newsWithImagesModel: NewsWithImagesModel ;
  };
  
  ROUTES_CONSTANTS=ROUTES_CONSTANTS

  // ─── ESTADOS
  readonly newsFormModel = signal<NewsFormModel>(
    {
      id_news: this.state.newsWithImagesModel?.id_news ?? '',
      title: this.state.newsWithImagesModel?.title ?? '',
      subtitle: this.state.newsWithImagesModel?.subtitle ?? '',
      body: this.state.newsWithImagesModel?.body ?? '',
    }
  );
  readonly isEditMode = computed(() => !!this.newsFormModel()?.id_news);
  readonly actionText = computed(() => this.isEditMode() ? 'Modificar Noticia' : 'Crear Noticia');

  // ─── SERVICIOS
  private readonly newsService = inject(NewsService);

  private readonly submitPayload = signal<{ 
    id: number; 
    newsFormModel: NewsFormModel; 
  } | null>(null);
  
  // ─── RX RESOURCE
  private readonly updateRX = rxResource({
    params: () => this.submitPayload(),
    stream: ({ params: payload }) => {
      if (!payload) return of(null);

      const request$ =
      payload.id > 0
        ? this.newsService.update(payload.id, payload.newsFormModel)
        : this.newsService.create(payload.newsFormModel);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        })
      );
    },
  });
 
  // ─── ACCIONES
  protected onFormSubmit(item: NewsFormModel) {
    this.submitPayload.set({
      id: item.id_news,
      newsFormModel: item,
    })
  }
}
