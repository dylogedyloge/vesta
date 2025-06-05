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
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/config"
import { DeleteTodoDialogProps } from "@/types"



export function DeleteTodoDialog({
  todoId,
  todoTitle,
  isOpen,
  onOpenChange,
  isMobile,
  onDeleteSuccess
}: DeleteTodoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      // Update local state
      onOpenChange(false)
      onDeleteSuccess(todoId)

      // Invalidate queries
      if (isMobile) {
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
      } else {
        await queryClient.invalidateQueries({ queryKey: ['regularTodos'] })
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    } finally {
      setIsDeleting(false)
    }
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
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-2"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 