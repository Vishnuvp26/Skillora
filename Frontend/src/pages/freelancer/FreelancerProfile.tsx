import { Button } from "@/components/ui/button";
import { TfiPencil } from "react-icons/tfi";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import FreelancerProfileForm from "../../components/freelancer/Form";
import { useEffect, useState } from "react";
import { IContract, IFreelancer, Review } from "@/types/Types";
import { getProfile, uploadProfileImage } from "@/api/freelancer/profileApi";
import { getCompletedWorks } from "@/api/freelancer/contractApi";
import { getFreelancerReviews } from "@/api/client/reviewApi";
import { Star } from "lucide-react";

const FreelancerProfile = () => {
    const userEmail = useSelector((state: RootState) => state.user.email);
    const userId = useSelector((state: RootState) => state.user._id);

    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profile, setProfile] = useState<IFreelancer | null>(null);
    const [completedWorks, setCompletedWorks] = useState<IContract[]>([]);

    const [expanded, setExpanded] = useState<string | null>(null);
    const descriptionLimit = 50;

    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            try {
                const response = await getProfile(userId)
                setProfile(response.data)
            } catch (error) {
                console.log('Error fetching profile :', error)
            }
        }
        fetchProfile()
    }, [userId]);

    useEffect(() => {
        const fetchCompletedWorks = async () => {
            if (!userId) return;
            try {
                const response = await getCompletedWorks(userId);
                setCompletedWorks(response.contracts || []);
            } catch (error) {
                console.error("Error fetching completed works:", error);
            }
        };
    
        fetchCompletedWorks();
    }, [userId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getFreelancerReviews(userId);
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
    
        fetchReviews();
    }, [userId]);

    const handleProfileUpdate = (updatedProfile: IFreelancer) => {
        setProfile(updatedProfile);
        setIsEditing(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log('File selected :', file)
        if (!file || !userId) return;
        
        try {
            setIsUploading(true);
            await uploadProfileImage(userId, file);
            const response = await getProfile(userId);
            setProfile(response.data);
            e.target.value = "";
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false)
        }
    };

    return (
        <div className="min-h-screen dark:bg-gray-950 flex justify-center p-6 mt-5">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-950 rounded-xl border border-gray-300 dark:border-gray-800 p-8 mt-16">
                {/* SECTION 1 */}
                <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start">
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute top-0 right-0 sm:hidden bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent dark:text-white p-2 flex items-center gap-2"
                    >
                        {isEditing ? (
                            <span className="dark:text-white text-blue-700">Cancel</span>
                        ) : (
                            <TfiPencil className="w-5 h-5 dark:text-white text-blue-700 bg-none shadow-none" />
                        )}
                    </Button>

                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative group">
                            {isUploading ? (
                                <div className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077B6] dark:border-cyan-400"></div>
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={profile?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt="Profile"
                                        className="w-28 aspect-square rounded-full border border-gray-300 dark:border-gray-700 object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span
                                            className="text-white text-sm font-medium cursor-pointer"
                                            onClick={() => document.getElementById('fileInput')?.click()}
                                        >
                                            Edit
                                        </span>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Name & Location */}
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
                                {profile?.firstName}
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-2">
                                <IoLocationOutline className="text-xl" /> {profile?.city || 'No city provided'}
                            </p>
                        </div>
                    </div>

                    {/* Default Button for Larger Screens */}
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="mt-4 md:mt-0 hidden sm:block">
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                </div>

                <hr className="my-6 border-gray-300 dark:border-gray-900" />

                {isEditing ? (
                    <FreelancerProfileForm profile={profile} onUpdate={handleProfileUpdate} />
                ) : (
                    <>
                        {/* FLEX GRID WITH VERTICAL LINE */}
                        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_auto_1.6fr] gap-6">
                            {/* Left Side - Personal Info */}
                            <div className="space-y-7 text-black dark:text-white">
                                <div>
                                    <h3 className="font-semibold font-sans">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold font-sans">Education</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{profile?.education.college || 'No education provided'}, {profile?.education.course}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold font-sans">Experience Level</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{profile?.experienceLevel || 'No experience provided'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold font-sans">Job category</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{profile?.jobCategory?.name || 'No category provided'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold font-sans">Languages</h3>
                                    {profile?.language && profile.language.length > 0 ? (
                                        profile.language.map((lang, index) => (
                                            <p key={index} className="text-gray-600 dark:text-gray-400">
                                                {lang}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400">No languages specified</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold font-sans">Linked Accounts</h3>
                                    <div className="flex flex-col gap-3 mt-2">
                                        {profile?.linkedAccounts?.github && (
                                            <Button
                                                variant="outline"
                                                className="w-48 flex items-center justify-center gap-2"
                                                onClick={() => window.open(profile.linkedAccounts.github, '_blank')}
                                            >
                                                <SiGithub className="w-6 h-6" />
                                                GitHub
                                            </Button>
                                        )}
    
                                        {profile?.linkedAccounts?.linkedIn && (
                                            <Button
                                                variant="outline"
                                                className="w-48 flex items-center justify-center gap-2"
                                                onClick={() => window.open(profile.linkedAccounts.linkedIn, '_blank')}
                                            >
                                                <FaLinkedin className="w-6 h-6" />
                                                LinkedIn
                                            </Button>
                                        )}
    
                                        {profile?.linkedAccounts?.website && (
                                            <Button
                                                variant="outline"
                                                className="w-48 flex items-center justify-center gap-2"
                                                onClick={() => window.open(profile.linkedAccounts.website, '_blank')}
                                            >
                                                <LuGlobe className="w-6 h-6" />
                                                Website
                                            </Button>
                                        )}
    
                                        {!profile?.linkedAccounts?.github && !profile?.linkedAccounts?.linkedIn && !profile?.linkedAccounts?.website && (
                                            <p className="text-gray-600 dark:text-gray-400">No social links provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-px bg-gray-300 dark:bg-gray-900"></div>

                            {/* Right Side - Summary, Portfolio, and Skills */}
                            <div>
                                <h2 className="text-2xl font-bold text-black dark:text-white">
                                    {profile?.title || 'No title provided'}
                                </h2>
                                <p className="mt-8 text-gray-600 dark:text-gray-400">
                                    {profile?.bio || 'No bio provided'}
                                </p>

                                {/* SKILLS */}
                                <hr className="my-6 border-gray-300 dark:border-gray-900" />
                                <h2 className="text-xl font-bold text-black dark:text-white mt-6">Skills</h2>
                                <div className="flex flex-wrap gap-4 mt-3">
                                    {profile?.skills.map(skill => (
                                        <div key={skill._id} className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-3xl text-black dark:text-white font-semibold text-sm">
                                            {skill.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-300 dark:border-gray-900" />
                        {/* EMPLOYMENT HISTORY */}
                        <div>
                            <h2 className="text-2xl font-bold text-black dark:text-white">Employment History</h2>
                            <div className="space-y-6 mt-4 text-black dark:text-white">
                                {profile?.employmentHistory && profile.employmentHistory.length > 0 ? (
                                    profile.employmentHistory.map((job, index) => (
                                        <div key={job._id || index}>
                                            <div>
                                                <h3 className="font-semibold font-sans">{job.company}</h3>
                                                <p className="text-gray-600 dark:text-gray-400">{job.position}</p>
                                                <p className="text-gray-600 dark:text-gray-400">{job.duration}</p>
                                            </div>
                                            {index < profile.employmentHistory.length - 1 && (
                                                <hr className="border-gray-300 dark:border-gray-900 mt-6" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">No employment history provided</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-4">Completed Works ({completedWorks.length})</h2>
                            {completedWorks.length === 0 ? (
                                <p className="text-gray-500">No completed works yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {completedWorks.map((contract) => (
                                        <div key={contract._id} className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-900">
                                            <h3 className="text-lg font-semibold text-primary">{contract.jobId.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {expanded === contract._id
                                                    ? contract.jobId.description
                                                    : `${contract.jobId.description.slice(0, descriptionLimit)}${contract.jobId.description.length > descriptionLimit ? '...' : ''}`
                                                }
                                                {contract.jobId.description.length > descriptionLimit && (
                                                    <span
                                                        onClick={() => setExpanded(expanded === contract._id ? null : contract._id)}
                                                        className="ml-2 text-blue-500 cursor-pointer hover:underline text-xs"
                                                    >
                                                        {expanded === contract._id ? "View Less" : "View More"}
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm mt-1">
                                                <span className="font-medium">Client : </span> {contract.clientId.name} ({contract.clientId.email})
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Budget : </span> &#8377;{contract.jobId.rate}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Work status : </span>{contract.status}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-4">Client Reviews</h2>

                            {reviews.length === 0 ? (
                                <p className="text-gray-500">No reviews yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="border p-4 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3 mb-2">
                                                <img
                                                    src={
                                                        "https://www.w3schools.com/howto/img_avatar.png"
                                                    }
                                                    alt={review.clientId.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="font-medium">{review.clientId.name}</span>
                                            </div>

                                            <div className="flex gap-1 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(review.rating) ? "text-yellow-500" : "text-gray-300"}`}
                                                        fill={i < Math.floor(review.rating) ? "#facc15" : "none"}
                                                    />
                                                ))}
                                                {review.rating % 1 !== 0 && (
                                                    <Star className="w-4 h-4 text-yellow-400" fill="url(#half)" />
                                                )}
                                            </div>

                                            <p className="text-sm dark:text-gray-300 text-gray-700">{review.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FreelancerProfile;