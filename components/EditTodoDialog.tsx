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
import { EditTodoDialogProps, Todo } from "@/types"
import { updateTodo } from "@/app/actions/todos"
import { toast } from "sonner"
import { useTodoStore } from "@/store/todoStore"

export function EditTodoDialog({
  todo,
  users,
  isOpen,
  onOpenChange,
}: EditTodoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
    userId: ""
  })

  const updateTodoInStore = useTodoStore(state => state.updateTodo)

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        completed: todo.completed,
        userId: String(todo.userId)
      })
    }
  }, [todo])

  const handleSubmit = async () => {
    if (!todo) return;
    setIsSubmitting(true);

    // Create a complete todo object for the update
    const updatedTodoData: Todo = {
      ...todo,
      title: formData.title,
      completed: formData.completed,
      userId: formData.userId,
      updatedAt: new Date().toISOString()
    };

    try {
      const result = await updateTodo(todo.id, updatedTodoData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update the local state immediately
      updateTodoInStore(updatedTodoData);
      onOpenChange(false);
      toast.success('Todo updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update todo');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!todo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to the todo task.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={formData.userId}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, userId: value }))}
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
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, completed: checked }))}
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 