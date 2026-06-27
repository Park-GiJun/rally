import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { Post, CreatePostBody } from '../types/post';
import { DEMO_MODE } from '../config';
import { listDemoPosts, createDemoPost, toggleDemoLike } from '../demo/demoSns';

/** 실 API 전환: DEMO_MODE=false 면 아래 /api 경로로 그대로 붙는다(백엔드 sns 계약). */
export async function listPostsApi(): Promise<Post[]> {
  if (DEMO_MODE) return listDemoPosts();
  const res = await api.get<ApiResponse<Post[]>>('/posts');
  return unwrap(res);
}

export async function createPostApi(body: CreatePostBody): Promise<Post> {
  if (DEMO_MODE) return createDemoPost(body);
  const res = await api.post<ApiResponse<Post>>('/posts', body);
  return unwrap(res);
}

export async function toggleLikeApi(id: number): Promise<Post> {
  if (DEMO_MODE) return toggleDemoLike(id);
  const res = await api.post<ApiResponse<Post>>(`/posts/${id}/like`, {});
  return unwrap(res);
}
