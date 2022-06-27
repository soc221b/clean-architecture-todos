import type { Todo } from "@/core/entities/todo";
import type { TodosRepository as ITodosRepository } from "@/core/repositories/todos";
import type { TodosLocalDataSource as ITodosLocalDataSource } from "@/core/data-sources/todos-local-data-source";
import type { TodosRemoteDataSource as ITodosRemoteDataSource } from "@/core/data-sources/todos-remote-data-source";

export class TodosRepository implements ITodosRepository {
  private readonly localDataSource: ITodosLocalDataSource;
  private readonly remoteDataSource: ITodosRemoteDataSource;

  constructor(params: {
    localDataSource?: ITodosLocalDataSource;
    remoteDataSource?: ITodosRemoteDataSource;
  }) {
    this.localDataSource = params.localDataSource ?? new TodosLocalDataSource();
    this.remoteDataSource =
      params.remoteDataSource ?? new TodosRemoteDataSource();
  }

  getAll = async (params: { forceUpdate?: boolean }): Promise<Todo[]> => {
    if (!params.forceUpdate) {
      const todos = this.localDataSource.getAll();
      if (todos.length) {
        return todos;
      }
    }

    const todos = await this.remoteDataSource.getAll();
    this.localDataSource.putAll(todos);
    return todos;
  };

  get = async (params: {
    id: Todo["id"];
    forceUpdate?: boolean;
  }): Promise<Todo | null> => {
    if (!params.forceUpdate) {
      const todo = this.localDataSource.get({ id: params.id });
      if (todo !== null) {
        return todo;
      }
    }

    const todo = await this.remoteDataSource.get({ id: params.id });
    if (todo === null) return null;

    this.localDataSource.patch(todo);
    return todo;
  };

  post = async (params: { title: Todo["title"] }): Promise<Todo> => {
    const { id } = await this.remoteDataSource.post({
      title: params.title,
    });

    const todo = (await this.get({ id }))!;
    this.localDataSource.post(todo);
    return todo;
  };

  patch = async (params: {
    id: Todo["id"];
    title?: Todo["title"];
    isCompleted?: Todo["isCompleted"];
  }): Promise<void> => {
    const editingTodo = {
      id: params.id,
      title: params.title,
      isCompleted: params.isCompleted,
    };
    await this.remoteDataSource.patch(editingTodo);
    this.localDataSource.patch(editingTodo);
  };

  delete = async (params: { id: Todo["id"] }): Promise<void> => {
    const deletingTodo = {
      id: params.id,
    };
    await this.remoteDataSource.delete(deletingTodo);
    this.localDataSource.delete(deletingTodo);
  };
}
