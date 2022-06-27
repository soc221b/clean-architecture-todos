import type { Todo } from "@/core/entities/todo";

type Params = {
  todo: Pick<Todo, "title">;
};

type Result = boolean;

export type CanSaveTodo = (params: Params) => Result;

export const canSaveTodo: CanSaveTodo = (params) => {
  return params.todo.title.trim().length > 0;
};
