import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="container mx-auto py-10" data-testid="table-skeleton">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[120px]" /> {/* Add Todo button */}
          <Skeleton className="h-10 w-10" /> {/* Theme toggle */}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[120px]" /> {/* Status filter */}
          <Skeleton className="h-10 w-[200px]" /> {/* Assignee filter */}
          <Skeleton className="h-10 w-[200px]" /> {/* Search input */}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-[100px] ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px] rounded-full" /> {/* Badge skeleton */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Skeleton className="h-9 w-[70px] inline-block" /> {/* Edit button */}
                  <Skeleton className="h-9 w-[70px] inline-block" /> {/* Delete button */}
                  <Skeleton className="h-9 w-[70px] inline-block" /> {/* Details button */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[100px]" /> {/* Previous button */}
          <Skeleton className="h-10 w-[40px]" /> {/* Page number */}
          <Skeleton className="h-10 w-[40px]" /> {/* Page number */}
          <Skeleton className="h-10 w-[40px]" /> {/* Page number */}
          <Skeleton className="h-10 w-[100px]" /> {/* Next button */}
        </div>
      </div>
    </div>
  );
} 