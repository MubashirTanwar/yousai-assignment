import { AlertCircle, Clock } from 'lucide-react'
import * as React from 'react'

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