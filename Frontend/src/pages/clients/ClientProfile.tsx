// import { fetchMyJobs } from "@/api/client/jobApi";
// import { fetchProfile } from "@/api/client/profileApi";
// import { uploadProfileImage } from "@/api/client/profileApi";
// import ClientNav from "@/components/client/ClientNav";
// import ClientForm from "@/components/client/Form";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { RootState } from "@/redux/store/store";
// import { IClient, Job } from "@/types/Types";
// import dayjs from "dayjs";
// import { ChevronDown, ClipboardListIcon, Mail, MapPin } from "lucide-react";
// import { useEffect, useState } from "react";
// import { BiSolidBadgeCheck } from "react-icons/bi";
// import { IoLocationOutline } from "react-icons/io5";
// import { useSelector } from "react-redux";

// const ClientProfile = () => {
//     const userEmail = useSelector((state: RootState) => state.user?.email);
//     const userId = useSelector((state: RootState) => state.user?._id)

//     const [isEditing, setIsEditing] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [profile, setProfile] = useState<IClient | null>(null);
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [visibleJobs, setVisibleJobs] = useState(5);
//     const [loading, setLoading] = useState(true);
//     const [totalJobs, setTotalJobs] = useState(0);
//     const [showFullDescription, setShowFullDescription] = useState(false);

//     useEffect(() => {
//         const getProfile = async () => {
//             if (!userId) return;
//             try {
//                 const response = await fetchProfile(userId)
//                 setProfile(response.data)
//             } catch (error) {
//                 console.log('Error fetching client profile', error);
//             }
//         }
//         getProfile()
//     }, [userId]);

//     const handleProfileUpdate = (updatedProfile: IClient) => {
//         setProfile(updatedProfile);
//         setIsEditing(false)
//     }

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file || !userId) return;
//         try {
//             setIsUploading(true)
//             await uploadProfileImage(userId, file)
//             const response = await fetchProfile(userId)
//             setProfile(response.data)
//             e.target.value = ""
//         } catch (error) {
//             console.log("Error uploading image :", error)
//         } finally {
//             setIsUploading(false)
//         }
//     };
    
//     useEffect(() => {
//         const getMyJobs = async () => {
//             try {
//                 const response = await fetchMyJobs(userId);
//                 setTotalJobs(response.jobs.length)
//                 const sortedJobs = (response.jobs || []).sort(
//                     (a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//                 );
//                 setJobs(sortedJobs);
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getMyJobs();
//     }, [userId]);

//     return (
//         <div className="min-h-screen dark:bg-gray-950 flex justify-center p-6">
//             <ClientNav />
//             <div className="w-full max-w-6xl bg-white dark:bg-gray-950 rounded-xl border border-gray-300 dark:border-gray-800 p-8 mt-16 flex flex-col md:flex-row">
//                 <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800 p-6">
//                     <div className="flex flex-col items-center">
//                         <div className="relative group">
//                             {isUploading ? (
//                                 <div className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077B6] dark:border-cyan-400"></div>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <img
//                                         src={profile?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                                         alt="Profile"
//                                         className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
//                                     />
//                                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         <span
//                                             className="text-white text-sm font-medium cursor-pointer"
//                                             onClick={() => document.getElementById('fileInput')?.click()}
//                                         >
//                                             Edit
//                                         </span>
//                                         <input
//                                             type="file"
//                                             id="fileInput"
//                                             className="hidden"
//                                             accept="image/png, image/jpeg, image/jpg, image/webp"
//                                             onChange={(e) => handleFileChange(e)}
//                                         />
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                         <div className="mt-4 text-center">
//                             <div className="flex items-center gap-2">
//                                 <h2 className="text-3xl font-bold text-black dark:text-white">
//                                     {profile?.firstName}
//                                 </h2>
//                                 <BiSolidBadgeCheck className="w-5 h-5 mt-1 text-blue-600" />
//                             </div>

