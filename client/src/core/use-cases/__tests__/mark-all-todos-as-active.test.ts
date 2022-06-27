import type { Todo } from "@/core/entities/todo";
import { markAllTodosAsActive } from "@/core/use-cases/mark-all-todos-as-active";

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

describe("mark-all-todos-as-active", () => {
  test("it should call updateTodo for each completed todo", async () => {
    const todosRepository = {
      patch: vi.fn(),
    };

    await markAllTodosAsActive({ todos, todosRepository });

    expect(todosRepository.patch).toHaveBeenCalledTimes(1);
    expect(todosRepository.patch).toHaveBeenCalledWith({
      id: "456",
      isCompleted: false,
    });
  });
});
