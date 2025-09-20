export interface AdminDashboardResponse {
  teachers: {
    teacher_count: number;
    latest: Teacher[];
  };
  students: {
    student_count: number;
    latest: Student[];
  };
  sessions: {
    total_sessions: number;
    breakdown: SessionBreakdown[];
  };
  income: {
    last_6_months: IncomeRecord[];
  };
  user_count: number;
  financials: Financials;
}

export interface Teacher {
  id: string;
  full_name: string;
  username: string;
  location: string | null;
  net_income: number;
  coach_type: string[]; // array of coach type names/IDs
}

export interface Student {
  id: string;
  full_name: string;
  username: string;
  favorite_sports: string[];
  account_type: string;
  total_session: number;
  total_spent: number;
}

export interface SessionBreakdown {
  session_name: string;
  total_sessions: number;
  increase_rate: number;
}

export interface IncomeRecord {
  month: string;
  total_income: number;
  change_rate: number;
}

export interface Financials {
  month: string;
  income: FinancialStat;
  expense: FinancialStat;
  profit: FinancialStat;
}

export interface FinancialStat {
  total: number;
  rate: number;
}
