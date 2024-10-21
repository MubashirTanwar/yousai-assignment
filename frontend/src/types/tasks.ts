export interface Task {
  id: string
  content: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'inProgress' | 'done'
  dueDate: string | null
  tags: string[]
  assignee: string | null
  estimatedTime: number | null
  subtasks: { id: string; content: string; completed: boolean }[]
}

export interface TaskState {
  [key: string]: Task[]
}