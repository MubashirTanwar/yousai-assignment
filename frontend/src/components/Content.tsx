import React from "react";
import { Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { formatDueDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from 'lucide-react'


export const priorityColors: Record<string, string> = {
  high: 'bg-red-50 hover:bg-red-100 border-red-200',
  medium: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
  low: 'bg-green-50 hover:bg-green-100 border-green-200',
}

export const priorityIcons: Record<string, React.ReactNode> = {
  high: <AlertCircle className="w-4 h-4 text-red-500" />,
  medium: <Clock className="w-4 h-4 text-yellow-500" />,
  low: <Clock className="w-4 h-4 text-green-500" />,
}

function Content({
    task,
    provided,
    deleteTask,
    updateTask,
    setEditingTask,
    setIsDialogOpen,
    }: {
    task: any;
    provided: any;
    deleteTask: (taskId: string, status: string) => void;
    updateTask: (task: any) => void;
    setEditingTask: (task: any) => void;
    setIsDialogOpen: (open: boolean) => void;
}) {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-3 rounded-lg border ${
        priorityColors[task.priority]
      } transition-all duration-200 shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <p className="font-medium text-gray-800">{task.content}</p>
            </div>
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{priorityIcons[task.priority]}</TooltipTrigger>
                <TooltipContent>
                  <p>Priority: {task.priority}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {task.dueDate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatDueDate(task.dueDate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {task.estimatedTime && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Clock className="w-4 h-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated: {task.estimatedTime} min</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
              {task.assignee
                .split(" ")
                .map((n: any[]) => n[0])
                .join("")}
            </div>
          )}
          <div className="relative group">
            <button
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={() => {
                setEditingTask(task);
                setIsDialogOpen(true);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <div className="absolute right-0 w-40 bg-white rounded-md shadow-lg hidden group-hover:block">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setEditingTask(task);
                  setIsDialogOpen(true);
                }}
              >
                <Edit2 className="inline-block mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                onClick={() => deleteTask(task.id, task.status)}
              >
                <Trash2 className="inline-block mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {task.subtasks.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Subtasks:</p>
          <ul className="mt-1 space-y-1">
            {task.subtasks.map((subtask: any) => (
              <li key={subtask.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => {
                    const updatedTask = {
                      ...task,
                      subtasks: task.subtasks.map((st: { id: any; completed: any; }) =>
                        st.id === subtask.id
                          ? {
                              ...st,
                              completed: !st.completed,
                            }
                          : st
                      ),
                    };
                    updateTask(updatedTask);
                  }}
                  className="mr-2"
                />
                <span
                  className={`text-sm ${
                    subtask.completed
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {subtask.content}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default Content;
