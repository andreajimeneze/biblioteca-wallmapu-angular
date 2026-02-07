export interface ApiResponseModel<T> {
  isSuccess: boolean
  statusCode: number
  message: string
  result: T
}