import type { Todo } from "@/core/entities/todo";
import type { TodosRepository } from "../repositories/todos";

type Params = {
  todos: Pick<Todo, "id" | "isCompleted">[];
  todosRepository: Pick<TodosRepository, "patch">;
};

type Result = Promise<void>;

export type MarkAllTodosAsActive = (params: Params) => Result;

export const markAllTodosAsActive: MarkAllTodosAsActive = async (params) => {
  await Promise.all(
    params.todos
      .filter((todo) => todo.isCompleted)
      .map(async (todo) => {
        await params.todosRepository.patch({
          id: todo.id,
          isCompleted: false,
        });
      })
  );
};
