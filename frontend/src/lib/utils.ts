import { TaskState } from "@/types/tasks";
import { clsx, type ClassValue } from "clsx"
import { useCallback } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export   const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return "";
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`;
    if (diffDays > 7) return `Due on ${due.toLocaleDateString()}`;
    return "Overdue";
  };

export const initialTasks: TaskState = {
  todo: [
    {
      id: "task-1",
      content: "Review pull request for user authentication feature",
      priority: "high",
      status: "todo",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      tags: ["Code Review", "Authentication"],
      assignee: "Alice Johnson",
      estimatedTime: 120,
      subtasks: [
        { id: "subtask-1", content: "Check code quality", completed: false },
        { id: "subtask-2", content: "Test functionality", completed: false },
      ],
    },
    {
      id: "task-2",
      content: "Update API documentation",
      priority: "medium",
      status: "todo",
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      tags: ["Documentation", "API"],
      assignee: "Bob Smith",
      estimatedTime: 180,
      subtasks: [],
    },
  ],
  inProgress: [
    {
      id: "task-3",
      content: "Implement new data visualization component",
      priority: "high",
      status: "inProgress",
      dueDate: new Date(Date.now() + 259200000).toISOString(),
      tags: ["Frontend", "Data Visualization"],
      assignee: "Charlie Brown",
      estimatedTime: 480,
      subtasks: [
        { id: "subtask-3", content: "Design component UI", completed: true },
        {
          id: "subtask-4",
          content: "Integrate with backend API",
          completed: false,
        },
      ],
    },
    {
      id: "task-4",
      content: "Refactor database access layer",
      priority: "low",
      status: "inProgress",
      dueDate: null,
      tags: ["Backend", "Database"],
      assignee: "Diana Prince",
      estimatedTime: 360,
      subtasks: [],
    },
  ],
  done: [
    {
      id: "task-5",
      content: "Write unit tests for user registration module",
      priority: "medium",
      status: "done",
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      tags: ["Testing", "User Management"],
      assignee: "Ethan Hunt",
      estimatedTime: 240,
      subtasks: [],
    },
    {
      id: "task-6",
      content: "Deploy application to staging environment",
      priority: "high",
      status: "done",
      dueDate: new Date(Date.now() - 172800000).toISOString(),
      tags: ["DevOps", "Deployment"],
      assignee: "Fiona Gallagher",
      estimatedTime: 60,
      subtasks: [],
    },
  ],
};