import { TodosRepository } from "@/core/repositories/implements/todos";
import type { TodosLocalDataSource } from "@/core/data-sources/todos-local-data-source";
import type { TodosRemoteDataSource } from "@/core/data-sources/todos-remote-data-source";

const localDataSource: TodosLocalDataSource = {
  getAll: vi.fn(),

  get: vi.fn(),

  post: vi.fn(),

  putAll: vi.fn(),

  patch: vi.fn(),

  delete: vi.fn(),
};

const remoteDataSource: TodosRemoteDataSource = {
  getAll: vi.fn(),

  get: vi.fn(),

  post: vi.fn(),

  patch: vi.fn(),

  delete: vi.fn(),
};

afterEach(() => {
  vi.resetAllMocks();
});

describe("getAll", () => {
  it("should return local data if forceUpdate is false", async () => {
    const fakeTodos = [{ id: "1", title: "foo", isCompleted: false }];
    localDataSource.getAll = vi.fn(() => fakeTodos);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    const result = await todosRepository.getAll({});

    expect(localDataSource.getAll).toBeCalled();
    expect(result).toEqual(fakeTodos);
  });

  it("should try to fetch remote data if local data is empty", async () => {
    const fakeTodos = [{ id: "1", title: "foo", isCompleted: false }];
    localDataSource.getAll = vi.fn(() => []);
    remoteDataSource.getAll = vi.fn(async () => fakeTodos);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    const result = await todosRepository.getAll({});

    expect(localDataSource.getAll).toBeCalled();
    expect(remoteDataSource.getAll).toBeCalled();
    expect(result).toEqual(fakeTodos);
  });

  it("should return remote data if forceUpdate is true", async () => {
    const fakeTodos = [{ id: "1", title: "foo", isCompleted: false }];
    remoteDataSource.getAll = vi.fn(async () => fakeTodos);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    const result = await todosRepository.getAll({ forceUpdate: true });

    expect(remoteDataSource.getAll).toBeCalled();
    expect(result).toEqual(fakeTodos);
  });

  it("should also update the local data when the remote fetch is successful", async () => {
    const fakeTodos = [{ id: "1", title: "foo", isCompleted: false }];
    remoteDataSource.getAll = vi.fn(async () => fakeTodos);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    await todosRepository.getAll({ forceUpdate: true });

    expect(localDataSource.putAll).toBeCalledWith(fakeTodos);
  });
});

describe("get", () => {
  it("should return local data if forceUpdate is false", async () => {
    const fakeTodo = [{ id: "1", title: "foo", isCompleted: false }];
    localDataSource.get = vi.fn(() => fakeTodo[0]);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    const result = await todosRepository.get({ id: "1" });

    expect(localDataSource.get).toBeCalled();
    expect(result).toEqual(fakeTodo[0]);
  });

  it("should fetch remote data if local data is not found", async () => {
    const fakeTodo = [{ id: "1", title: "foo", isCompleted: false }];
    localDataSource.get = vi.fn(() => null);
    remoteDataSource.get = vi.fn(async () => fakeTodo[0]);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    const result = await todosRepository.get({ id: "1" });

    expect(localDataSource.get).toBeCalled();
    expect(remoteDataSource.get).toBeCalled();
    expect(result).toEqual(fakeTodo[0]);
  });

  it("should return remote data if forceUpdate is true", async () => {
    const fakeTodo = { id: "1", title: "foo", isCompleted: false };
    localDataSource.getAll = vi.fn(() => []);
    remoteDataSource.get = vi.fn(async () => fakeTodo);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    const result = await todosRepository.get({ id: "1", forceUpdate: true });

    expect(remoteDataSource.get).toBeCalledWith({ id: "1" });
    expect(result).toEqual(fakeTodo);
  });

  it("should patch local data when remote fetch is successful", async () => {
    const updatedTodo = {
      id: "1",
      title: "bar",
      isCompleted: true,
    };
    remoteDataSource.get = vi.fn(async () => updatedTodo);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    await todosRepository.get({ id: "1", forceUpdate: true });

    expect(localDataSource.patch).toBeCalledWith(updatedTodo);
  });

  it("should add to local data when remote fetch is successful", async () => {
    const fakeTodos = [{ id: "1", title: "foo", isCompleted: false }];
    remoteDataSource.get = vi.fn(async () => fakeTodos[0]);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    await todosRepository.get({ id: "1", forceUpdate: true });

    expect(localDataSource.patch).toBeCalledWith(fakeTodos[0]);
  });
});

describe("post", () => {
  it("should call remote", async () => {
    const addingTodo = { title: "foo" };
    const newTodo = { id: "1", title: "foo", isCompleted: false };
    remoteDataSource.post = vi.fn(async () => newTodo);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    todosRepository.post(addingTodo);

    expect(remoteDataSource.post).toBeCalledWith(addingTodo);
  });

  it("should update local data when remote post is successful", async () => {
    const addingTodo = { title: "bar" };
    const newTodo = { id: "2", title: "bar", isCompleted: false };
    localDataSource.get = vi.fn(() => null);
    remoteDataSource.post = vi.fn(async () => newTodo);
    remoteDataSource.get = vi.fn(async () => newTodo);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    await todosRepository.post(addingTodo);

    expect(localDataSource.post).toBeCalledWith(newTodo);
  });
});

describe("patch", () => {
  it("should call remote", async () => {
    const fakeTodo = { id: "1", title: "foo", isCompleted: false };
    localDataSource.getAll = vi.fn(() => []);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    todosRepository.patch(fakeTodo);

    expect(remoteDataSource.patch).toBeCalledWith(fakeTodo);
  });

  it("should update local data if remote patch is successful", async () => {
    const editingTodo = { id: "1", title: "bar", isCompleted: true };
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    await todosRepository.patch(editingTodo);

    expect(localDataSource.patch).toBeCalledWith(editingTodo);
  });
});

describe("delete", () => {
  it("should call remote", async () => {
    const deletingTodo = { id: "1" };
    localDataSource.getAll = vi.fn(() => []);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    todosRepository.delete(deletingTodo);

    expect(remoteDataSource.delete).toBeCalledWith(deletingTodo);
  });

  it("should update local data if remote delete is successful", async () => {
    const fakeTodos = [{ id: "1", title: "foo", isCompleted: false }];
    const deletingTodo = { id: "1" };
    localDataSource.getAll = vi.fn(() => fakeTodos);
    const todosRepository = new TodosRepository({
      localDataSource,
      remoteDataSource,
    });

    await todosRepository.delete(deletingTodo);

    expect(localDataSource.delete).toBeCalledWith(deletingTodo);
  });
});
