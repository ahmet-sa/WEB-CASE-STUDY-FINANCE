export interface PaymentPlan {
    paymentDate: string;
    paymentAmount: number;
  }
  
 export interface Debt {
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    debtName: string;
    lenderName: string;
    debtAmount: number;
    interestRate: number;
    amount: number;
    paymentStart: string;
    installment: number;
    description: string;
    userId: string;
  }
  
  
export interface FormErrors {
    debtName: string;
    lenderName?: string; 
    debtAmount: string;
    interestRate: string;
    amount: string;
    paymentStart: string;
    installment: string;
    description?: string; 
    paymentPlan: { paymentDate: string; paymentAmount: string }[];
  }
  