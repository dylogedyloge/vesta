import { Suspense } from "react";
import type { Metadata } from "next";
import TodoDetail from "@/components/TodoDetail";
import { getTodoById } from "@/app/actions/todos";
import { getUserById } from "@/app/actions/users";

// Enable revalidation every 60 seconds
export const revalidate = 60;

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const todoResult = await getTodoById(params.id);
  const title = todoResult.data?.title || "Todo Details";

  return {
    title,
    description: `Details for todo: ${title}`,
  };
}

// This is a Server Component
export default async function TodoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch data on the server
  const todoResult = await getTodoById(params.id);
  const userResult = todoResult.data
    ? await getUserById(todoResult.data.userId)
    : { data: null, error: null };

  const initialData = {
    todo: todoResult.data || null,
    user: userResult.data || null,
    error: todoResult.error || userResult.error || null,
  };

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <TodoDetail id={params.id} initialData={initialData} />
    </Suspense>
  );
}
