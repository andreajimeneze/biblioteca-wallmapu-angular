export interface LoanModel {
  id_loan: number;
  loan_date: string;
  due_date: string;
  return_date: string;
  copy_id: number;
  user_id: string;
  loan_status_id: number;
  loan_status_name: string;
  user_name: string;
  user_lastname: string;
  book_id: number;
  book_title: string;
  copy_barcode: string;
}
