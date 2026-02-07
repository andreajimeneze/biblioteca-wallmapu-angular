import { NewsGalleryModel } from "@core/models/news-gallery-model";

export interface NewsModel {
  id_news: number,
  title: string,
  subtitle: string,
  body: string,
  date: string,
  images: NewsGalleryModel[]
}
