import type { Todo } from "@/core/entities/todo";
import type { TodosLocalDataSource as ITodosLocalDataSource } from "@/core/data-sources/todos-local-data-source";
import type { Storage } from "@/browser/entities/storage";

const KEY = "todos-vanilla";

export class TodosLocalDataSource implements ITodosLocalDataSource {
  private readonly storage: Storage;

  constructor(params: { storage?: Storage }) {
    this.storage = params.storage ?? localStorage;
  }

  getAll = (): Todo[] => {
    return JSON.parse(this.storage.getItem(KEY) ?? "[]");
  };

  get = (todo: Pick<Todo, "id">): null | Todo => {
    const todos = this.getAll();
    return todos.find((t) => t.id === todo.id) ?? null;
  };

  post = (todo: Todo): void => {
    const todos = this.getAll();
    const nextTodos = todos.concat(todo);
    this.putAll(nextTodos);
  };

  putAll = (todos: Todo[]): void => {
    this.storage.setItem(KEY, JSON.stringify(todos));
  };

  patch = (todo: Pick<Todo, "id"> & Partial<Todo>): void => {
    const todos = this.getAll();
    const nextTodos = todos.map((oldTodo) => {
      if (oldTodo.id === todo.id) {
        return {
          ...oldTodo,
          ...todo,
        };
      } else {
        return oldTodo;
      }
    });
    this.putAll(nextTodos);
  };

  delete = (todo: Pick<Todo, "id">): void => {
    const todos = this.getAll();
    const nextTodos = todos.filter((t) => t.id !== todo.id);
    this.putAll(nextTodos);
  };
}
