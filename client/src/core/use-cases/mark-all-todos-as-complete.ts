import type { Todo } from "@/core/entities/todo";
import type { TodosRepository } from "../repositories/todos";

type Params = {
  todos: Pick<Todo, "id" | "isCompleted">[];
  todosRepository: Pick<TodosRepository, "patch">;
};

type Result = Promise<void>;

export type MarkAllTodosAsComplete = (params: Params) => Result;

export const markAllTodosAsComplete: MarkAllTodosAsComplete = async (
  params
) => {
  await Promise.all(
    params.todos
      .filter((todo) => todo.isCompleted === false)
      .map(async (todo) => {
        await params.todosRepository.patch({
          id: todo.id,
          isCompleted: true,
        });
      })
  );
};
