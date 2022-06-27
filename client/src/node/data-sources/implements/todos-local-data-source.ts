import fs from "fs";
import path from "path";
import type { Todo } from "@/core/entities/todo";
import type { TodosLocalDataSource as ITodosLocalDataSource } from "@/core/data-sources/todos-local-data-source";

const todosPath = path.resolve(__dirname, "todos.local.json");

export class TodosLocalDataSource implements ITodosLocalDataSource {
  getAll = (): Todo[] => {
    const persistedTodos = fs.existsSync(todosPath)
      ? fs.readFileSync(todosPath).toString()
      : "[]";
    return JSON.parse(persistedTodos);
  };

  get = (todo: Pick<Todo, "id">): null | Todo => {
    const todos = this.getAll();
    return todos.find((t) => t.id === todo.id) || null;
  };

  post = (todo: Todo): void => {
    const todos = this.getAll();
    const nextTodos = todos.concat(todo);
    this.putAll(nextTodos);
  };

  putAll = (todos: Todo[]): void => {
    fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2) + "\n");
  };

  patch = (todo: Pick<Todo, "id"> & Partial<Todo>): void => {
    const todos = this.getAll();
    const nextTodos = todos.map((t) => {
      if (t.id === todo.id) {
        return {
          ...t,
          ...todo,
        };
      } else {
        return t;
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
