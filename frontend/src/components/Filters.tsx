import React from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { selectWrapperClass, selectClass } from "@/lib/classes";
import { Task, TaskState } from "@/types/tasks";

function Filters({
  tasks,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
}: {
  tasks: TaskState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: { priority: string; assignee: string; tag: string };
  setFilter: (filter: {
    priority: string;
    assignee: string;
    tag: string;
  }) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-xs bg-white"
      />
      <div className={selectWrapperClass}>
        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className={selectClass}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className={selectWrapperClass}>
        <select
          value={filter.assignee}
          onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
          className={selectClass}
        >
          <option value="all">All Assignees</option>
          {Array.from(
            new Set(
              Object.values(tasks).flatMap((tasks) =>
                tasks.map((task) => task.assignee)
              )
            )
          ).map((assignee) => (
            <option key={assignee} value={assignee || ""}>
              {assignee || "Unassigned"}
            </option>
          ))}
        </select>
      </div>

      <div className={selectWrapperClass}>
        <select
          value={filter.tag}
          onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
          className={selectClass}
        >
          <option value="all">All Tags</option>
          {Array.from(
            new Set(
              Object.values(tasks).flatMap((tasks) =>
                tasks.flatMap((task) => task.tags)
              )
            )
          ).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filters;
