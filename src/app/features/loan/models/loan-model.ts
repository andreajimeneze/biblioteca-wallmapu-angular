export interface UpdateLoanModel {
  copy_id: number;
}


export interface CreateLoanModel extends UpdateLoanModel {
  user_id: string;
}


export interface LoanModel extends CreateLoanModel {
  id_loan: number;
  loan_date: string;
  due_date: string;
  return_date: string;
  loan_status_id: number;
  loan_status_name: string;
  user_name: string;
  copy_barcode: string;
  copy_signature: string;
  book_id: number;
  book_title: string;
}


export interface LoanFilterModel {
  id_status: number
}