import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeedApi } from '../../api/activities';
import { getGroupsApi } from '../../api/groups';
import {
  DASHBOARD_SECTION,
  FEED_FILTERS,
  SECTIONS,
} from '../../lib/sections';

/** '전체' 그룹은 undefined, 개인은 null, 그 외 number. */
type GroupFilter = number | null | undefined;

export function useDashboard() {
  const [groupId, setGroupId] = useState<GroupFilter>(undefined);
  const [sectionKey, setSectionKey] = useState<string>(DASHBOARD_SECTION.key);

  const section =
    FEED_FILTERS.find((s) => s.key === sectionKey) ?? DASHBOARD_SECTION;
  const types = section.activityTypes;

  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: getGroupsApi,
    staleTime: 5 * 60_000,
  });

  const feedQuery = useQuery({
    queryKey: ['feed', groupId ?? 'all', sectionKey],
    queryFn: () => getFeedApi({ groupId, types, limit: 50 }),
  });

  // 도메인별 활동 수(현재 그룹 스코프) — 요약 카드용. 전체 타입으로 한 번 더 조회.
  const scopeQuery = useQuery({
    queryKey: ['feed', groupId ?? 'all', 'scope-all'],
    queryFn: () => getFeedApi({ groupId, limit: 200 }),
  });

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of SECTIONS) map[s.key] = 0;
    for (const a of scopeQuery.data ?? []) {
      for (const s of SECTIONS) {
        if (s.activityTypes.includes(a.type)) map[s.key] += 1;
      }
    }
    return map;
  }, [scopeQuery.data]);

  return {
    groups: groupsQuery.data ?? [],
    groupId,
    setGroupId,
    sectionKey,
    setSectionKey,
    counts,
    activities: feedQuery.data,
    isLoading: feedQuery.isLoading,
    isError: feedQuery.isError,
  };
}
