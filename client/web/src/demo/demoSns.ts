import type { Post, CreatePostBody } from '../types/post';
import { loadList, saveList, nextId, delay } from './demoStore';
import { appendDemoActivity } from './demoFeed';
import { useAuthStore } from '../store/authStore';
import { DEMO_USER } from './demoSession';

const KEY = 'sns';

/** n분 전 ISO 문자열. */
function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}

function seed(): Post[] {
  return [
    {
      id: 1,
      authorName: '지민',
      text: '오늘 아침 러닝 5km 완주! 날씨가 좋아서 그런지 컨디션 최고였고 정말 상쾌했습니다.',
      createdAt: minutesAgo(8),
      likes: 4,
      likedByMe: true,
    },
    {
      id: 2,
      authorName: '도현',
      text: '주말에 다 같이 등산 어때요? 코스는 가볍게 다녀올 수 있는 곳으로 생각 중입니다.',
      createdAt: minutesAgo(35),
      likes: 2,
      likedByMe: false,
    },
    {
      id: 3,
      authorName: '서윤',
      text: '이번 주 독서 모임 책 다 읽으신 분? 후반부 반전이 너무 좋았어요.',
      createdAt: minutesAgo(120),
      likes: 5,
      likedByMe: false,
    },
    {
      id: 4,
      authorName: '나',
      text: '드디어 사이드 프로젝트 첫 화면 완성. 작은 진전이지만 기분 좋네요.',
      createdAt: minutesAgo(260),
      likes: 1,
      likedByMe: false,
    },
  ];
}

export async function listDemoPosts(): Promise<Post[]> {
  return delay(loadList(KEY, seed));
}

export async function createDemoPost(body: CreatePostBody): Promise<Post> {
  const list = loadList(KEY, seed);
  const authorName =
    useAuthStore.getState().user?.nickname ?? DEMO_USER.nickname;
  const post: Post = {
    id: nextId(list),
    authorName,
    text: body.text,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedByMe: false,
  };
  saveList(KEY, [post, ...list]);
  // 게시하면 피드에 활동을 흘려보낸다.
  appendDemoActivity({ type: 'MESSAGE', payload: { text: body.text } });
  return delay(post);
}

export async function toggleDemoLike(id: number): Promise<Post> {
  const list = loadList(KEY, seed);
  const target = list.find((p) => p.id === id);
  if (!target) throw new Error('게시글을 찾을 수 없어요.');
  const likedByMe = !target.likedByMe;
  const updated: Post = {
    ...target,
    likedByMe,
    likes: Math.max(0, target.likes + (likedByMe ? 1 : -1)),
  };
  saveList(KEY, list.map((p) => (p.id === id ? updated : p)));
  return delay(updated);
}
