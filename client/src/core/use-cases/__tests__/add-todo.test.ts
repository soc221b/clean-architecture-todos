import { Todo } from "@/core/entities/todo";
import { addTodo } from "@/core/use-cases/add-todo";
import { canSaveTodo } from "@/core/use-cases/can-save-todo";

import type { TodosRepository } from "@/core/repositories/todos";
import type { CanSaveTodo } from "@/core/use-cases/can-save-todo";

describe("add-todo", () => {
  test("it should call canSaveTodo", async () => {
    const todosRepository: Pick<TodosRepository, "post"> = {
      post: jest.fn(),
    };
    const todo: Pick<Todo, "title"> = {
      title: "",
    };
    const canSaveTodo: CanSaveTodo = jest.fn();

    try {
      await addTodo({ todo, todosRepository, canSaveTodo });
    } catch (error) {}
    expect(canSaveTodo).toHaveBeenCalledWith({ todo });
  });

  test("throw an error if addTodo fails", async () => {
    expect.assertions(1);

    const todosRepository: Pick<TodosRepository, "post"> = {
      post: jest.fn().mockImplementation(() => {
        throw new Error("Failed to add todo");
      }),
    };
    const todo: Pick<Todo, "title"> = {
      title: "My new todo",
    };

    try {
      await addTodo({ todo, todosRepository, canSaveTodo });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("return the todo if addTodo succeeds", async () => {
    expect.assertions(1);

    const todosRepository: Pick<TodosRepository, "post"> = {
      post: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          id: "123",
          title: "My new todo",
          isCompleted: false,
        });
      }),
    };
    const todo: Pick<Todo, "title"> = {
      title: "My new todo",
    };

    const result = await addTodo({ todo, todosRepository, canSaveTodo });

    expect(result).toEqual({
      id: "123",
      title: "My new todo",
      isCompleted: false,
    });
  });
});
