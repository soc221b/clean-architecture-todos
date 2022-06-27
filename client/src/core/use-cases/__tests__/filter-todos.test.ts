import type { Todo } from "@/core/entities/todo";
import { filterTodos } from "@/core/use-cases/filter-todos";

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

describe("filter-todos", () => {
  test("it should return all todos if filterBy is all", () => {
    const result = filterTodos({ filterBy: "all", todos });

    expect(result).toEqual(todos);
  });

  test("it should return active todos if filterBy is active", () => {
    const result = filterTodos({ filterBy: "active", todos });

    expect(result).toEqual([todos[0]]);
  });

  test("it should return completed todos if filterBy is completed", () => {
    const result = filterTodos({ filterBy: "completed", todos });

    expect(result).toEqual([todos[1]]);
  });
});
