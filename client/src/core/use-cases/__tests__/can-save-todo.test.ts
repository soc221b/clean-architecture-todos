import { canSaveTodo } from "@/core/use-cases/can-save-todo";

import type { Todo } from "@/core/entities/todo";

describe("can-save-todo", () => {
  test("return true if todo title is not empty", async () => {
    expect.assertions(1);

    const todo: Pick<Todo, "title"> = {
      title: "My new todo",
    };

    const result = canSaveTodo({ todo });

    expect(result).toBe(true);
  });

  test("return false if todo title is empty", async () => {
    expect.assertions(1);

    const todo: Pick<Todo, "title"> = {
      title: "",
    };

    const result = canSaveTodo({ todo });

    expect(result).toBe(false);
  });

  test("return false if todo title is all whitespace", async () => {
    expect.assertions(1);

    const todo: Pick<Todo, "title"> = {
      title: "   ",
    };

    const result = canSaveTodo({ todo });

    expect(result).toBe(false);
  });
});
