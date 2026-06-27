import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listTodosApi,
  createTodoApi,
  toggleTodoApi,
  removeTodoApi,
} from '../../api/todo';

export const TODO_QUERY_KEY = ['todos'] as const;

export function useTodo() {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');

  const query = useQuery({ queryKey: TODO_QUERY_KEY, queryFn: listTodosApi });

  /** 변경 후 목록 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: TODO_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const create = useMutation({
    mutationFn: createTodoApi,
    onSuccess: () => {
      setTitle('');
      invalidate();
    },
  });

  const toggle = useMutation({ mutationFn: toggleTodoApi, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: removeTodoApi, onSuccess: invalidate });

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    create.mutate({ title: trimmed });
  };

  return {
    todos: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    title,
    setTitle,
    submit,
    isSubmitting: create.isPending,
    toggle: (id: number) => toggle.mutate(id),
    remove: (id: number) => remove.mutate(id),
  };
}
