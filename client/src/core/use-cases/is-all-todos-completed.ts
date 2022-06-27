import type { Todo } from "@/core/entities/todo";

type Params = {
  todos: Pick<Todo, "id" | "isCompleted">[];
};

type Result = boolean;

export type IsAllTodosCompleted = (params: Params) => Result;

export const isAllTodosCompleted: IsAllTodosCompleted = (params) => {
  return params.todos.every((todo) => {
    return todo.isCompleted;
  });
};
