import type { Todo } from "@/core/entities/todo";

type Params = {
  todos: Pick<Todo, "id" | "isCompleted">[];
};

type Result = number;

export type GetActiveTodosCount = (params: Params) => Result;

export const getActiveTodosCount: GetActiveTodosCount = (params) => {
  return params.todos.filter((todo) => {
    return todo.isCompleted === false;
  }).length;
};
