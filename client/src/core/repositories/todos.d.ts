import type { Todo } from "@/core/entities/todo";

export type TodosRepository = {
  getAll: (_: { forceUpdate: boolean }) => Promise<Todo[]>;

  get: (_: { id: Todo["id"]; forceUpdate: boolean }) => Promise<Todo | null>;

  post: (_: { title: Todo["title"] }) => Promise<Todo>;

  patch: (_: {
    id: Todo["id"];
    title?: Todo["title"];
    isCompleted?: Todo["isCompleted"];
  }) => Promise<void>;

  delete: (_: { id: Todo["id"] }) => Promise<void>;
};
