import type { Todo } from "@/core/entities/todo";
import colors from "picocolors";

export default function Todo(props: {
  title: Todo["title"];
  isCompleted: Todo["isCompleted"];
}) {
  if (props.isCompleted) {
    return `${colors.green("✓")} ${props.title}`;
  } else {
    return `  ${props.title}`;
  }
}
