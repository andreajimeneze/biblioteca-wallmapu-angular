export interface CreateLoanPoliciesModel {
  name: string,
  max_books: number,
  max_days: number,
  fine_per_day: number,
  reservation_days: number  
}

export interface UpdateLoanPoliciesModel extends CreateLoanPoliciesModel {
  id_policy: number,
}

export interface LoanPoliciesModel extends UpdateLoanPoliciesModel {}
