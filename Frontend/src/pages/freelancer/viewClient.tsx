// import { fetchMyJobs } from "@/api/client/jobApi";
// import { fetchProfile } from "@/api/client/profileApi";
// import ClientNav from "@/components/client/ClientNav";
// import { Skeleton } from "@/components/ui/skeleton";
// import { IClient, Job } from "@/types/Types";
// import dayjs from "dayjs";
// import { ChevronDown } from "lucide-react";
// import { useEffect, useState } from "react";
// import { BiSolidBadgeCheck } from "react-icons/bi";
// import { IoLocationOutline } from "react-icons/io5";
// import { useParams } from "react-router-dom";

// const ViewClient = () => {
//     const { clientId } = useParams();

//     const [profile, setProfile] = useState<IClient | null>(null);
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [visibleJobs, setVisibleJobs] = useState(5);
//     const [loading, setLoading] = useState(true);
//     const [totalJobs, setTotalJobs] = useState(0);
//     const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

//     useEffect(() => {
//         const getProfile = async () => {
//             if (!clientId) return;
//             try {
//                 const response = await fetchProfile(clientId)
//                 setProfile(response.data)
//             } catch (error) {
//                 console.log('Error fetching client profile', error);
//             }
//         }
//         getProfile()
//     }, [clientId]);

//     useEffect(() => {
//         const getMyJobs = async () => {
//             if (!clientId) return;
//             try {
//                 const response = await fetchMyJobs(clientId);
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
//     }, [clientId]);

//     return (
//         <div className="min-h-screen dark:bg-gray-950 flex justify-center p-6">
//             <ClientNav />
//             <div className="w-full max-w-6xl bg-white dark:bg-gray-950 rounded-xl border border-gray-300 dark:border-gray-800 p-8 mt-16 flex flex-col md:flex-row">
//                 <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800 p-6">
//                     <div className="flex flex-col items-center">
//                         <div className="relative group">
//                             <img
//                                 src={profile?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                                 alt="Profile"
//                                 className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
//                             />
//                         </div>
//                         <div className="mt-4 text-center">
//                             <div className="flex items-center gap-2">
//                                 <h2 className="text-3xl font-bold text-black dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
//                                     {profile?.firstName}
//                                 </h2>
//                                 <BiSolidBadgeCheck className="w-5 h-5 mt-1 text-blue-600" />
//                             </div>

//                             <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 mt-2">
//                                 <IoLocationOutline className="text-xl" /> {profile?.city}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="w-full md:w-2/3 p-6">
//                         <div className="space-y-7 text-black dark:text-white">
//                             <div>
//                                 <h3 className="font-semibold font-sans">Email</h3>
//                                 <p className="text-gray-600 dark:text-gray-400">{profile?.userId.email}</p>
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold font-sans">State</h3>
//                                 <p className="text-gray-600 dark:text-gray-400">{profile?.state || "No state provided"}</p>
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold font-sans">Works Posted</h3>
//                                 <p className="text-gray-600 dark:text-gray-400">{totalJobs}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Posted Jobs Section */}
//                 {loading ? (
//                     <div className="space-y-4 mt-10 w-full max-w-full px-0 sm:px-4">
//                         {Array.from({ length: 3 }).map((_, i) => (
//                             <div key={i} className="border border-gray-300 dark:border-gray-700 p-3 sm:p-4 rounded-xl mb-4">
//                                 <Skeleton className="h-5 w-1/3 mb-2" />
//                                 <Skeleton className="h-4 w-2/3 mb-1" />
//                                 <Skeleton className="h-4 w-full mb-1" />
//                                 <Skeleton className="h-4 w-1/2" />
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="mt-10 w-10/12 px-0 sm:px-4">
//                         <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Posted Works</h3>

//                         {jobs.slice(0, visibleJobs).map((job) => (
//                             <div key={job._id} className="border border-gray-300 dark:border-gray-700 p-3 sm:p-4 rounded-xl mb-4 w-full overflow-hidden">
//                                 <h4 className="text-base font-semibold text-black dark:text-white">{job.title}</h4>
//                                 <p className="text-gray-600 text-sm dark:text-gray-400 mb-1">
//                                     <span className="font-semibold text-sm">Category:</span> {job.category.name}
//                                 </p>
//                                 <p className="text-gray-600 text-sm dark:text-gray-400 mb-1">
//                                     <span className="font-semibold">Description:</span>{" "}
//                                     {expandedJobId === job._id
//                                         ? job.description
//                                         : `${job.description.slice(0, 20)}${job.description.length > 20 ? "..." : ""}`}
//                                     {job.description.length > 20 && (
//                                         <button
//                                             onClick={() =>
//                                                 setExpandedJobId(expandedJobId === job._id ? null : job._id)
//                                             }
//                                             className="text-blue-600 ml-2 underline text-xs"
//                                         >
//                                             {expandedJobId === job._id ? "View less" : "View more"}
//                                         </button>
//                                     )}
//                                 </p>
//                                 <p className="text-gray-600 text-sm dark:text-gray-400 mb-1">
//                                     <span className="font-semibold">Posted on:</span> {dayjs(job.createdAt).format('MMM D, YYYY h:mm A')}
//                                 </p>
//                             </div>
//                         ))}

//                         {jobs.length > visibleJobs && (
//                             <p
//                                 onClick={() => setVisibleJobs((prev) => prev + 5)}
//                                 className="mt-4 text-blue-950 px-4 py-2 flex items-center gap-2
//                                         dark:bg-transparent dark:text-[#00FFE5] self-center cursor-pointer"
//                             >
//                                 View More
//                                 <ChevronDown className="w-4 h-4" />
//                             </p>
//                         )}
//                     </div>
//                 )}
//             </div>
            
//         </div>
//     );
// };

// export default ViewClient;