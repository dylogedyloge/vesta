import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeleteTodoDialogProps } from "@/types"
import { deleteTodo } from "@/app/actions/todos"
import { toast } from "sonner"
import { useTodoStore } from "@/store/todoStore"

export function DeleteTodoDialog({
  todoId,
  todoTitle,
  isOpen,
  onOpenChange,
}: DeleteTodoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const deleteTodoFromStore = useTodoStore(state => state.deleteTodo)

  const handleDelete = async () => {
    setIsSubmitting(true)

    const promise = deleteTodo(todoId).then((result) => {
      if (result.error) {
        throw new Error(result.error)
      }
      if (result.data) {
        deleteTodoFromStore(todoId)
        onOpenChange(false)
      }
      return result
    }).finally(() => {
      setIsSubmitting(false)
    })

    toast.promise(promise, {
      loading: 'Deleting todo...',
      success: 'Todo deleted successfully',
      error: (err) => err.message || 'Failed to delete todo'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo?
          </DialogDescription>
          <p className="mt-2 text-sm border-l-4 border-gray-300 pl-4 py-2">
            {todoTitle}
          </p>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="ml-2"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 