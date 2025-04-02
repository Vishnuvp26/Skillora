import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updateJob, jobDetails } from "@/api/client/jobApi";
import toast from "react-hot-toast";
import { fetchSkills } from "@/api/admin/skillsApi";
import { fetchCategories } from "@/api/admin/categoryApi";
import { useNavigate, useParams } from "react-router-dom";

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [skillsList, setSkillsList] = useState<{ id: string; name: string }[]>([]);
    const [categoryList, setCategoryList] = useState<{ id: string; name: string }[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const userId = useSelector((state: RootState) => state.user._id);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        rate: "",
        experienceLevel: "",
        status: "",
        location: "",
        category: "",
    });

    useEffect(() => {
        const loadJobDetails = async () => {
            try {
                const response = await jobDetails(id!);
                const job = response.data;
                setFormData({
                    title: job.title,
                    description: job.description,
                    rate: job.rate.toString(),
                    experienceLevel: job.experienceLevel,
                    status: job.status,
                    location: job.location,
                    category: job.category._id,
                });
                setSelectedSkills(job.skills.map((skill: any) => skill._id));
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };

        const loadSkillsAndCategories = async () => {
            try {
                const [skillsResponse, categoryResponse] = await Promise.all([fetchSkills(), fetchCategories()]);
                setSkillsList(skillsResponse.data.map((skill: any) => ({ id: skill._id, name: skill.name })));
                setCategoryList(categoryResponse.data.map((category: any) => ({ id: category._id, name: category.name })));
            } catch (error) {
                console.error("Error fetching skills or categories:", error);
            }
        };

        loadJobDetails();
        loadSkillsAndCategories();
    }, [id]);

    const handleSkillChange = (skillId: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const jobData = {
            userId,
            title: formData.title,
            description: formData.description,
            rate: Number(formData.rate),
            experienceLevel: formData.experienceLevel,
            status: formData.status,
            location: formData.location,
            category: formData.category,
            skills: selectedSkills,
        };
        try {
            const response = await updateJob(id!, jobData);
            console.log("Job updated successfully:", response);
            toast.success("Job updated successfully!");
            setTimeout(() => navigate(-1), 1000);
        } catch (error: any) {
            console.error("Error updating job:", error);
            toast.error(error.error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10 bg-white dark:bg-gray-950 p-6 rounded-lg border-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                    Edit Your Job
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Title</label>
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
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Description</label>
                        <Input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="text-xs placeholder:text-gray-500 mt-1.5 h-16 border border-gray-400 dark:border-gray-800"
                            placeholder="Eg: Looking for a designer experienced in Figma"
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Budget</label>
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
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Experience Level</label>
                        <Select onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })} value={formData.experienceLevel}>
                            <SelectTrigger className="border-gray-400 dark:border-gray-800 h-11 mt-1.5">
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
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Job Status</label>
                        <Select onValueChange={(value) => setFormData({ ...formData, status: value })} value={formData.status}>
                            <SelectTrigger className="border-gray-400 dark:border-gray-800 h-11 mt-1.5">
                                <SelectValue placeholder="Select job status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-5">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Location</label>
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
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Job Category</label>
                        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} value={formData.category}>
                            <SelectTrigger className="text-sm placeholder:text-gray-500 mt-1.5 h-11 border border-gray-400 dark:border-gray-800">
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
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Skills Required</label>
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
                    {/* Action Buttons */}
                    <div className="flex justify-center md:justify-end gap-3 mt-8">
                        <Button onClick={() => window.history.back()}
                            type="button" className="border border-[#DC2626] text-[#DC2626] bg-transparent hover:bg-[#DC262611]">
                            Cancel
                        </Button>
                        <Button type="submit" className="border border-[#0077B6] text-[#0077B6] bg-transparent hover:bg-[#0077B611]">
                            Update
                        </Button>
                    </div>
                </form>
            </CardContent>
        </div>
    );
};

export default EditJob;