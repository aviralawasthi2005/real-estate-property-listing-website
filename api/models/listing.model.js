import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['sale', 'rent'],
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'At least one image URL is required.'],
    },
    userRef: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// High-performance search and filtering indexes
listingSchema.index({ type: 1, offer: 1, createdAt: -1 });
listingSchema.index({ name: 'text', address: 'text', description: 'text' });
listingSchema.index({ regularPrice: 1 });
listingSchema.index({ createdAt: -1 });

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

export default Listing;
