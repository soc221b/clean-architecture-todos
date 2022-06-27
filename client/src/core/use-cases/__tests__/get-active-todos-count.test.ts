import type { Todo } from "@/core/entities/todo";
import { getActiveTodosCount } from "@/core/use-cases/get-active-todos-count";

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

describe("get-active-todos-count", () => {
  test("it return active count", async () => {
    const result = getActiveTodosCount({
      todos,
    });

    expect(result).toBe(1);
  });
});
