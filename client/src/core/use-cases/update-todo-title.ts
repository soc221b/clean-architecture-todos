import type { Todo } from "@/core/entities/todo";
import type { TodosRepository } from "../repositories/todos";

type Params = {
  todo: Pick<Todo, "id" | "title">;
  todosRepository: Pick<TodosRepository, "patch">;
};

type Result = Promise<void>;

export type UpdateTodoTitle = (params: Params) => Result;

export const updateTodoTitle: UpdateTodoTitle = async (params) => {
  if (params.todo.title.trim().length === 0)
    throw new Error("Todo title is required");

  await params.todosRepository.patch(params.todo);
};
