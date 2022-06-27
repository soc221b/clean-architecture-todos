import boxen from "boxen";
import TodoComponent from "./components/todo";

import type { Todo } from "@/core/entities/todo";

export default (props: { todos: Todo[] }) => {
  const child = props.todos.map(TodoComponent).join("\n");

  return `${boxen(child, {
    fullscreen: (width, height) => [width, height - 3],
    padding: 1,
    title: "TODOs",
  })}`;
};
