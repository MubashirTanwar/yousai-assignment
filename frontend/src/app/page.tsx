"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskState } from "@/types/tasks";
import TaskForm from "@/components/TaskForm";
import Filters from "@/components/Filters";
import Body from "@/components/Body";
import { initialTasks } from "@/lib/utils";

export default function EnhancedTaskManagementPage() {
  const [tasks, setTasks] = useState<TaskState>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [filter, setFilter] = useState({
    priority: "all",
    assignee: "all",
    tag: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [updatedTask.status]: prevTasks[updatedTask.status].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
    setEditingTask(null);
    setIsDialogOpen(false);
  }, []);

  const deleteTask = useCallback((taskId: string, status: string) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: prevTasks[status].filter((task) => task.id !== taskId),
    }));
  }, []);

  const filteredTasks = useCallback(() => {
    return Object.entries(tasks).reduce((acc, [status, taskList]) => {
      acc[status] = taskList.filter((task) => {
        const priorityMatch =
          filter.priority === "all" || task.priority === filter.priority;
        const assigneeMatch =
          filter.assignee === "all" || task.assignee === filter.assignee;
        const tagMatch = filter.tag === "all" || task.tags.includes(filter.tag);
        const searchMatch = task.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return priorityMatch && assigneeMatch && tagMatch && searchMatch;
      });
      return acc;
    }, {} as TaskState);
  }, [tasks, filter, searchQuery]);

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

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Task Management</h1>
        <TaskForm
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          setTasks={setTasks}
          updateTask={updateTask}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
      <Filters
        tasks={tasks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
      />
      <Body
        tasks={tasks}
        setTasks={setTasks}
        filteredTasks={filteredTasks}
        deleteTask={deleteTask}
        updateTask={updateTask}
        setEditingTask={setEditingTask}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}
