export type LedgerKind = 'income' | 'expense';

export interface LedgerEntry {
  id: number;
  kind: LedgerKind;
  amount: number; // 항상 양수. 부호는 kind 로 표현한다.
  category: string;
  memo?: string;
  date: string; // YYYY-MM-DD
}

export interface CreateLedgerBody {
  kind: LedgerKind;
  amount: number;
  category: string;
  memo?: string;
  date: string;
}
