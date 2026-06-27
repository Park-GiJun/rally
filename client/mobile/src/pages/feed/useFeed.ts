import { useQuery } from '@tanstack/react-query';
import { getFeedApi } from '../../api/activities';

export const FEED_QUERY_KEY = ['feed'] as const;

/** 내 개인 피드(P0). groupId 없이 조회. */
export function useFeed() {
  return useQuery({
    queryKey: FEED_QUERY_KEY,
    queryFn: () => getFeedApi({ limit: 50 }),
  });
}
