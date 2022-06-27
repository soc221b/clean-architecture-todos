import type { Todo } from "@/core/entities/todo";
import type { Filter } from "@/core/entities/filter";

type Params = {
  filterBy: Filter;
  todos: Todo[];
};

type Result = Todo[];

export type FilterTodos = (params: Params) => Result;

export const filterTodos: FilterTodos = (params) => {
  switch (params.filterBy) {
    case "all":
      return params.todos;
    case "active":
      return params.todos.filter((todo) => !todo.isCompleted);
    case "completed":
      return params.todos.filter((todo) => todo.isCompleted);
  }
};
