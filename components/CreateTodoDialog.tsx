import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { CreateTodoDialogProps, Todo } from "@/types"
import { createTodo } from "@/app/actions/todos"
import { toast } from "sonner"
import { useTodoStore } from "@/store/todoStore"

export function CreateTodoDialog({
  users,
  isOpen,
  onOpenChange,
}: CreateTodoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
    userId: String(users[0]?.id || ""),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const addTodo = useTodoStore(state => state.addTodo)
  const rollbackToPreviousState = useTodoStore(state => state.rollbackToPreviousState)

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        completed: false,
        userId: String(users[0]?.id || ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }, [isOpen, users])

  const handleSubmit = async () => {
    if (!formData.title || !formData.userId) return
    
    setIsSubmitting(true)
    
    // Create optimistic todo
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`, // Temporary ID
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Optimistically update UI
    addTodo(optimisticTodo)
    onOpenChange(false)
    
    try {
      const result = await createTodo(formData)
      if (result.error) {
        throw new Error(result.error)
      }
      
      if (result.data) {
        // Replace optimistic todo with real one
        addTodo(result.data)
        toast.success('Todo created successfully')
      }
    } catch (err) {
      // Rollback on error
      rollbackToPreviousState()
      toast.error(err instanceof Error ? err.message : 'Failed to create todo')
      onOpenChange(true) // Reopen dialog to preserve user input
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
          <DialogDescription>
            Add a new todo task and assign it to a team member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter todo title..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={String(formData.userId)}
              onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Select an assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="completed">Completed</Label>
            <Switch
              id="completed"
              checked={formData.completed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, completed: checked }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.userId}
          >
            Create Todo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 