export interface CreateLoanPoliciesModel {
  name: string,
  max_books: number,
  max_days: number,
  reservation_days: number  
}

export interface LoanPoliciesModel extends CreateLoanPoliciesModel {
  id_policy: number,
}
