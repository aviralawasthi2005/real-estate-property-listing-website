import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO?.trim();

const listingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        regularPrice: { type: Number, required: true },
        discountPrice: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        furnished: { type: Boolean, required: true },
        parking: { type: Boolean, required: true },
        type: { type: String, required: true },
        offer: { type: Boolean, required: true },
        imageUrls: { type: Array, required: true },
        userRef: { type: String, required: true },
    },
    { timestamps: true }
);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
}, { timestamps: true });

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

const dummyListings = [
    {
        name: "Sky High Penthouse",
        description: "Ultra-luxury penthouse with 360-degree city skyline views. features a private terrace and smart home integration.",
        address: "777 Skyline Blvd, Chicago, IL",
        regularPrice: 5000000,
        discountPrice: 4500000,
        bathrooms: 5,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
    },
    {
        name: "Coastal Breeze Retreat",
        description: "Wake up to the sound of waves. This beachfront cottage is newly renovated and perfect for summer getaways.",
        address: "22 Coral Way, Malibu, CA",
        regularPrice: 8500,
        discountPrice: 7900,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
    },
    {
        name: "Historic Brick Loft",
        description: "Industrial chic meets comfort. Exposed brick walls, high ceilings, and original hardwood floors.",
        address: "Loft 3B, Old Town, Boston, MA",
        regularPrice: 950000,
        discountPrice: 0,
        bathrooms: 2,
        bedrooms: 2,
        furnished: false,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
    },
    {
        name: "Garden Oasis Apartment",
        description: "A peaceful sanctuary in the heart of the city. Ground floor with large private garden and sunroom.",
        address: "15 Blossom Ln, Portland, OR",
        regularPrice: 2400,
        discountPrice: 2100,
        bathrooms: 1,
        bedrooms: 2,
        furnished: false,
        parking: false,
        type: "rent",
        offer: true,
        imageUrls: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
    }
];

async function seed() {
    if (!MONGO_URI) {
        console.error('MONGO URI is missing in .env');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, { family: 4 });
        console.log('Connected successfully.');

        let user = await User.findOne();
        if (!user) {
            console.log('No user found. Creating a test assistant user...');
            user = await User.create({
                username: 'assistant_demo',
                email: 'demo@realestate.com',
                password: 'demo_password_123',
                avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            });
        }

        const userId = user._id.toString();
        console.log(`Seeding listings for user: ${userId}`);

        const listingsToInsert = dummyListings.map(l => ({ ...l, userRef: userId }));

        await Listing.deleteMany({}); // Optional: clear existing if you want a fresh start
        await Listing.insertMany(listingsToInsert);

        console.log('Dummy properties seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding process failed:', error.message);
        process.exit(1);
    }
}

seed();