//                             <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 mt-2">
//                                 <IoLocationOutline className="text-xl" /> {profile?.city}
//                             </p>
//                             <Button
//                                 onClick={() => setIsEditing(!isEditing)}
//                                 className="mt-4 border border-[#0077B6] text-[#0077B6] bg-transparent 
//                                 hover:bg-[#0077B611] hover:text-[#0077B6] 
//                                 dark:border-[#00FFE5] dark:text-[#00FFE5] dark:hover:bg-[#00FFE511] dark:hover:text-[#00FFE5]"
//                             >
//                                 {isEditing ? "Cancel" : "Edit Profile"}
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//                 {isEditing ? (
//                     <ClientForm profile={profile} onUpdate={handleProfileUpdate} />
//                 ) : (
//                     <>
//                         <div className="w-full md:w-2/3 p-6">
//                             <div className="space-y-7 text-black dark:text-white">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="font-semibold font-sans">Email</h3>
//                                         <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
//                                     </div>
//                                     <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="font-semibold font-sans">State</h3>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             {profile?.state || "No state provided"}
//                                         </p>
//                                     </div>
//                                     <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="font-semibold font-sans">Works Posted</h3>
//                                         <p className="text-gray-600 dark:text-gray-400">{totalJobs}</p>
//                                     </div>
//                                     <ClipboardListIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                                 </div>
//                             </div>

//                             {/* Posted Jobs Section */}
//                             {loading ? (
//                                 <div className="space-y-4 mt-10 w-full max-w-full px-0 sm:px-4">
//                                     {Array.from({ length: 3 }).map((_, i) => (
//                                         <div key={i} className="border border-gray-300 dark:border-gray-700 p-3 sm:p-4 rounded-xl mb-4">
//                                             <Skeleton className="h-5 w-1/3 mb-2" />
//                                             <Skeleton className="h-4 w-2/3 mb-1" />
//                                             <Skeleton className="h-4 w-full mb-1" />
//                                             <Skeleton className="h-4 w-1/2" />
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="mt-10 w-full max-w-full px-0 sm:px-4">
//                                     <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Posted Works</h3>

//                                     {jobs.slice(0, visibleJobs).map((job) => (
//                                         <div key={job._id} className="border border-gray-300 dark:border-gray-700 p-3 sm:p-4 rounded-xl mb-4 w-full overflow-hidden">
//                                             <h4 className="text-base font-semibold text-black dark:text-white">{job.title}</h4>
//                                             <p className="text-gray-600 text-sm dark:text-gray-400 mb-1">
//                                                 <span className="font-semibold text-sm">Category:</span> {job.category.name}
//                                             </p>
//                                             <p className="text-gray-600 text-sm dark:text-gray-400 mb-1">
//                                                 <span className="font-semibold">Description:</span>{" "}
//                                                 {showFullDescription
//                                                     ? job.description
//                                                     : `${job.description.slice(0, 20)}${job.description.length > 20 ? "..." : ""}`}
//                                                 {job.description.length > 20 && (
//                                                     <button
//                                                         onClick={() => setShowFullDescription(!showFullDescription)}
//                                                         className="text-blue-600 ml-2 underline text-xs"
//                                                     >
//                                                         {showFullDescription ? "View less" : "View more"}
//                                                     </button>
//                                                 )}
//                                             </p>
//                                             <p className="text-gray-600 text-sm dark:text-gray-400 mb-1">
//                                                 <span className="font-semibold">Posted on:</span> {dayjs(job.createdAt).format('MMM D, YYYY h:mm A')}
//                                             </p>
//                                         </div>
//                                     ))}

//                                     {jobs.length > visibleJobs && (
//                                         <p
//                                             onClick={() => setVisibleJobs((prev) => prev + 5)}
//                                             className="mt-4 text-blue-950 px-4 py-2 flex items-center gap-2
//                                         dark:bg-transparent dark:text-[#00FFE5] self-center cursor-pointer"
//                                         >
//                                             View More
//                                             <ChevronDown className="w-4 h-4" />
//                                         </p>
//                                     )}
//                                 </div>
//                             )}

//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ClientProfile;