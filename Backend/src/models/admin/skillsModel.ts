import mongoose, { Schema, Document } from "mongoose";

export interface ISkills extends Document {
    name: string
    isListed: boolean
}

const SkillsSchema: Schema = new Schema<ISkills>(
    {
        name: {
            type: String,
            required: true
        },
        isListed: {
            type: Boolean,
            default: true
        }
    },
    {timestamps: true}
)

const Skills = mongoose.model<ISkills>('Skills', SkillsSchema);
export default Skills