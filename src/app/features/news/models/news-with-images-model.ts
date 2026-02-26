import { NewsGalleryModel } from "@features/news-gallery/models/news-gallery-model";

export interface NewsWithImagesModel {
  id_news: number,
  title: string,
  subtitle: string,
  body: string,
  created_at: string,
  updated_at: string,
  images: NewsGalleryModel[]
}
