import { TodosRemoteDataSource } from "@/core/data-sources/implements/todos-remote-data-source";
import { TodosLocalDataSource } from "@/node/data-sources/implements/todos-local-data-source";
import App from "@/node/presentations/app";

(async () => {
  const todosRepository = new TodosRepository({
    localDataSource: new TodosLocalDataSource(),
    remoteDataSource: new TodosRemoteDataSource(),
  });
  todosRepository.getAll({ forceUpdate: true }).then((todos) => {
    console.log(App({ todos }));
  });
})();
