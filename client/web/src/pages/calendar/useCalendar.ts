import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listEventsApi,
  createEventApi,
  removeEventApi,
} from '../../api/calendar';
import type { CalendarEvent } from '../../types/calendar';

export const CALENDAR_QUERY_KEY = ['schedules'] as const;

/** 오늘 날짜(YYYY-MM-DD, 로컬 기준). */
function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 같은 날짜의 일정들을 묶은 아젠다 그룹. */
export interface AgendaGroup {
  date: string;
  events: CalendarEvent[];
}

export function useCalendar() {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const query = useQuery({ queryKey: CALENDAR_QUERY_KEY, queryFn: listEventsApi });

  /** 변경 후 목록 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: CALENDAR_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const create = useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      setTitle('');
      setTime('');
      setNote('');
      setDate(today());
      invalidate();
    },
  });

  const remove = useMutation({ mutationFn: removeEventApi, onSuccess: invalidate });

  const submit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !date) return;
    create.mutate({
      title: trimmedTitle,
      date,
      time: time || undefined,
      note: note.trim() || undefined,
    });
  };

  /** 날짜+시간 순으로 정렬하고 날짜별로 묶은 아젠다. */
  const agenda = useMemo<AgendaGroup[]>(() => {
    const events = query.data ?? [];
    const sorted = [...events].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time ?? '').localeCompare(b.time ?? '');
    });
    const groups: AgendaGroup[] = [];
    for (const event of sorted) {
      const last = groups[groups.length - 1];
      if (last && last.date === event.date) {
        last.events.push(event);
      } else {
        groups.push({ date: event.date, events: [event] });
      }
    }
    return groups;
  }, [query.data]);

  return {
    agenda,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: (query.data?.length ?? 0) === 0,
    title,
    setTitle,
    date,
    setDate,
    time,
    setTime,
    note,
    setNote,
    submit,
    isSubmitting: create.isPending,
    remove: (id: number) => remove.mutate(id),
  };
}
