import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WalletSkeleton = () => {
    return (
        <div className="w-full max-w-4xl space-y-6">
            <Card className="shadow-md border dark:border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Wallet Balance</CardTitle>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-32 h-10 mb-2 bg-gray-200 dark:bg-gray-800" />
                </CardContent>
            </Card>

            <Card className="shadow-md border dark:border-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="w-1/4 h-4 bg-gray-200 dark:bg-gray-800" />
                                <Skeleton className="w-1/4 h-4 bg-gray-200 dark:bg-gray-800" />
                                <Skeleton className="w-1/6 h-4 bg-gray-200 dark:bg-gray-800" />
                                <Skeleton className="w-1/6 h-4 bg-gray-200 dark:bg-gray-800" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WalletSkeleton;