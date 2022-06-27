import type { Todo } from "@/core/entities/todo";

export class TodosRemoteDataSource {
  getAll: () => Promise<Todo[]>;

  get: (todo: Pick<Todo, "id">) => Promise<null | Todo>;

  post: (todo: Pick<Todo, "title">) => Promise<Pick<Todo, "id">>;

  patch: (todo: Pick<Todo, "id"> & Partial<Todo>) => Promise<void>;

  delete: (todo: Pick<Todo, "id">) => Promise<void>;
}
