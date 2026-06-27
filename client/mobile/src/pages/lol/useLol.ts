import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProfileApi,
  listMatchesApi,
  getGroupRankingApi,
  linkSummonerApi,
  syncMatchesApi,
} from '../../api/lol';

export const LOL_PROFILE_KEY = ['lol', 'profile'] as const;
export const LOL_MATCHES_KEY = ['lol', 'matches'] as const;
export const LOL_RANKING_KEY = ['lol', 'group-ranking'] as const;

export function useLol() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [tagLine, setTagLine] = useState('');

  const profileQuery = useQuery({ queryKey: LOL_PROFILE_KEY, queryFn: getProfileApi });
  const matchesQuery = useQuery({ queryKey: LOL_MATCHES_KEY, queryFn: listMatchesApi });
  const rankingQuery = useQuery({ queryKey: LOL_RANKING_KEY, queryFn: getGroupRankingApi });

  /** 변경 후 LoL 쿼리 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: LOL_PROFILE_KEY });
    qc.invalidateQueries({ queryKey: LOL_MATCHES_KEY });
    qc.invalidateQueries({ queryKey: LOL_RANKING_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const link = useMutation({
    mutationFn: linkSummonerApi,
    onSuccess: () => {
      setName('');
      setTagLine('');
      invalidate();
    },
  });

  const sync = useMutation({ mutationFn: syncMatchesApi, onSuccess: invalidate });

  const submitLink = () => {
    const trimmedName = name.trim();
    const trimmedTag = tagLine.trim();
    if (!trimmedName || !trimmedTag) return;
    link.mutate({ name: trimmedName, tagLine: trimmedTag });
  };

  return {
    profile: profileQuery.data,
    matches: matchesQuery.data,
    ranking: rankingQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    name,
    setName,
    tagLine,
    setTagLine,
    submitLink,
    isLinking: link.isPending,
    sync: () => sync.mutate(),
    isSyncing: sync.isPending,
  };
}
