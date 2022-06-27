import type { Todo } from "@/core/entities/todo";
import type { TodosRepository } from "../repositories/todos";
import type { CanSaveTodo } from "./can-save-todo";

type Params = {
  todo: Pick<Todo, "title">;
  todosRepository: Pick<TodosRepository, "post">;
  canSaveTodo: CanSaveTodo;
};

type Result = Promise<Todo>;

export type AddTodo = (params: Params) => Result;

export const addTodo: AddTodo = async (params) => {
  if (params.canSaveTodo({ todo: params.todo }) === false)
    throw new Error("Todo title is required");

  return params.todosRepository.post({
    ...params.todo,
    title: params.todo.title.trim(),
  });
};
