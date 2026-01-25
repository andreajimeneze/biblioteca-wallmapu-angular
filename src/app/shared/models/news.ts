import { NewsImage } from "./news-image";

export interface News {
  id: number,
  title: string,
  subtitle: string,
  body: string,
  date: string,
  images: NewsImage[],
}
