export interface Habit {
  id: number;
  name: string;
  streak: number;
  checkedToday: boolean;
  /** YYYY-MM-DD */
  lastCheckedDate: string | null;
}

export interface CreateHabitBody {
  name: string;
}
