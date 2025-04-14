import { fetchProfile } from "@/api/client/profileApi";
import { uploadProfileImage } from "@/api/client/profileApi";
import ClientNav from "@/components/client/ClientNav";
import ClientForm from "@/components/client/Form";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store/store";
import { IClient } from "@/types/Types";
import { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const ClientProfile = () => {
    const userEmail = useSelector((state: RootState) => state.user.email);
    const userId = useSelector((state: RootState) => state.user._id)

    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profile, setProfile] = useState<IClient | null>(null);

    useEffect(() => {
        const getProfile = async () => {
            if (!userId) return;
            try {
                const response = await fetchProfile(userId)
                console.log('Api response :', response)
                setProfile(response.data)
            } catch (error) {
                console.log('Error fetching client profile', error);
            }
        }
        getProfile()
    }, [userId]);

    const handleProfileUpdate = (updatedProfile: IClient) => {
        setProfile(updatedProfile);
        setIsEditing(false)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log('selected file...', file)
        if (!file || !userId) return;
        try {
            setIsUploading(true)
            await uploadProfileImage(userId, file)
            const response = await fetchProfile(userId)
            setProfile(response.data)
            e.target.value = ""
        } catch (error) {
            console.log("Error uploading image :", error)
        } finally {
            setIsUploading(false)
        }
    };

    return (
        <div className="min-h-screen dark:bg-gray-950 flex justify-center p-6">
            <ClientNav />
            <div className="w-full max-w-6xl bg-white dark:bg-gray-950 rounded-xl border border-gray-300 dark:border-gray-800 p-8 mt-16 flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800 p-6">
                    <div className="flex flex-col items-center">
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
                                        className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
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
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold text-black dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">{profile?.firstName}</h2>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 mt-2">
                                <IoLocationOutline className="text-xl" /> {profile?.city}
                            </p>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-4 border border-[#0077B6] text-[#0077B6] bg-transparent 
                                hover:bg-[#0077B611] hover:text-[#0077B6] 
                                dark:border-[#00FFE5] dark:text-[#00FFE5] dark:hover:bg-[#00FFE511] dark:hover:text-[#00FFE5]"
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                        </div>
                    </div>
                </div>
                {isEditing ? (
                    <ClientForm profile={profile} onUpdate={handleProfileUpdate} />
                ) : (
                    <>
                        <div className="w-full md:w-2/3 p-6">
                            <div className="space-y-7 text-black dark:text-white">
                                <div>
                                    <h3 className="font-semibold font-sans">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
                                </div>
                                {/* <div>
                                    <h3 className="font-semibold font-sans">City</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{profile?.city || 'No city provided'}</p>
                                </div> */}
                                <div>
                                    <h3 className="font-semibold font-sans">State</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{profile?.state || "No state provided"}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold font-sans">Jobs Posted</h3>
                                    <p className="text-gray-600 dark:text-gray-400">0</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientProfile;