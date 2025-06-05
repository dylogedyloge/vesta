import { Suspense } from "react";
import TodoDetail from "@/components/TodoDetail";

export default async function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoDetail id={id} />
    </Suspense>
  );
} 