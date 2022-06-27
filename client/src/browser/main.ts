import "todomvc-common/base.js";
import "todomvc-common/base.css";
import "todomvc-app-css/index.css";
import { addTodo } from "@/core/use-cases/add-todo";
import { canSaveTodo } from "@/core/use-cases/can-save-todo";
import { markAllTodosAsComplete } from "@/core/use-cases/mark-all-todos-as-complete";
import { isAllTodosCompleted } from "@/core/use-cases/is-all-todos-completed";
import { filterTodos } from "@/core/use-cases/filter-todos";
import { getActiveTodosCount } from "@/core/use-cases/get-active-todos-count";
import { markAllTodosAsActive } from "@/core/use-cases/mark-all-todos-as-active";
import { updateTodoTitle } from "@/core/use-cases/update-todo-title";

import type { Filter } from "@/core/entities/filter";
import type { Todo } from "@/core/entities/todo";

const todosRepository = new TodosRepository({});

let todos: Todo[] = [];
const update = async () => {
  todos = await todosRepository.getAll({ forceUpdate: true });
  todos = filterTodos({
    todos,
    filterBy,
  });

  renderList();
  renderCount();
  clear.style.display = todos.some((todo) => todo.isCompleted)
    ? "unset"
    : "none";
};
update();

let filterBy: Filter = "all";
const updateFilterBy = async () => {
  const selected = document.querySelector(".selected");
  selected?.classList.remove("selected");

  switch (window.location.hash) {
    case "#/active":
      filterBy = "active";
      document.querySelector('[href="#/active"]')?.classList.add("selected");
      break;
    case "#/completed":
      filterBy = "completed";
      document.querySelector('[href="#/completed"]')?.classList.add("selected");
      break;
    default:
      filterBy = "all";
      document.querySelector('[href="#/"]')?.classList.add("selected");
      break;
  }

  await update();
};
window.addEventListener("hashchange", updateFilterBy);
updateFilterBy();

const input = document.querySelector(".new-todo") as HTMLInputElement;
input.addEventListener("keyup", async (e) => {
  if (e.key !== "Enter") return;
  if (
    canSaveTodo({
      todo: {
        title: input.value,
      },
    }) === false
  )
    return;

  await addTodo({
    todo: {
      title: input.value,
    },
    todosRepository,
    canSaveTodo,
  });
  await update();
  input.value = "";
  input.focus();
});

const toggleAll = document.querySelector(".toggle-all") as HTMLInputElement;
toggleAll.addEventListener("click", async () => {
  if (
    isAllTodosCompleted({
      todos: filterTodos({
        todos,
        filterBy,
      }),
    })
  ) {
    await markAllTodosAsActive({
      todos,
      todosRepository,
    });
  } else {
    await markAllTodosAsComplete({
      todos,
      todosRepository,
    });
  }

  await update();
});

const clear = document.querySelector(".clear-completed") as HTMLButtonElement;
clear.addEventListener("click", async () => {
  const allTodos = await todosRepository.getAll({});
  await Promise.all(
    allTodos
      .filter((todo) => todo.isCompleted)
      .map((todo) => todosRepository.delete(todo))
  );
  await update();
});

const list = document.querySelector(".todo-list") as HTMLUListElement;
const renderList = async () => {
  list.innerHTML = "";

  todos
    .map((todo) => {
      const toggle = document.createElement("input");
      toggle.classList.add("toggle");
      toggle.type = "checkbox";
      if (todo.isCompleted) toggle.checked = true;
      toggle.addEventListener("change", async () => {
        await todosRepository.patch({
          id: todo.id,
          isCompleted: toggle.checked,
        });
        await update();
      });

      const label = document.createElement("label");
      label.innerText = todo.title;
      label.addEventListener("dblclick", () => {
        li.classList.add("editing");
        requestAnimationFrame(() => {
          edit.focus();
        });
      });

      const destroy = document.createElement("button");
      destroy.classList.add("destroy");
      destroy.addEventListener("click", async () => {
        await todosRepository.delete({
          id: todo.id,
        });
        await update();
      });

      const view = document.createElement("div");
      view.classList.add("view");
      view.appendChild(toggle);
      view.appendChild(label);
      view.appendChild(destroy);

      const edit = document.createElement("input");
      edit.classList.add("edit");
      edit.value = todo.title;
      edit.addEventListener("keyup", async (e) => {
        if (e.key !== "Enter") return;

        const updatingTodo = {
          id: todo.id,
          title: edit.value,
        };
        if (canSaveTodo({ todo })) {
          await updateTodoTitle({
            todo: updatingTodo,
            todosRepository,
          });
        }
        await update();
      });
      edit.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          li.classList.remove("editing");
        }
      });
      edit.addEventListener("blur", () => {
        li.classList.remove("editing");
      });

      const li = document.createElement("li");
      if (todo.isCompleted) li.classList.add("completed");
      li.appendChild(view);
      li.appendChild(edit);

      return li;
    })
    .forEach((item) => {
      list.appendChild(item);
    });
};

const count = document.querySelector(".todo-count") as HTMLSpanElement;
const renderCount = async () => {
  const c = getActiveTodosCount({
    todos: filterTodos({
      todos,
      filterBy,
    }),
  });

  count.innerText = `${c} item${c === 1 ? "" : "s"} left`;
};
