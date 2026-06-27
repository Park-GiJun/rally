import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordActivityApi } from '../../api/activities';
import { toast } from '../../store/toastStore';
import { FEED_QUERY_KEY } from './useFeed';

/** CHECKIN 작성 로직: 입력 상태 + 기록 뮤테이션 + 성공 시 피드 무효화. */
export function useCheckinComposer() {
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (text: string) =>
      recordActivityApi({ type: 'CHECKIN', payload: { note: text } }),
    onSuccess: () => {
      setNote('');
      toast.success('인증을 기록했어요!');
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY });
    },
  });

  function submit() {
    const text = note.trim();
    if (!text || mutation.isPending) return;
    mutation.mutate(text);
  }

  return {
    note,
    setNote,
    submit,
    submitting: mutation.isPending,
  };
}
