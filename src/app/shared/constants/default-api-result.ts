import { ApiResponseModel } from "@core/models/api-response-model";
import { NewsWithImagesModel } from "@core/models/news-model";
import { PaginationModel } from "@core/models/pagination-model";

export const API_RESPONSE_PAGINATION_NEWS_LIST: ApiResponseModel<PaginationModel<NewsWithImagesModel[]>> = {
  isSuccess: true,
  statusCode: 0,
  message: "",
  result: {
    count: 0,
    pages: 0,
    next: '',
    prev: '',
    result: [] 
  }
}

export const API_RESPONSE_NEWS: ApiResponseModel<NewsWithImagesModel> = {
  isSuccess: true,
  statusCode: 0,
  message: "",
  result: {
    id_news: 0,
    title: '',
    subtitle: '',
    body: '',
    created_at: '',
    updated_at: '',
    images: []
  }
}

