import { isAllTodosCompleted } from "@/core/use-cases/is-all-todos-completed";

import type { Todo } from "@/core/entities/todo";

const todos: Todo[] = [
  {
    id: "123",
    title: "My new todo",
    isCompleted: false,
  },
  {
    id: "456",
    title: "My second todo",
    isCompleted: true,
  },
];

describe("is-all-todos-completed", () => {
  test("it return true if all todos are completed", async () => {
    const result = isAllTodosCompleted({
      todos: todos.slice(1),
    });

    expect(result).toBe(true);
  });

  test("it return false if any todo is active", async () => {
    const result = isAllTodosCompleted({ todos });

    expect(result).toBe(false);
  });
});
