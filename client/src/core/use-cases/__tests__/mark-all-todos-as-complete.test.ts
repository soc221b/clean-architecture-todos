import type { Todo } from "@/core/entities/todo";
import { markAllTodosAsComplete } from "@/core/use-cases/mark-all-todos-as-complete";

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

describe("mark-all-todos-as-complete", () => {
  test("it should call updateTodo for each active todo", async () => {
    const todosRepository = {
      patch: vi.fn(),
    };

    await markAllTodosAsComplete({ todos, todosRepository });

    expect(todosRepository.patch).toHaveBeenCalledTimes(1);
    expect(todosRepository.patch).toHaveBeenCalledWith({
      id: "123",
      isCompleted: true,
    });
  });
});
