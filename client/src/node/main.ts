import App from "@/node/presentations/app";

(async () => {
  const todosRepository = new TodosRepository({});
  todosRepository.getAll({ forceUpdate: true }).then((todos) => {
    console.log(App({ todos }));
  });
})();
