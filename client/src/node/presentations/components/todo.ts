import colors from "picocolors";

import type { Todo } from "@/core/entities/todo";

export default (props: {
  title: Todo["title"];
  isCompleted: Todo["isCompleted"];
}) => {
  if (props.isCompleted) {
    return `${colors.green("✓")} ${props.title}`;
  } else {
    return `  ${props.title}`;
  }
};
