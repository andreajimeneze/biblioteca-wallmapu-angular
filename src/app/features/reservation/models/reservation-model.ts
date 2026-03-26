export interface CreateReservationModel {
  book_id: number,
}
export interface ReservationModel {
  id_reservation: number,
  reservation_date: string,
  expiration_date: string,
  user_id: string,
  user_name: string,
  user_lastname: string,
  user_email: string,
  book_id: number,
  book_title: string,
  reservation_status_id: number,
  reservation_status_name: string
}
