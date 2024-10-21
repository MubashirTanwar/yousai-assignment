import React, { useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Task, TaskState } from "@/types/tasks";
import Content from "./Content";

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
                        <Content
                          task={task}
                          provided={provided}
                          deleteTask={deleteTask}
                          updateTask={updateTask}
                          setEditingTask={setEditingTask}
                          setIsDialogOpen={setIsDialogOpen}
                        />
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
