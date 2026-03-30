import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';

export const seedListings = async (req, res, next) => {
    try {
        let user = await User.findOne();
        if (!user) {
            user = await User.create({
                username: 'demo_admin',
                email: 'admin@demo.com',
                password: 'password123',
                avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            });
        }

        const userId = user._id;

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
                userRef: userId
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
                userRef: userId
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
                userRef: userId
            }
        ];

        await Listing.deleteMany({ userRef: userId });
        await Listing.insertMany(dummyListings);

        res.status(200).json('Seed successful!');
    } catch (error) {
        next(error);
    }
};
