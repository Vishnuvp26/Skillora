import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const Freelancer = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof Freelancer | "">("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const itemsPerPage = 5;

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    type Freelancer = {
        id: number;
        name: string;
        email: string;
        joined: string;
        active: boolean;
    };

    const [freelancers, setFreelancers] = useState<Freelancer[]>([
        { id: 1, name: "John Doe", email: "john@example.com", joined: "2024-01-10", active: true },
        { id: 2, name: "Jane Smith", email: "jane@example.com", joined: "2024-02-05", active: false },
        { id: 3, name: "Alice Johnson", email: "alice@example.com", joined: "2023-12-15", active: true },
        { id: 4, name: "Bob Brown", email: "bob@example.com", joined: "2024-01-20", active: false },
        { id: 5, name: "Charlie White", email: "charlie@example.com", joined: "2024-02-10", active: true },
        { id: 6, name: "David Black", email: "david@example.com", joined: "2024-02-12", active: true },
    ]);

    const filteredClients = freelancers.filter(freelancer =>
        freelancer.name.toLowerCase().includes(search.toLowerCase()) ||
        freelancer.email.toLowerCase().includes(search.toLowerCase())
    );

    const sortedFreelancers = [...filteredClients].sort((a, b) => {
        if (!sortField) return 0;
        const valA = a[sortField];
        const valB = b[sortField];
    
        return typeof valA === "string" && typeof valB === "string"
            ? (sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA))
            : 0;
    });
    
    const totalPages = Math.ceil(sortedFreelancers.length / itemsPerPage);
    const paginatedClients = sortedFreelancers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleActive = (id: number) => {
        setFreelancers(prev =>
            prev.map(client => client.id === id ? { ...client, active: !client.active } : client)
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Freelancers</h1>

                    {/* Search & Sort Controls */}
                    <div className="mb-4 flex items-center justify-between">
                        <Input
                            type="text"
                            placeholder="Search freelancers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300 placeholder:text-xs"
                        />

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <Select onValueChange={value => setSortField(value as keyof Freelancer | "")} value={sortField}>
                                <SelectTrigger className="w-40 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-zinc-800">
                                    <SelectItem value="none" className="text-gray-900 dark:text-gray-300">None</SelectItem>
                                    <SelectItem value="id" className="text-gray-900 dark:text-gray-300">SI No</SelectItem>
                                    <SelectItem value="name" className="text-gray-900 dark:text-gray-300">Name</SelectItem>
                                    <SelectItem value="email" className="text-gray-900 dark:text-gray-300">Email</SelectItem>
                                    <SelectItem value="joined" className="text-gray-900 dark:text-gray-300">Joined</SelectItem>
                                </SelectContent>
                            </Select>


                            <Select onValueChange={value => setSortOrder(value as "asc" | "desc")} defaultValue="asc">
                                <SelectTrigger className="w-32 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300">
                                    <SelectValue placeholder="Order" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-zinc-800">
                                    <SelectItem value="asc" className="text-gray-900 dark:text-gray-300">Ascending</SelectItem>
                                    <SelectItem value="desc" className="text-gray-900 dark:text-gray-300">Descending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-300 dark:bg-zinc-700">
                                    <TableHead className="text-gray-900 dark:text-white">SI No</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Joined</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedClients.length > 0 ? (
                                    paginatedClients.map((client, index) => (
                                        <TableRow key={client.id} className="border-b border-gray-200 dark:border-zinc-600">
                                            <TableCell className="text-gray-900 dark:text-gray-300">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-300">{client.name}</TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-300">{client.email}</TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-300">{client.joined}</TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="inline-block">
                                                                <Switch
                                                                    checked={client.active}
                                                                    onCheckedChange={() => toggleActive(client.id)}
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Block/Unblock
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                                            No clients found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <Button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="bg-emerald-500 text-white disabled:opacity-50"
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-900 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="bg-emerald-500 text-white disabled:opacity-50"
                        >
                            Next
                        </Button>
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