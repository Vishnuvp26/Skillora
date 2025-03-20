import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { addSkills, editSkills, fetchSkills, listSkills, unlistSkills } from "@/api/admin/skillsApi";
import { validateSkill } from "@/utils/validation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Skills = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [skills, setSkills] = useState<{ _id: string; name: string; isListed: boolean }[]>([]);
    const [newSkills, setNewSkills] = useState("");
    const [editSkillsData, setEditSkillsData] = useState<{ id: string; name: string }>({ id: "", name: "" });
    const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
    
    const itemsPerPage = 5;

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const response = await fetchSkills();
            console.log("Fetched skills:", response);
            setSkills(response.data);
        } catch (error) {
            console.log('Failed to fetch skills :', error);
        }
    };

    const handleAddSkills = async () => {
        const { valid, errors } = validateSkill(newSkills);
    
        if (!valid) {
            setError(errors.skill || "");
            setTimeout(() => setError(""), 3000);
            return;
        }
    
        try {
            await addSkills({ name: newSkills });
            toast.success("Skill added successfully!");
            setNewSkills("");
            setIsDialogOpen(false);
            loadSkills();
        } catch (error: any) {
            setError(error.error || "Failed to add skill");
            setTimeout(() => setError(""), 3000);
        }
    };

    const toggleActive = async (SkillId: string, isListed: boolean) => {
        try {
            if (isListed) {
                await unlistSkills(SkillId);
            } else {
                await listSkills(SkillId);
            }
            setSkills((prev) =>
                prev.map((sk) =>
                    sk._id === SkillId ? { ...sk, isListed: !isListed } : sk
                )
            );
        } catch (error) {
            console.error("Failed to toggle skill status", error);
        }
    };
    
    const handleEdit = async () => {
        const { valid, errors } = validateSkill(editSkillsData.name);
    
        if (!valid) {
            setError(errors.skill || "");
            setTimeout(() => setError(""), 3000);
            return;
        }
    
        try {
            await editSkills(editSkillsData.id, { name: editSkillsData.name });
            toast.success("Skill updated successfully!");
    
            setSkills((prev) =>
                prev.map((skill) =>
                    skill._id === editSkillsData.id ? { ...skill, name: editSkillsData.name } : skill
                )
            );
    
            setEditingSkillId(null);
        } catch (error: any) {
            setError(error.error || "Failed to update skill");
            setTimeout(() => setError(""), 3000);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Skills</h1>

                    {/* Search & Add skill Button */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Search skills..."
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
                                <Button className="bg-emerald-500 text-white hover:bg-emerald-600">Add Skill</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Skill</DialogTitle>
                                    <DialogDescription>
                                        Add the skill name and save changes.
                                    </DialogDescription>
                                </DialogHeader>
                                <Input
                                    type="text"
                                    placeholder="Enter skill name..."
                                    value={newSkills}
                                    onChange={(e) => setNewSkills(e.target.value)}
                                    className="mt-2"
                                />
                                <DialogFooter>
                                    {error && <p className="text-red-500 text-sm mt-3 mr-10">{error}</p>}
                                    <Button className="mt-4" onClick={handleAddSkills}>
                                        Save
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
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">Skill Name</TableHead>
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">Actions</TableHead>
                                    <TableHead className="w-1/4 text-center text-gray-900 dark:text-white">Edit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {skills.length > 0 ? (
                                    skills
                                        .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((skill, index) => (
                                            <TableRow key={skill._id}>
                                                <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                                <TableCell className="text-center">{skill.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <div className="inline-block">
                                                                    <Switch
                                                                        checked={skill.isListed}
                                                                        onCheckedChange={() => toggleActive(skill._id, skill.isListed)}
                                                                    />
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {skill.isListed ? 'Make it inactive' : 'Make it active'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Dialog
                                                        open={editingSkillId === skill._id}
                                                        onOpenChange={(open) => {
                                                            if (!open) setEditingSkillId(null);
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                className="mt-2 bg-slate-600 text-white text-xs px-3 py-1 hover:bg-slate-700"
                                                                onClick={() => {
                                                                    setEditingSkillId(skill._id);
                                                                    setEditSkillsData({ id: skill._id, name: skill.name });
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Skill</DialogTitle>
                                                                <DialogDescription>
                                                                    Update the skill name and save changes.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <Input
                                                                value={editSkillsData.name}
                                                                onChange={(e) => setEditSkillsData({ ...editSkillsData, name: e.target.value })}
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
                                            No skills found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {[...Array(Math.ceil(skills.length / itemsPerPage))].map((_, index) => (
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
                                            currentPage === Math.ceil(skills.length / itemsPerPage)
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

export default Skills;