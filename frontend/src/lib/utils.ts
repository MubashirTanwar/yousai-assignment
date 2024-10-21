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
      content: "Review water conservation project proposal",
      priority: "high",
      status: "todo",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      tags: ["Water Management", "Proposal Review"],
      assignee: "Rajesh Kumar",
      estimatedTime: 120,
      subtasks: [
        { id: "subtask-1", content: "Read proposal", completed: false },
        { id: "subtask-2", content: "Prepare feedback", completed: false },
      ],
    },
    {
      id: "task-2",
      content: "Update rainwater harvesting guidelines",
      priority: "medium",
      status: "todo",
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      tags: ["Documentation", "Water Conservation"],
      assignee: "Sneha Patel",
      estimatedTime: 180,
      subtasks: [],
    },
  ],
  inProgress: [
    {
      id: "task-3",
      content: "Implement new water quality monitoring feature",
      priority: "high",
      status: "inProgress",
      dueDate: new Date(Date.now() + 259200000).toISOString(),
      tags: ["Development", "Water Quality"],
      assignee: "Amit Sharma",
      estimatedTime: 480,
      subtasks: [
        { id: "subtask-3", content: "Design monitoring UI", completed: true },
        {
          id: "subtask-4",
          content: "Implement backend data processing",
          completed: false,
        },
      ],
    },
    {
      id: "task-4",
      content: "Refactor water distribution codebase",
      priority: "low",
      status: "inProgress",
      dueDate: null,
      tags: ["Development", "Water Distribution"],
      assignee: "Neha Gupta",
      estimatedTime: 360,
      subtasks: [],
    },
  ],
  done: [
    {
      id: "task-5",
      content: "Write unit tests for water filtration system",
      priority: "medium",
      status: "done",
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      tags: ["Testing", "Water Filtration"],
      assignee: "Ravi Verma",
      estimatedTime: 240,
      subtasks: [],
    },
    {
      id: "task-6",
      content: "Deploy water management app to staging",
      priority: "high",
      status: "done",
      dueDate: new Date(Date.now() - 172800000).toISOString(),
      tags: ["Deployment", "Water Management"],
      assignee: "Priya Singh",
      estimatedTime: 60,
      subtasks: [],
    },
  ],
};