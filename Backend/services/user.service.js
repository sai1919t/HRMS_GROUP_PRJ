import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/user.model.js";

export const createUserService = async (fullname, email, password, designation = '') => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(fullname, email, hashedPassword, designation);

    return newUser;
};
