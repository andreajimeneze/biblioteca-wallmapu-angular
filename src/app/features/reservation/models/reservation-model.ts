export interface CreateReservationModel {
  copy_id: number;
}

export interface ReservationPickupModel extends CreateReservationModel {
  id_reservation: number;
}

export interface ReservationModel extends CreateReservationModel {
  reservation_date: string;
  expiration_date: string;
  user_id: string;
  reservation_status_id: number;
}

export interface ReservationDetailModel {
  id_reservation: number;
  reservation_date: string;
  expiration_date: string;
  user_id: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  copy_id: number;
  copy_barcode: string;
  copy_signature: string;
  book_id: number;
  book_title: string;
  reservation_status_id: number;
  reservation_status_name: string;
}

export interface ReservationFilterModel {
  id_status: number;
}
