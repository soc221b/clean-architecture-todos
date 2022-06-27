import type { Todo } from "@/core/entities/todo";

export class TodosLocalDataSource {
  getAll: () => Todo[];

  get: (todo: Pick<Todo, "id">) => null | Todo;

  post: (todo: Todo) => void;

  putAll: (todos: Todo[]) => void;

  patch: (todo: Pick<Todo, "id"> & Partial<Todo>) => void;

  delete: (todo: Pick<Todo, "id">) => void;
}
