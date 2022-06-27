import type { Todo as ITodo } from "@/core/entities/todo";
import boxen from "boxen";
import Todo from "./components/todo";

// TODO: implement operations
export default function App(props: { todos: ITodo[] }) {
  const children = props.todos.map(Todo).join("\n");

  return `${boxen(children, {
    fullscreen: () => [80, 24],
    padding: 1,
    title: "TODOs",
  })}`;
}
