export interface CalendarEvent {
  id: number;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time?: string;
  note?: string;
}

export interface CreateEventBody {
  title: string;
  date: string;
  time?: string;
  note?: string;
}
