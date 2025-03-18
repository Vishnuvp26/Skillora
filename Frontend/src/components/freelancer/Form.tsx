import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchSkills } from "@/api/admin/skillsApi";
import { fetchCategories } from "@/api/admin/categoryApi";
import { FreelancerProfileFormProps, ISkill, IJobCategory } from "@/types/Types";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { updateProfile } from "@/api/freelancer/profileApi";
import toast from "react-hot-toast";

const FreelancerProfileForm: React.FC<FreelancerProfileFormProps> = ({ profile, onUpdate }) => {

    const userId = useSelector((state: RootState) => state.user._id);

    const [formData, setFormData] = useState({
        title: profile?.title || "",
        firstName: profile?.firstName,
        bio: profile?.bio || "",
        experienceLevel: profile?.experienceLevel || "",
        jobCategory: profile?.jobCategory?._id || "",
        skills: profile?.skills || [],
        education: profile?.education || { college: "", course: "" },
        employmentHistory: profile?.employmentHistory || [{ company: "", position: "", duration: "" }],
        socialLinks: profile?.linkedAccounts || { github: "", linkedIn: "", website: "" },
        city: profile?.city || "",
        language: profile?.language || [],
    });
    
    console.log('FORMDATA CATEGORY', formData.jobCategory);
    console.log('FORMDATA SKILL', formData.skills);

    const [skillsList, setSkillsList] = useState<ISkill[]>([]);
    const [jobCategories, setJobCategories] = useState<IJobCategory[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(formData.skills?.map(skill => skill._id || "") || []);
    const [languageInput, setLanguageInput] = useState("")

    useEffect(() => {
        const loadData = async () => {
            try {
                const [skillsResponse, categoriesResponse] = await Promise.all([fetchSkills(), fetchCategories()]);
                console.log('FETCHED SKILLS :', skillsResponse);
                setSkillsList(skillsResponse.data);
                setJobCategories(categoriesResponse.data);[]
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData((prev) => ({
            ...prev,
            education: { ...prev.education, [field]: e.target.value },
        }));
    };

    const handleEmploymentChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updatedEmployment = [...prev.employmentHistory];
            updatedEmployment[index] = { ...updatedEmployment[index], [field]: value };
            return { ...prev, employmentHistory: updatedEmployment };
        });
    };

    const handleSkillChange = (skillId: string) => {
        setSelectedSkills((prev) => {
            const newSkills = prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId];
            setFormData((form) => ({ ...form, skills: newSkills.map(id => skillsList.find(skill => skill._id === id)!) }));
            return newSkills;
        });
    };

    const handleLanguageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLanguageInput(e.target.value);
    };

    const handleAddLanguage = () => {
        if (languageInput && !formData.language.includes(languageInput)) {
            setFormData((prev) => ({
                ...prev,
                language: [...prev.language, languageInput],
            }));
            setLanguageInput("");
        }
    };

    const handleRemoveLanguage = (language: string) => {
        setFormData((prev) => ({
            ...prev,
            language: prev.language.filter((l) => l !== language),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Title is required!");
            return;
        }
        if (!formData.jobCategory) {
            toast.error("Job category is required!");
            return;
        }
        if (selectedSkills.length === 0) {
            toast.error("At least one skill is required!");
            return;
        }
        if (!formData.city.trim()) {
            toast.error("City is required!");
            return;
        }

        try {
            const updatedData = await updateProfile(userId, formData);
            console.log("Profile updated successfully:", updatedData);
            toast.success('Profile updted successfully')
            onUpdate?.(updatedData.data);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Card className="max-w-6xl mx-auto my-10 bg-white dark:bg-gray-950 rounded-lg border-none">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-center text-gray-900 dark:text-white">Update Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                        <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="text-xs placeholder:text-xs"
                        />
                    </div>
                    {/* Title */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Title</label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="text-xs placeholder:text-xs"
                            placeholder="Eg: Freelance web developer Passionate about building web applications..."
                        />
                    </div>
                    {/* Bio */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Bio</label>
                        <Input
                            type="text"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="text-xs placeholder:text-xs"
                            placeholder="Eg: Tell us about yourself"
                        />
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Experience Level</label>
                        <Select value={formData.experienceLevel} onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Job Category */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Job Category *</label>
                        <Select value={formData.jobCategory} onValueChange={(value) => setFormData((prev) => ({ ...prev, jobCategory: value }))}>
                            <SelectTrigger>
                                <SelectValue>{jobCategories.find(category => category._id === formData.jobCategory)?.name || "Select job category"}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {jobCategories.map((category) => (
                                    <SelectItem key={category._id} value={category._id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Skills (Checkbox Multi-Select) */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Skills *</label>
                        <div className="border rounded-lg p-7 flex flex-wrap gap-5">
                            {skillsList.map((skill) => (
                                <div key={skill._id} className="flex items-center space-x-1">
                                    <Checkbox
                                        id={skill._id}
                                        checked={selectedSkills.includes(skill._id!)}
                                        onCheckedChange={() => handleSkillChange(skill._id!)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor={skill._id} className="text-gray-900 dark:text-white text-sm">
                                        {skill.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Selected Skills Display */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedSkills.map((skillId) => (
                                <span key={skillId} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs">
                                    {skillsList.find(skill => skill._id === skillId)?.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Education</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input className="text-xs placeholder:text-xs" placeholder="Eg: Cochin university" value={formData.education.college} onChange={(e) => handleEducationChange(e, "college")} />
                            <Input className="text-xs placeholder:text-xs" placeholder="Course" value={formData.education.course} onChange={(e) => handleEducationChange(e, "course")} />
                        </div>
                    </div>

                    {/* Employment History */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Employment History</label>
                        <div className="space-y-4">
                            {formData.employmentHistory.map((job, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-4">
                                    <Input
                                        className="text-xs placeholder:text-xs"
                                        placeholder="Company"
                                        value={job.company}
                                        onChange={(e) => handleEmploymentChange(index, "company", e.target.value)}
                                    />
                                    <Input
                                        className="text-xs placeholder:text-xs"
                                        placeholder="Position"
                                        value={job.position}
                                        onChange={(e) => handleEmploymentChange(index, "position", e.target.value)}
                                    />
                                    <Input
                                        className="text-xs placeholder:text-xs"
                                        placeholder="Year"
                                        value={job.duration}
                                        onChange={(e) => handleEmploymentChange(index, "duration", e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* City */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">City *</label>
                        <Input type="text" name="city" value={formData.city} onChange={handleChange} />
                    </div>

                    {/* Languages (Input and Display) */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Languages</label>
                        <div className="flex gap-3">
                            <Input
                                type="text"
                                value={languageInput}
                                onChange={handleLanguageInputChange}
                                className="text-xs placeholder:text-xs"
                                placeholder="Type a language and press Add"
                            />
                            <Button type="button" onClick={handleAddLanguage} className="bg-[#0077B6] dark:bg-gray-800 dark:text-white hover:bg-[#005F8C] dark:hover:bg-gray-700">
                                Add
                            </Button>
                        </div>

                        {/* Selected Languages Display */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.language.map((language) => (
                                <span key={language} className="bg-emerald-600 text-white px-3 py-1 rounded-md text-xs flex items-center">
                                    {language}
                                    <button type="button" onClick={() => handleRemoveLanguage(language)} className="ml-2 text-gray-300">x</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">Social Links</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input className="text-xs placeholder:text-xs" placeholder="GitHub" value={formData.socialLinks.github} onChange={(e) => setFormData((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, github: e.target.value } }))} />
                            <Input className="text-xs placeholder:text-xs" placeholder="LinkedIn" value={formData.socialLinks.linkedIn} onChange={(e) => setFormData((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedIn: e.target.value } }))} />
                            <Input className="text-xs placeholder:text-xs" placeholder="Website" value={formData.socialLinks.website} onChange={(e) => setFormData((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, website: e.target.value } }))} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-[#0077B6] dark:bg-gray-800 dark:text-white hover:bg-[#005F8C] dark:hover:bg-gray-700">
                        Save Profile
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default FreelancerProfileForm;