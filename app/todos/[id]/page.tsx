import { Suspense } from "react";
import type { Metadata } from "next";
import TodoDetail from "@/components/TodoDetail";
import { getTodoById } from "@/app/actions/todos";
import { getUserById } from "@/app/actions/users";

// Enable revalidation every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TodoDetailPage({ params }: PageProps) {
  // Fetch data on the server
  const [todoResult, userResult] = await Promise.all([
    getTodoById(params.id),
    // We can only get the user after we have the todo
    getTodoById(params.id).then(async (result) => {
      if (result.data) {
        return getUserById(result.data.userId);
      }
      return { data: null, error: null };
    }),
  ]);

  const initialData = {
    todo: todoResult.data || null,
    user: userResult.data || null,
    error: todoResult.error || userResult.error || null,
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoDetail id={params.id} initialData={initialData} />
    </Suspense>
  );
}
