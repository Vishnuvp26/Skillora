import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

interface ContractTableSkeletonProps {
  rows?: number;
  columns?: number;
}

const COLUMN_WIDTHS = [
  "w-6",   
  "w-24",  
  "w-36",  
  "w-28",  
  "w-16",  
  "w-14", 
  "w-12",  
  "w-20",  
];

export const TableSkeleton = ({ rows = 5, columns = 8 }: ContractTableSkeletonProps) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <TableCell className="text-center" key={`cell-${rowIndex}-${colIndex}`}>
                            <Skeleton
                                className={`h-4 ${COLUMN_WIDTHS[colIndex] || "w-24"} mx-auto ${colIndex === columns - 1 ? "h-8 rounded-md" : ""
                                    }`}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};