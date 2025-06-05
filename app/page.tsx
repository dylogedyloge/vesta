
import TaskTable from "@/components/TaskTable";

export default function Home() {
  return (

    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <TaskTable />
    </main>
  );
}
