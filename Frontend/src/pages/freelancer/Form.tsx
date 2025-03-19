// import { useState, useEffect } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { fetchSkills } from "@/api/admin/skillsApi";
// import { fetchCategories } from "@/api/admin/categoryApi";

// const FreelancerProfileForm = () => {
//     const [formData, setFormData] = useState({
//         title: "",
//         experienceLevel: "",
//         jobCategory: "",
//         skills: [],
//         education: { college: "", course: "" },
//         employmentHistory: [{ company: "", position: "", duration: "" }],
//         city: "",
//     });

//     const [skillsList, setSkillsList] = useState<string[]>([]);
//     const [jobCategories, setJobCategories] = useState<string[]>([]);
//     const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const [skillsResponse, categoriesResponse] = await Promise.all([fetchSkills(), fetchCategories()]);
//                 console.log('FETCHED SKILLS :', skillsResponse);
                
//                 setSkillsList(skillsResponse.data.map((skill: any) => skill.name));
//                 setJobCategories(categoriesResponse.data.map((category: any) => category.name));
                
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };
//         loadData();
//     }, []);
    

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//         setFormData((prev) => ({
//             ...prev,
//             education: { ...prev.education, [field]: e.target.value },
//         }));
//     };

//     const handleEmploymentChange = (index: number, field: string, value: string) => {
//         setFormData((prev) => {
//             const updatedEmployment = [...prev.employmentHistory];
//             updatedEmployment[index] = { ...updatedEmployment[index], [field]: value };
//             return { ...prev, employmentHistory: updatedEmployment };
//         });
//     };

//     const handleSkillChange = (skill: string) => {
//         setSelectedSkills((prev) => {
//             const newSkills = prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill];
//             setFormData((form) => ({ ...form, skills: newSkills }));
//             return newSkills;
//         });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log("Form Submitted:", formData);
//     };

//     return (
//         <Card className="max-w-6xl mx-auto my-10 bg-white dark:bg-gray-950 p-6 rounded-lg border-none">
//             <CardHeader>
//                 <CardTitle className="text-lg font-bold text-center text-gray-900 dark:text-white">Update Profile</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6 w-full">
//                     {/* Title */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">Title</label>
//                         <Input
//                             type="text"
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             className="text-xs placeholder:text-xs"
//                             placeholder="Eg: Freelance web developer using JAVASPassionate about building web applications..."
//                         />
                        
//                     </div>

//                     {/* Experience Level */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">Experience Level</label>
//                         <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select experience level" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="Beginner">Beginner</SelectItem>
//                                 <SelectItem value="Intermediate">Intermediate</SelectItem>
//                                 <SelectItem value="Expert">Expert</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Job Category */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">Job Category</label>
//                         <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, jobCategory: value }))}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select job category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {jobCategories.map((category) => (
//                                     <SelectItem key={category} value={category}>
//                                         {category}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Skills (Checkbox Multi-Select) */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">Skills</label>
//                         <div className="border rounded-lg p-7 flex flex-wrap gap-5">
//                             {skillsList.map((skill) => (
//                                 <div key={skill} className="flex items-center space-x-1">
//                                     <Checkbox
//                                         id={skill}
//                                         checked={selectedSkills.includes(skill)}
//                                         onCheckedChange={() => handleSkillChange(skill)}
//                                         className="w-4 h-4"
//                                     />
//                                     <label htmlFor={skill} className="text-gray-900 dark:text-white text-sm">
//                                         {skill}
//                                     </label>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Selected Skills Display */}
//                         <div className="mt-2 flex flex-wrap gap-2">
//                             {selectedSkills.map((skill) => (
//                                 <span key={skill} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs">
//                                     {skill}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>


//                     {/* Education */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">Education</label>
//                         <div className="flex flex-col sm:flex-row gap-4">
//                             <Input className="text-xs placeholder:text-xs" placeholder="Eg: Cochin university" value={formData.education.college} onChange={(e) => handleEducationChange(e, "college")} />
//                             <Input className="text-xs placeholder:text-xs" placeholder="Course" value={formData.education.course} onChange={(e) => handleEducationChange(e, "course")} />
//                         </div>
//                     </div>

//                     {/* Employment History */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">Employment History</label>
//                         <div className="space-y-4">
//                             {formData.employmentHistory.map((job, index) => (
//                                 <div key={index} className="flex flex-col sm:flex-row gap-4">
//                                     <Input
//                                         className="text-xs placeholder:text-xs"
//                                         placeholder="Company"
//                                         value={job.company}
//                                         onChange={(e) => handleEmploymentChange(index, "company", e.target.value)}
//                                     />
//                                     <Input
//                                         className="text-xs placeholder:text-xs"
//                                         placeholder="Position"
//                                         value={job.position}
//                                         onChange={(e) => handleEmploymentChange(index, "position", e.target.value)}
//                                     />
//                                     <Input
//                                         className="text-xs placeholder:text-xs"
//                                         placeholder="Year"
//                                         value={job.duration}
//                                         onChange={(e) => handleEmploymentChange(index, "duration", e.target.value)}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* City */}
//                     <div>
//                         <label className="text-sm font-semibold text-gray-900 dark:text-white">City</label>
//                         <Input type="text" name="city" value={formData.city} onChange={handleChange} />
//                     </div>

//                     {/* Submit Button */}
//                     <Button type="submit" className="w-full bg-[#0077B6] dark:bg-gray-800 dark:text-white hover:bg-[#005F8C] dark:hover:bg-gray-700">
//                         Save Profile
//                     </Button>
//                 </form>
//             </CardContent>
//         </Card>
//     );
// };

// export default FreelancerProfileForm;