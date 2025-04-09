import { Skeleton } from "@/components/ui/skeleton";

const UserListSkeleton = () => {
    return (
        <div className="p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center space-x-3 p-3 rounded-lg"
                >
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserListSkeleton;