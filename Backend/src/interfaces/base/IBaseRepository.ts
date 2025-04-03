import { Document, FilterQuery, QueryOptions } from "mongoose";

export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    findOne(query: FilterQuery<T>): Promise<T | null>;
    find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
    findByIdAndUpdate(id: string, data: Partial<T>): Promise<T | null>;
    findByIdAndDelete(id: string): Promise<T | null>;
    findByEmail(email: string): Promise<T | null>;
    updateOne(filter: object, updateData: object): Promise<void>
};