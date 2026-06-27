import type { Todo, CreateTodoBody } from '../types/todo';
import { loadList, saveList, nextId, delay } from './demoStore';
import { appendDemoActivity } from './demoFeed';

const KEY = 'todo';

function seed(): Todo[] {
  return [
    { id: 1, title: '주간 회고 작성', done: false, createdAt: new Date().toISOString() },
    { id: 2, title: '운동복 세탁', done: false, createdAt: new Date().toISOString() },
    { id: 3, title: '전기요금 납부', done: true, createdAt: new Date().toISOString() },
  ];
}

export async function listDemoTodos(): Promise<Todo[]> {
  return delay(loadList(KEY, seed));
}

export async function createDemoTodo(body: CreateTodoBody): Promise<Todo> {
  const list = loadList(KEY, seed);
  const todo: Todo = {
    id: nextId(list),
    title: body.title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  saveList(KEY, [todo, ...list]);
  return delay(todo);
}

export async function toggleDemoTodo(id: number): Promise<Todo> {
  const list = loadList(KEY, seed);
  const target = list.find((t) => t.id === id);
  if (!target) throw new Error('할 일을 찾을 수 없어요.');
  const updated: Todo = { ...target, done: !target.done };
  saveList(KEY, list.map((t) => (t.id === id ? updated : t)));
  // 완료로 전환되면 피드에 활동을 흘려보낸다.
  if (updated.done) {
    appendDemoActivity({ type: 'TODO', payload: { title: updated.title } });
  }
  return delay(updated);
}

export async function removeDemoTodo(id: number): Promise<void> {
  const list = loadList(KEY, seed);
  saveList(KEY, list.filter((t) => t.id !== id));
  return delay(undefined);
}
