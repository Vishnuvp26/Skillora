import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  contractId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  rating: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const ReviewSchema: Schema = new Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    description: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;