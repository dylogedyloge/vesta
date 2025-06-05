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
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { CreateTodoDialogProps } from "@/types"
import { QUERY_KEYS } from "@/config"

export function CreateTodoDialog({
  users,
  isOpen,
  onOpenChange,
  isMobile,
  onCreateSuccess
}: CreateTodoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
    userId: users[0]?.id || 0
  })
  const queryClient = useQueryClient()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Update local state
      onOpenChange(false)
      onCreateSuccess(formData)

      // Invalidate queries
      if (isMobile) {
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
      } else {
        await queryClient.invalidateQueries({ queryKey: ['regularTodos'] })
      }
    } catch (error) {
      console.error('Failed to create todo:', error)
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter todo title..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={String(formData.userId)}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, userId: Number(value) }))}
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
            {isSubmitting ? "Creating..." : "Create Todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 