import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { blockClient, fetchClients, unblockClient } from "@/api/admin/adminApi";
import dayjs from "dayjs";
import { UserType } from "@/types/Types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";

const Clients = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [clients, setClients] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectClient, setselectClient] = useState<UserType | null>(null);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    useEffect(() => {
        const getClients = async () => {
            try {
                const data = await fetchClients();
                setClients(data?.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getClients();
    }, []);

    const toggleClientStatus = async (clientId: string, isBlocked: boolean) => {
        try {
            isBlocked ? await unblockClient(clientId) : await blockClient(clientId);
            setClients(prev =>
                prev.map(f => f._id === clientId ? { ...f, status: isBlocked ? "active" : "blocked" } : f)
            );
        } catch (error) {
            console.error("Failed to update client status:", error);
        }
    };

    const handleStatusChange = (freelancer: UserType) => {
        setselectClient(freelancer);
        setIsDialogOpen(true);
    };
    
    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(search.toLowerCase())
    );

    const itemsPerPage = 5;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Clients</h1>

                    <div className="mb-4 flex items-center justify-between">
                        <Input
                            type="text"
                            placeholder="Search clients..."
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
                                ) : filteredClients.length > 0 ? (
                                    filteredClients.map((client, index) => (
                                        <TableRow key={client._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{client.name}</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>
                                                {dayjs(client.createdAt).format("DD MMM YYYY")}
                                            </TableCell>
                                            <TableCell>{client.status}</TableCell>
                                            <TableCell key={client._id} className="text-center">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="inline-block">
                                                                <Switch
                                                                    checked={client.status === "blocked"}
                                                                    onCheckedChange={() => handleStatusChange(client)}
                                                                />

                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {client.status == 'active' ? 'Block' : 'Unblock'}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            {selectClient && (
                                                <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{selectClient.status === 'active' ? 'Block Freelancer' : 'Unblock Freelancer'}</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to {selectClient.status === 'active' ? 'block' : 'unblock'} this freelancer?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button
                                                                onClick={() => {
                                                                    toggleClientStatus(selectClient._id, selectClient.status === 'blocked');
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
                                            No clients found.
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

                                    {[...Array(Math.ceil(clients.length / itemsPerPage))].map((_, index) => (
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
                                                currentPage === Math.ceil(clients.length / itemsPerPage)
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

export default Clients;