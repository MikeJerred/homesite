import * as mongoose from 'mongoose';

export interface IDmBlog extends mongoose.Document {
    blogId: number;
    headline: string;
    updatedDate: Date;
    markdown: string;
}

export default mongoose.model<IDmBlog>('Blog', new mongoose.Schema({
    blogId: { type: Number, required: true, unique: true },
    headline: String,
    updatedDate: { type: Date, default: new Date() },
    markdown: String
}), 'Blog');
