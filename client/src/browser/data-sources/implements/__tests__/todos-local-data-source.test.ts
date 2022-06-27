import { Todo } from "@/core/entities/todo";
import { TodosLocalDataSource } from "@/browser/data-sources/implements/todos-local-data-source";
import { Storage } from "@/browser/entities/storage";

const storage: Storage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

afterEach(() => {
  vi.resetAllMocks();
});

describe("getAll", () => {
  it("should return an empty array if there is no data", () => {
    storage.getItem = vi.fn(() => null);
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    const actual = todosLocalDataSource.getAll();

    expect(actual).toEqual(<Todo[]>[]);
  });

  it("should return persisted data", () => {
    storage.getItem = vi.fn(() =>
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: false },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    const actual = todosLocalDataSource.getAll();

    expect(actual).toEqual(<Todo[]>[
      { id: "1", title: "foo", isCompleted: false },
      { id: "2", title: "bar", isCompleted: false },
    ]);
  });
});

describe("get", () => {
  it("should return null if not found", () => {
    storage.getItem = vi.fn(() =>
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: false },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    const actual = todosLocalDataSource.get(<Todo>{ id: "3" });

    expect(actual).toEqual(null);
  });

  it("should return persisted data", () => {
    storage.getItem = vi.fn(() =>
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: false },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    const actual = todosLocalDataSource.get({ id: "1" });

    expect(actual).toEqual(<Todo>{ id: "1", title: "foo", isCompleted: false });
  });
});

describe("post", () => {
  it("should persist", () => {
    storage.getItem = vi.fn(() =>
      JSON.stringify(<Todo[]>[{ id: "1", title: "foo", isCompleted: false }])
    );
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    todosLocalDataSource.post({ id: "2", title: "bar", isCompleted: false });

    expect(storage.setItem).toBeCalledWith(
      expect.anything(),
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: false },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
  });
});

describe("patch", () => {
  it("should persist", () => {
    storage.getItem = vi.fn(() =>
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: false },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    todosLocalDataSource.patch({ id: "1", isCompleted: true });

    expect(storage.setItem).toBeCalledWith(
      expect.anything(),
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: true },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
  });
});

describe("delete", () => {
  it("should persist", () => {
    storage.getItem = vi.fn(() =>
      JSON.stringify(<Todo[]>[
        { id: "1", title: "foo", isCompleted: false },
        { id: "2", title: "bar", isCompleted: false },
      ])
    );
    const todosLocalDataSource = new TodosLocalDataSource({
      storage: storage,
    });

    todosLocalDataSource.delete({ id: "2" });

    expect(storage.setItem).toBeCalledWith(
      expect.anything(),
      JSON.stringify(<Todo[]>[{ id: "1", title: "foo", isCompleted: false }])
    );
  });
});
