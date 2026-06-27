export interface Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface CreateTodoBody {
  title: string;
}
