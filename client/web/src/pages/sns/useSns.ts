import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listPostsApi, createPostApi, toggleLikeApi } from '../../api/sns';
import { formatRelativeTime } from '../../lib/format';

export const SNS_QUERY_KEY = ['posts'] as const;

export function useSns() {
  const qc = useQueryClient();
  const [text, setText] = useState('');

  const query = useQuery({ queryKey: SNS_QUERY_KEY, queryFn: listPostsApi });

  /** 변경 후 목록 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: SNS_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const create = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      setText('');
      invalidate();
    },
  });

  const like = useMutation({ mutationFn: toggleLikeApi, onSuccess: invalidate });

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    create.mutate({ text: trimmed });
  };

  return {
    posts: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    text,
    setText,
    submit,
    isSubmitting: create.isPending,
    toggleLike: (id: number) => like.mutate(id),
    formatTime: formatRelativeTime,
  };
}
