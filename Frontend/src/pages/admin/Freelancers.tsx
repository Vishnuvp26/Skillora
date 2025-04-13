import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { blockFreelancer, fetchFreelancers, unblockFreelancer } from "@/api/admin/adminApi";
import dayjs from "dayjs";
import { UserType } from "@/types/Types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";

const Freelancer = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [freelancers, setFreelancers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<UserType | null>(null);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    useEffect(() => {
        const getFreelancers = async () => {
            try {
                const data = await fetchFreelancers();
                setFreelancers(data?.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getFreelancers();
    }, []);

    const toggleFreelancerStatus = async (freelancerId: string, isBlocked: boolean) => {
        try {
            isBlocked ? await unblockFreelancer(freelancerId) : await blockFreelancer(freelancerId);
            setFreelancers(prev =>
                prev.map(f => f._id === freelancerId ? { ...f, status: isBlocked ? "active" : "blocked" } : f)
            );
        } catch (error) {
            console.error("Failed to update freelancer status:", error);
        }
    };

    const handleStatusChange = (freelancer: UserType) => {
        setSelectedFreelancer(freelancer);
        setIsDialogOpen(true);
    };
    
    const filteredFreelancers = freelancers.filter((freelancer) =>
        freelancer.name.toLowerCase().includes(search.toLowerCase())
    );

    const itemsPerPage = 5;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Freelancers</h1>

                    <div className="mb-4 flex items-center justify-between">
                        <Input
                            type="text"
                            placeholder="Search freelancers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300 placeholder:text-xs"
                        />
                    </div>

                    <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-300 dark:bg-zinc-700">
                                    <TableHead className="text-gray-900 dark:text-white">SI No</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Joined At</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredFreelancers.length > 0 ? (
                                    filteredFreelancers.map((freelancer, index) => (
                                        <TableRow key={freelancer._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{freelancer.name}</TableCell>
                                            <TableCell>{freelancer.email}</TableCell>
                                            <TableCell>
                                                {dayjs(freelancer.joinedAt).format("DD MMM YYYY")}
                                            </TableCell>
                                            <TableCell>{freelancer.status}</TableCell>
                                            <TableCell key={freelancer._id} className="text-center">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="inline-block">
                                                                <Switch
                                                                    checked={freelancer.status === "blocked"}
                                                                    onCheckedChange={() => handleStatusChange(freelancer)}
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {freelancer.status === 'active' ? 'Block' : 'Unblock'}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            {selectedFreelancer && (
                                                <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{selectedFreelancer.status === 'active' ? 'Block Freelancer' : 'Unblock Freelancer'}</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to {selectedFreelancer.status === 'active' ? 'block' : 'unblock'} this freelancer?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button
                                                                onClick={() => {
                                                                    toggleFreelancerStatus(selectedFreelancer._id, selectedFreelancer.status === 'blocked');
                                                                    setIsDialogOpen(false);
                                                                }}
                                                                className="btn btn-danger"
                                                            >
                                                                Confirm
                                                            </Button>
                                                            <Button
                                                                onClick={() => setIsDialogOpen(false)}
                                                                className="btn btn-secondary"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                                            No freelancers found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-6 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => prev - 1)}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {[...Array(Math.ceil(freelancers.length / itemsPerPage))].map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                isActive={currentPage === index + 1}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            className={
                                                currentPage === Math.ceil(freelancers.length / itemsPerPage)
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </main>
            </div>
            {!isCollapsed && isMobile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10" onClick={() => setIsCollapsed(true)} />
            )}
        </div>
    );
};

export default Freelancer;