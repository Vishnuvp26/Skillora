import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createJob } from "@/api/client/jobApi";
import toast from "react-hot-toast";
import { fetchSkills } from "@/api/admin/skillsApi";
import { fetchCategories } from "@/api/admin/categoryApi";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const PostJob = () => {

    const [skillsList, setSkillsList] = useState<{ id: string; name: string }[]>([]);
    const [categoryList, setCategoryList] = useState<{ id: string; name: string }[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const userId = useSelector((state: RootState) => state.user._id);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        rate: "",
        experienceLevel: "",
        location: "",
        category: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        const loadSkills = async () => {
            try {
                const [skillsResponse, categoryResponce] = await Promise.all([fetchSkills(), fetchCategories()])
                console.log('FETCHED SKILLS :', skillsResponse);
                console.log('FETCHED CATEGORY :', categoryResponce);
                setSkillsList(skillsResponse.data.map((skill: any) => ({ id: skill._id, name: skill.name })));
                setCategoryList(categoryResponce.data.map((category: any) => ({ id: category._id, name: category.name })));
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };
        loadSkills();
    }, []);

    const handleSkillChange = (skillId: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const jobData = {
            userId,
            title: formData.title,
            description: formData.description,
            rate: Number(formData.rate),
            experienceLevel: formData.experienceLevel,
            location: formData.location,
            category: formData.category,
            skills: selectedSkills,
            startDate: formData.startDate ? new Date(formData.startDate) : undefined,
            endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        };
        console.log("Submitting job data:", jobData);
        try {
            const response = await createJob(userId, jobData)
            console.log("Job posted successfully:", response);
            toast.success("Job posted successfully!");
            setTimeout(() => navigate("/client/home"), 2000);
        } catch (error: any) {
            console.error("Error posting job:", error);
            toast.error(error.error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10 bg-white dark:bg-gray-950 p-6 rounded-lg border-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                    Post Your Job
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Title *</label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="text-xs placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800"
                            placeholder="Eg: Graphic Designer"
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Description *</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="text-xs placeholder:text-gray-500 mt-1.5 h-16 border border-gray-400 dark:border-gray-800"
                            placeholder="Eg: Looking for a designer experienced in Figma"
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Budget *</label>
                        <Input
                            type="number"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            min="0"
                            className="text-xs placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800"
                            placeholder="Eg: Type your price in numbers"
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Experience Level *</label>
                        <Select onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                            <SelectTrigger className="border-gray-400 dark:border-gray-800 h-11 mt-1.5" >
                                <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Location *</label>
                        <Input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="text-xs placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800"
                            placeholder="Eg: Kerala, Remote, etc."
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Job Category *</label>
                        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                            <SelectTrigger className="text-xs placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800">
                                <SelectValue placeholder="Select job category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryList.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Skills Selection */}
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Skills Required *</label>
                        <div className="border rounded-lg p-7 flex flex-wrap gap-5 mt-1.5 border-gray-400 dark:border-gray-800">
                            {skillsList.map((skill) => (
                                <div key={skill.id} className="flex items-center space-x-1">
                                    <Checkbox
                                        id={skill.id}
                                        checked={selectedSkills.includes(skill.id)}
                                        onCheckedChange={() => handleSkillChange(skill.id)}
                                    />
                                    <label htmlFor={skill.id} className="text-sm cursor-pointer">
                                        {skill.name}
                                    </label>
                                </div>
                            ))}

                        </div>
                        {/* Display Selected Skills */}
                        {selectedSkills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedSkills.map((skillId) => {
                                    const skillName = skillsList.find((s) => s.id === skillId)?.name || "Unknown Skill";
                                    return (
                                        <span key={skillId} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs">
                                            {skillName}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Start Date and End Date */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">
                                Start Date <span className="text-gray-500 text-sm">(optional)</span>
                            </label>
                            <Input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="text-xs placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">
                                End Date <span className="text-gray-500 text-sm">(optional)</span>
                            </label>
                            <Input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="text-xs placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800"
                            />
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-center md:justify-end gap-3 mt-8">
                        <Button onClick={() => window.history.back()}
                            type="button" className="border border-[#DC2626] text-[#DC2626] bg-transparent hover:bg-[#DC262611]">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`border border-[#0077B6] text-[#0077B6] bg-transparent hover:bg-[#0077B611] flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>

                    </div>
                </form>
            </CardContent>
        </div>
    );
};

export default PostJob;