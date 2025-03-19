import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ClientProfileFormTypes } from "@/types/Types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useState } from "react";
import { updateProfile } from "@/api/client/profileApi";
import toast from "react-hot-toast";
import { validateClientForm } from "@/utils/validation";

const ClientForm: React.FC<ClientProfileFormTypes> = ({ profile, onUpdate }) => {
    
    const userId = useSelector((state: RootState) => state.user._id);

    const [formData, setFormData] = useState({
        firstName: profile?.firstName || "",
        city: profile?.city || "",
        state: profile?.state || "",
    });

    const [error, setError] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateClientForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        try {
            const updatedData = await updateProfile(userId, formData)
            toast.success("Profile updated successfully!");
            onUpdate?.(updatedData.data)
        } catch (error) {
            console.error('Error updatinf profile', error)
        }
    };

    return (
        <div className="w-full sm:w-5/6 md:w-2/3 p-6 mx-auto">
            <Card className="w-full border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-center text-gray-900 dark:text-white">Update Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                            <Input
                                type="text"
                                className="w-full text-xs placeholder:text-xs"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {error.firstName && <p className="text-sm text-red-500 mt-1">{error.firstName}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">City</label>
                            <Input
                                type="text"
                                className="w-full text-xs placeholder:text-xs"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            {error.city && <p className="text-sm text-red-500 mt-1">{error.city}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">State</label>
                            <Input
                                type="text"
                                className="w-full text-xs placeholder:text-xs"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                            {error.state && <p className="text-sm text-red-500 mt-1">{error.state}</p>}
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-[#0077B6] dark:bg-gray-900 dark:text-white">Save</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};

export default ClientForm;