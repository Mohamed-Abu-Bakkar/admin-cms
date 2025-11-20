import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  status: 'subscribed' | 'unsubscribed';
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema: Schema<INewsletter> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['subscribed', 'unsubscribed'],
      default: 'subscribed',
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Newsletter: Model<INewsletter> = mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

export default Newsletter;
