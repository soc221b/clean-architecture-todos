import type { Todo } from "@/core/entities/todo";
import { updateTodoTitle } from "@/core/use-cases/update-todo-title";

describe("update-todo-title", () => {
  test("it should throw if todo title is empty or all whitespace", async () => {
    expect.assertions(1);

    const todosRepository = {
      patch: vi.fn(),
    };
    const todo: Pick<Todo, "id" | "title"> = {
      id: "123",
      title: "  ",
    };

    try {
      await updateTodoTitle({ todo, todosRepository });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("it should call updateTodo", async () => {
    expect.assertions(2);

    const todosRepository = {
      patch: vi.fn(),
    };
    const todo: Pick<Todo, "id" | "title"> = {
      id: "123",
      title: "My new todo",
    };

    await updateTodoTitle({ todo, todosRepository });

    expect(todosRepository.patch).toHaveBeenCalledTimes(1);
    expect(todosRepository.patch).toHaveBeenCalledWith({
      id: "123",
      title: "My new todo",
    });
  });
});
