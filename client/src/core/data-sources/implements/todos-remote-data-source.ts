import { z } from "zod";

import type { Todo } from "@/core/entities/todo";
import type { TodosRemoteDataSource as ITodosRemoteDataSource } from "@/core/data-sources/todos-remote-data-source";

const apiEndpoint = "http://localhost:3001/todos";

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});
const todosSchema = z.array(todoSchema);

const convertJsonToTodo = (t: {
  id: number;
  title: string;
  completed: boolean;
}): Todo => ({
  id: t.id.toString(),
  title: t.title,
  isCompleted: t.completed,
});

export class TodosRemoteDataSource implements ITodosRemoteDataSource {
  getAll = async (): Promise<Todo[]> => {
    const result = await fetch(apiEndpoint);

    const json = await result.json();

    const parsedJson = todosSchema.parse(json);

    return parsedJson.map(convertJsonToTodo);
  };

  get = async (params: { id: Todo["id"] }): Promise<Todo> => {
    const result = await fetch(`${apiEndpoint}/${params.id}`);

    const json = await result.json();

    const parsedJson = todoSchema.parse(json);

    return convertJsonToTodo(parsedJson);
  };

  post = async (todo: Pick<Todo, "title">): Promise<Todo> => {
    const result = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todo.title,
        completed: false,
      }),
    });

    const json = await result.json();

    const todoSchema = z.object({
      id: z.number(),
      title: z.string(),
      completed: z.boolean(),
    });

    const newTodo = todoSchema.parse(json);

    return {
      id: newTodo.id.toString(),
      title: newTodo.title,
      isCompleted: newTodo.completed,
    };
  };

  patch = async (todo: Pick<Todo, "id"> & Partial<Todo>): Promise<void> => {
    const result = await fetch(`${apiEndpoint}/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todo.title,
        completed: todo.isCompleted,
      }),
    });

    const json = await result.json();

    const todoSchema = z.object({
      id: z.number(),
      title: z.string(),
      completed: z.boolean(),
    });
  };

  delete = async (todo: Pick<Todo, "id">): Promise<void> => {
    await fetch(`${apiEndpoint}/${todo.id}`, {
      method: "DELETE",
    });
  };
}
