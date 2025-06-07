import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteTodo } from "@/app/actions/todos";
import { toast } from "sonner";
import { useTodoStore } from "@/store/todoStore";
import { DeleteTodoDialogProps } from "@/types";

export function DeleteTodoDialog({
  todoId,
  todoTitle,
  isOpen,
  onOpenChange,
}: DeleteTodoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTodoFromStore = useTodoStore(state => state.deleteTodo);
  const rollbackToPreviousState = useTodoStore(state => state.rollbackToPreviousState);

  const handleDelete = async () => {
    setIsDeleting(true);

    // Optimistically remove from UI
    deleteTodoFromStore(todoId);
    onOpenChange(false);

    try {
      const result = await deleteTodo(todoId);
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        toast.success('Todo deleted successfully');
      }
    } catch (err) {
      // Rollback on error
      rollbackToPreviousState();
      toast.error(err instanceof Error ? err.message : 'Failed to delete todo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo?
            This action cannot be undone.
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
  );
} 