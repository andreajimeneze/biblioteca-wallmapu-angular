import { Component, computed, signal } from '@angular/core';
import { NewsFormComponent } from "@features/news/components/news-form-component/news-form-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';

@Component({
  selector: 'app-news-form-page',
  imports: [NewsFormComponent, SectionHeaderComponent],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  // ─── NAVEGACIÓN ───────────────────────────────────────────────────────────────
  private readonly state = history.state as {
    newsWithImagesModel: NewsWithImagesModel ;
  };
  
  ROUTES_CONSTANTS=ROUTES_CONSTANTS

  // ESTADOS
  readonly newsWithImages = signal<NewsWithImagesModel>(this.state.newsWithImagesModel);
  readonly isEditMode = computed(() => !!this.newsWithImages()?.id_news);
  readonly actionText = computed(() => this.isEditMode() ? 'Modificar Noticia' : 'Crear Noticia');
}
