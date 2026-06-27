import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { Todo, CreateTodoBody } from '../types/todo';
import { DEMO_MODE } from '../config';
import {
  listDemoTodos,
  createDemoTodo,
  toggleDemoTodo,
  removeDemoTodo,
} from '../demo/demoTodo';

/** 실 API 전환: DEMO_MODE=false 면 아래 /api 경로로 그대로 붙는다(백엔드 todo-service 계약). */
export async function listTodosApi(): Promise<Todo[]> {
  if (DEMO_MODE) return listDemoTodos();
  const res = await api.get<ApiResponse<Todo[]>>('/todos');
  return unwrap(res);
}

export async function createTodoApi(body: CreateTodoBody): Promise<Todo> {
  if (DEMO_MODE) return createDemoTodo(body);
  const res = await api.post<ApiResponse<Todo>>('/todos', body);
  return unwrap(res);
}

export async function toggleTodoApi(id: number): Promise<Todo> {
  if (DEMO_MODE) return toggleDemoTodo(id);
  const res = await api.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`, {});
  return unwrap(res);
}

export async function removeTodoApi(id: number): Promise<void> {
  if (DEMO_MODE) return removeDemoTodo(id);
  await api.delete<ApiResponse<void>>(`/todos/${id}`);
}
