import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/date-picker'
import { Cross1Icon } from '@radix-ui/react-icons'
import { Task } from '@/types/tasks'
import { useState, useCallback } from 'react'

function TaskForm(
    {
        editingTask,
        setEditingTask,
        setTasks,
        updateTask,
        isDialogOpen,
        setIsDialogOpen 
    }: {
        editingTask: Task | null
        setEditingTask: (task: Task | null) => void
        updateTask: (task: Task) => void
        setTasks: (tasks: any) => void
        isDialogOpen: boolean
        setIsDialogOpen: (open: boolean) => void
    }   
)
{
  const [newSubtask, setNewSubtask] = useState("");
            const [newTask, setNewTask] = useState<Task>({
    id: "",
    content: "",
    priority: "medium",
    status: "todo",
    dueDate: null,
    tags: [],
    assignee: null,
    estimatedTime: null,
    subtasks: [],
  });
const addNewTask = useCallback(() => {
    const newTaskId = `task-${Date.now()}`;
    setTasks((prevTasks: any) => ({
      ...prevTasks,
      [newTask.status]: [
        ...prevTasks[newTask.status],
        { ...newTask, id: newTaskId },
      ],
    }));
    setNewTask({
      id: "",
      content: "",
      priority: "medium",
      status: "todo",
      dueDate: null,
      tags: [],
      assignee: null,
      estimatedTime: null,
      subtasks: [],
    });
    setIsDialogOpen(false);
  }, [newTask]);
  return (
    <>
   
            <Button
          variant="default"
          className="bg-primary hover:bg-accent-foreground text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
        <div className={`fixed ${isDialogOpen ? '': 'hidden'} inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`}>  
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[425px]">
            <div className='lex flex-col space-y-1.5 text-center sm:text-left' >
              <h1 className='text-lg font-semibold leading-none tracking-tight'>{editingTask ? 'Edit Task' : 'Add New Task'}</h1>
            </div>
            <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"> 
                <Button onClick={() => setIsDialogOpen(false)} variant='ghost'>
                    <Cross1Icon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-content">Task Description</Label>
                <Textarea
                  id="task-content"
                  value={editingTask ? editingTask.content : newTask.content}
                  onChange={(e) => editingTask ? setEditingTask({ ...editingTask, content: e.target.value }) : setNewTask({ ...newTask, content: e.target.value })}
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={editingTask ? editingTask.priority : newTask.priority}
                  onValueChange={(value) => editingTask ? setEditingTask({ ...editingTask, priority: value as 'high' | 'medium' | 'low' }) : setNewTask({ ...newTask, priority: value as 'high' | 'medium' | 'low' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={editingTask ? editingTask.status : newTask.status}
                  onValueChange={(value) => editingTask ? setEditingTask({ ...editingTask, status: value as 'todo' | 'inProgress' | 'done' }) : setNewTask({ ...newTask, status: value as 'todo' | 'inProgress' | 'done' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                {/* <Input
                  id="task-due-date"
                  type="datetime-local"
                  value={editingTask ? (editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : '') : (newTask.dueDate ? new Date(newTask.dueDate).toISOString().slice(0, 16) : '')}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value).toISOString() : null
                    editingTask ? setEditingTask({ ...editingTask, dueDate: date }) : setNewTask({ ...newTask, dueDate: date })
                  }}
                /> */}
                <DatePicker
                  date={editingTask ? editingTask.dueDate : newTask.dueDate}
                  setDate={(date: any) => editingTask ? setEditingTask({ ...editingTask, dueDate: date }) : setNewTask({ ...newTask, dueDate: date })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-tags">Tags (comma-separated)</Label>
                <Input
                  id="task-tags"
                  value={editingTask ? editingTask.tags.join(', ') : newTask.tags.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map((tag) => tag.trim())
                    editingTask ? setEditingTask({ ...editingTask, tags }) : setNewTask({ ...newTask, tags })
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Input
                  id="task-assignee"
                  value={editingTask ? editingTask.assignee || '' : newTask.assignee || ''}
                  onChange={(e) => editingTask ? setEditingTask({ ...editingTask, assignee: e.target.value }) : setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-estimated-time">Estimated Time (minutes)</Label>
                <Input
                  id="task-estimated-time"
                  type="number"
                  value={editingTask ? editingTask.estimatedTime || '' : newTask.estimatedTime || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : null
                    editingTask ? setEditingTask({ ...editingTask, estimatedTime: value }) : setNewTask({ ...newTask, estimatedTime: value })
                  }}
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="task-subtasks">Subtasks</Label>
                <div className="flex items-center">
                  <Input
                    id="new-subtask"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (newSubtask.trim()) {
                          const newSubtaskItem = { id: `subtask-${Date.now()}`, content: newSubtask, completed: false }
                          if (editingTask) {
                            setEditingTask({ ...editingTask, subtasks: [...editingTask.subtasks, newSubtaskItem] })
                          } else {
                            setNewTask({ ...newTask, subtasks: [...newTask.subtasks, newSubtaskItem] })
                          }
                          setNewSubtask('')
                        }
                      }
                    }
                    }
                  />
                  <Button onClick={() => {
                    if (newSubtask.trim()) {
                      const newSubtaskItem = { id: `subtask-${Date.now()}`, content: newSubtask, completed: false }
                      if (editingTask) {
                        setEditingTask({ ...editingTask, subtasks: [...editingTask.subtasks, newSubtaskItem] })
                      } else {
                        setNewTask({ ...newTask, subtasks: [...newTask.subtasks, newSubtaskItem] })
                      }
                      setNewSubtask('')
                    }
                  }}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 max-w-full mt-2">
                  {(editingTask ? editingTask.subtasks : newTask.subtasks).map((subtask) => (
                      <div key={subtask.id} className={`inline-flex border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold`}>
                        {subtask.content}
                        <Button
                          variant='ghost'
                          className="ml-2 p-0"
                          onClick={() => {
                            if (editingTask) {
                              setEditingTask({ ...editingTask, subtasks: editingTask.subtasks.filter((st) => st.id !== subtask.id) })
                            } else {
                              setNewTask({ ...newTask, subtasks: newTask.subtasks.filter((st) => st.id !== subtask.id) })
                            }
                          }}
                        >
                          <Cross1Icon />
                        </Button>
                      </div>
                  ))}
                </div>

              </div>
            </div>
            <Button onClick={editingTask ? () => updateTask(editingTask) : addNewTask}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </div> 
        </>
  )
}

export default TaskForm