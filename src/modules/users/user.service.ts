import { User } from "./user.model.js";
import { UserRole } from "./user.types.js";

export class UserService {
    static async getUserById(userId: string) {
        return User.findById(userId).select("-password");
    }

    static async getAllUsers() {
        return User.find().select("-password");
    }

    static async getUsersByRole(role: UserRole) {
        return User.find({ role }).select("-password");
    }
}