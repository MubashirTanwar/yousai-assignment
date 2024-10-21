import React, { useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { priorityColors, priorityIcons } from "@/lib/colors";
import { formatDueDate } from "@/lib/utils";
import { Task, TaskState } from "@/types/tasks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Body({
  tasks,
  setTasks,
  filteredTasks,
  deleteTask,
  updateTask,
  setEditingTask,
  setIsDialogOpen,
}: {
  tasks: TaskState;
  setTasks: (tasks: TaskState) => void;
  filteredTasks: () => TaskState;
  deleteTask: (taskId: string, status: string) => void;
  updateTask: (task: Task) => void;
  setEditingTask: (task: Task) => void;
  setIsDialogOpen: (open: boolean) => void;
}) {
  const onDragEnd = useCallback(
    (result: any) => {
      const { source, destination } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      if (source.droppableId === destination.droppableId) {
        const column = [...tasks[source.droppableId]];
        const [removed] = column.splice(source.index, 1);
        column.splice(destination.index, 0, removed);
        setTasks({ ...tasks, [source.droppableId]: column });
        return;
      }

      const sourceColumn = [...tasks[source.droppableId]];
      const destColumn = [...tasks[destination.droppableId]];
      const [removed] = sourceColumn.splice(source.index, 1);

      destColumn.splice(destination.index, 0, {
        ...removed,
        status: destination.droppableId,
      });

      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    },
    [tasks, setTasks]
  );

  const calculateProgress = useCallback(
    (columnTasks: Task[]) => {
      const totalTasks =
        filteredTasks().todo.length +
        filteredTasks().inProgress.length +
        filteredTasks().done.length;
      const completedTasks = columnTasks.length;
      return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    },
    [filteredTasks]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(filteredTasks()).map(([columnId, columnTasks]) => (
          <div
            key={columnId}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              columnId === "todo"
                ? "border-t-4 border-red-500"
                : columnId === "inProgress"
                ? "border-t-4 border-yellow-500"
                : "border-t-4 border-green-500"
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  {columnId === "todo"
                    ? "To Do"
                    : columnId === "inProgress"
                    ? "In Progress"
                    : "Done"}
                </h2>
                <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${calculateProgress(columnTasks)}%` }}
                ></div>
              </div>
            </div>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 p-4 min-h-[200px]"
                >
                  {columnTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
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
                              <p className="font-medium text-gray-800">
                                {task.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                  <p className="font-medium text-gray-800">
                                    {task.content}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center mt-2 space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      {priorityIcons[task.priority]}
                                    </TooltipTrigger>
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
                                        <p>
                                          Estimated: {task.estimatedTime} min
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag) => (
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
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                              )}
                              <div className="relative group">
                                <button className="p-1 rounded-full hover:bg-gray-200"
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
                                    onClick={() =>
                                      deleteTask(task.id, task.status)
                                    }
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
                              <p className="text-sm font-medium text-gray-700">
                                Subtasks:
                              </p>
                              <ul className="mt-1 space-y-1">
                                {task.subtasks.map((subtask) => (
                                  <li
                                    key={subtask.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={subtask.completed}
                                      onChange={() => {
                                        const updatedTask = {
                                          ...task,
                                          subtasks: task.subtasks.map((st) =>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
