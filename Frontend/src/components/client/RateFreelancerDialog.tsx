import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { reviewFreelancer } from "@/api/client/reviewApi";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

interface RateFreelancerDialogProps {
    clientId: string;
    contractId: string;
    freelancerId: string;
    disabled?: boolean;
    onSuccess?: () => void; 
};

export const RateFreelancerDialog: React.FC<RateFreelancerDialogProps> = ({
    clientId,
    contractId,
    freelancerId,
    disabled,
    onSuccess
}) => {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        await reviewFreelancer({ clientId, contractId, freelancerId, rating, description });
        toast.success("Review submitted successfully");
        if (onSuccess) {
            onSuccess();
        };
        setOpen(false);
        setRating(0);
        setDescription("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="mt-3 border border-[#0077B6] text-[#0077B6] bg-transparent 
                    hover:bg-[#0077B611] hover:text-[#0077B6] 
                    dark:border-[#00FFE5] dark:text-[#00FFE5] dark:hover:bg-[#00FFE511] dark:hover:text-[#00FFE5]"
                    disabled={disabled}
                    variant="default"
                >
                    Rate Freelancer
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] max-w-sm sm:max-w-md mx-auto rounded-lg">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                </DialogHeader>

                <div className="flex gap-1 justify-center mb-4">
                    {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        return (
                            <Star
                                key={i}
                                className={`w-6 h-6 cursor-pointer transition-colors ${starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-400"
                                    }`}
                                onMouseEnter={() => setHover(starValue)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(starValue)}
                                fill={starValue <= rating ? "#facc15" : "none"}
                            />
                        );
                    })}
                </div>

                <Textarea
                    placeholder="Write a review..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <DialogFooter className="mt-4">
                    <Button onClick={handleSubmit} disabled={rating === 0 || !description}>
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};