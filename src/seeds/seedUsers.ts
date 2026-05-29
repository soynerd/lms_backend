import bcrypt from "bcrypt";

import { connectDB } from "../config/db.js";
import { User } from "../modules/users/user.model.js";
import { UserRole } from "../modules/users/user.types.js";

const seedUsers = async () => {
    try {
        await connectDB();

        await User.deleteMany({
            role: {
                $ne: UserRole.BORROWER,
            },
        });

        const password = await bcrypt.hash(
            "Password@123",
            10
        );

        const users = [
            {
                name: "Admin",
                email: "admin@test.com",
                password,
                role: UserRole.ADMIN,
            },
            {
                name: "Sales",
                email: "sales@test.com",
                password,
                role: UserRole.SALES,
            },
            {
                name: "Sanction",
                email: "sanction@test.com",
                password,
                role: UserRole.SANCTION,
            },
            {
                name: "Disbursement",
                email: "disbursement@test.com",
                password,
                role: UserRole.DISBURSEMENT,
            },
            {
                name: "Collection",
                email: "collection@test.com",
                password,
                role: UserRole.COLLECTION,
            },
        ];

        await User.insertMany(users);

        console.log("Users seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();