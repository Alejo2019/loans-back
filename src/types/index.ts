export interface User {
    id?: number;
    name: string;
    email: string;
    idCard: string;
    loanAmount: number;
    paymentDate?: string;
    loanStatus: 'approved' | 'rejected';
    hasPaid: boolean;
  }
  
  export interface Loan {
    id?: number;
    userId: string;
    amount: number;
    status: 'approved' | 'rejected';
    hasPaid: boolean;
    paymentDate?: string;
  }
  
  export interface Bank {
    capital: number;
  }