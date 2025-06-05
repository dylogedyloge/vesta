import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-4 w-[250px]" /></TableHead>
          <TableHead><Skeleton className="h-4 w-[100px]" /></TableHead>
          <TableHead><Skeleton className="h-4 w-[150px]" /></TableHead>
          <TableHead><Skeleton className="h-4 w-[120px]" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
            <TableCell className="space-x-2">
              <Skeleton className="h-8 w-16 inline-block" />
              <Skeleton className="h-8 w-16 inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 