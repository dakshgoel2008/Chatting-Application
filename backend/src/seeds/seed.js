import { config } from "dotenv";
import User from "../models/user.js";
import { connectDB } from "../utils/db.js";

config();

const seedUsers = [
    // Female Users
    {
        email: "emma.thompson@example.com",
        name: "Emma Thompson",
        username: "emma.thompson",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        email: "olivia.miller@example.com",
        name: "Olivia Miller",
        username: "olivia.miller",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        email: "sophia.davis@example.com",
        name: "Sophia Davis",
        username: "sophia.davis",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
        email: "ava.wilson@example.com",
        name: "Ava Wilson",
        username: "ava.wilson",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        email: "isabella.brown@example.com",
        name: "Isabella Brown",
        username: "isabella.brown",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
        email: "mia.johnson@example.com",
        name: "Mia Johnson",
        username: "mia.johnson",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
        email: "charlotte.williams@example.com",
        name: "Charlotte Williams",
        username: "charlotte.williams",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
        email: "amelia.garcia@example.com",
        name: "Amelia Garcia",
        username: "amelia.garcia",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/women/8.jpg",
    },

    // Male Users
    {
        email: "james.anderson@example.com",
        name: "James Anderson",
        username: "james.anderson",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        email: "william.clark@example.com",
        name: "William Clark",
        username: "william.clark",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        email: "benjamin.taylor@example.com",
        name: "Benjamin Taylor",
        username: "benjamin.taylor",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        email: "lucas.moore@example.com",
        name: "Lucas Moore",
        username: "lucas.moore",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
        email: "henry.jackson@example.com",
        name: "Henry Jackson",
        username: "henry.jackson",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        email: "alexander.martin@example.com",
        name: "Alexander Martin",
        username: "alexander.martin",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
        email: "daniel.rodriguez@example.com",
        name: "Daniel Rodriguez",
        username: "daniel.rodriguez",
        password: "123456",
        profileImage: "https://randomuser.me/api/portraits/men/7.jpg",
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();
        await User.insertMany(seedUsers);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Call the function
seedDatabase();
