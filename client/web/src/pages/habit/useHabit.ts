import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listHabitsApi,
  createHabitApi,
  checkInHabitApi,
  removeHabitApi,
} from '../../api/habit';

export const HABIT_QUERY_KEY = ['habits'] as const;

export function useHabit() {
  const qc = useQueryClient();
  const [name, setName] = useState('');

  const query = useQuery({ queryKey: HABIT_QUERY_KEY, queryFn: listHabitsApi });

  /** 변경 후 목록 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: HABIT_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const create = useMutation({
    mutationFn: createHabitApi,
    onSuccess: () => {
      setName('');
      invalidate();
    },
  });

  const checkIn = useMutation({ mutationFn: checkInHabitApi, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: removeHabitApi, onSuccess: invalidate });

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    create.mutate({ name: trimmed });
  };

  return {
    habits: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    name,
    setName,
    submit,
    isSubmitting: create.isPending,
    checkIn: (id: number) => checkIn.mutate(id),
    remove: (id: number) => remove.mutate(id),
  };
}
