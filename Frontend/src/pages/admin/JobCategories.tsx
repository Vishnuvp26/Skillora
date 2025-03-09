import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { addCategory, editCategory, fetchCategories, listCategory, unlistCategory } from "@/api/admin/categoryApi";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Category } from "@/types/Types";

const JobCategories = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [editCategoryData, setEditCategoryData] = useState<{ id: string; name: string }>({ id: "", name: "" });
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const itemsPerPage = 5;

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await fetchCategories();
            setCategories(response.data);
        } catch (error) {
            console.log('Failed to fetch categories :', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return toast.error("Category name is required");
        try {
            await addCategory({ name: newCategory });
            toast.success("Category added successfully!");
            setNewCategory("");
            setIsDialogOpen(false);
            loadCategories();
        } catch (error: any) {
            setError(error.error || 'Failed to add category')
            setTimeout(() => {
                setError('')
            }, 3000);
        }
    };

    const toggleActive = async (categoryId: string, isListed: boolean) => {
        try {
            if (isListed) {
                await unlistCategory(categoryId);
            } else {
                await listCategory(categoryId);
            }
            setCategories((prev) =>
                prev.map((cat) =>
                    cat._id === categoryId ? { ...cat, isListed: !isListed } : cat
                )
            );
        } catch (error) {
            console.error("Failed to toggle category status", error);
        }
    };
    
    const handleEdit = async () => {
        if (!editCategoryData.name.trim()) return toast.error("Category name is required");
        try {
            await editCategory(editCategoryData.id, { name: editCategoryData.name });
            toast.success("Category updated successfully!");
    
            setCategories((prev) =>
                prev.map((cat) =>
                    cat._id === editCategoryData.id ? { ...cat, name: editCategoryData.name } : cat
                )
            );
    
            setEditingCategoryId(null);
        } catch (error: any) {
            setError(error.error || 'Failed to add category')
            setTimeout(() => {
                setError('')
            }, 3000);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Job Categories</h1>

                    {/* Search & Add Category Button */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300 placeholder:text-xs pr-10"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    x
                                </button>
                            )}
                        </div>
                        
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-500 text-white hover:bg-emerald-600">Add Category</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Category</DialogTitle>
                                    <DialogDescription>
                                        Add the category name and save changes.
                                    </DialogDescription>
                                </DialogHeader>
                                <Input
                                    type="text"
                                    placeholder="Enter category name..."
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="mt-2"
                                />
                                <DialogFooter>
                                    {error && <p className="text-red-500 text-sm mt-3 mr-10">{error}</p>}
                                    <Button className="mt-4" onClick={handleAddCategory}>
                                        Save Category
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Table */}
                    <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-300 dark:bg-zinc-700">
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">SI No</TableHead>
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">Category Name</TableHead>
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">Actions</TableHead>
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">Edit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories
                                        .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((category, index) => (
                                            <TableRow key={category._id}>
                                                <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                                <TableCell className="text-center">{category.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <div className="inline-block">
                                                                    <Switch
                                                                        checked={category.isListed}
                                                                        onCheckedChange={() => toggleActive(category._id, category.isListed)}
                                                                    />
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {category.isListed ? 'Make it inactive' : 'Make it active'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Dialog
                                                        open={editingCategoryId === category._id}
                                                        onOpenChange={(open) => {
                                                            if (!open) setEditingCategoryId(null);
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                className="mt-2 bg-slate-600 text-white text-xs px-3 py-1 hover:bg-slate-700"
                                                                onClick={() => {
                                                                    setEditingCategoryId(category._id);
                                                                    setEditCategoryData({ id: category._id, name: category.name });
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Category</DialogTitle>
                                                                <DialogDescription>
                                                                    Update the category name and save changes.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <Input
                                                                value={editCategoryData.name}
                                                                onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
                                                            />
                                                            <DialogFooter>
                                                                {error && <p className="text-red-500 text-sm mt-3 mr-10">{error}</p>}
                                                                <Button className="mt-2" onClick={handleEdit}>
                                                                    Save Changes
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                                            No categories found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {[...Array(Math.ceil(categories.length / itemsPerPage))].map((_, index) => (
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
                                            currentPage === Math.ceil(categories.length / itemsPerPage)
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>

                </main>
            </div>
            {!isCollapsed && isMobile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10" onClick={() => setIsCollapsed(true)} />
            )}
        </div>
    );
};

export default JobCategories;