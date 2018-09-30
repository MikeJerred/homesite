import * as mongoose from 'mongoose';

export interface IDmPortfolio extends mongoose.Document {
    portfolioId: number;
    prevPortfolio: IDmPortfolio;
    nextPortfolio: IDmPortfolio;
    headline: string;
    updatedDate: Date;
    markdown: string;
}

export default mongoose.model<IDmPortfolio>('Portfolio', new mongoose.Schema({
    portfolioId: { type: Number, required: true, unique: true },
    prevPortfolio: { type: Number, ref: 'Portfolio' },
    nextPortfolio: { type: Number, ref: 'Portfolio' },
    headline: String,
    updatedDate: { type: Date, default: new Date() },
    markdown: String
}), 'Portfolio');
