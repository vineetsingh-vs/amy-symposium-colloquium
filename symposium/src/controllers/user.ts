import { Request, Response } from "express";
import config from "../utils/config";
import { User } from "../entities/User";

// NOTE:
// these are all admin routes, users shouldn't have access to creating new users

export const createUser = async (req: Request, res: Response) => {
    console.log("[userController] createUser");
    const { firstName, lastName, email, affiliation, password } = req.body;

    try {
        let user = await User.findOne({ where: { email: email } });
        
        if (user) {
            res.status(400);
            console.warn("User already exists");
        }
        //
        // create user from schema and save to db
        const newUser = User.create({
            firstName: firstName,
            lastName: lastName,
            roles: ["user"],
            email: email,
            password: password,
            affiliation: affiliation,
        });

        // TODO: create empty many-many relations with papers and reviews

        await newUser.save();
        console.debug("saved user: ");
        console.debug(newUser);

        //
        // return the new user as json obj
        res.status(200).json({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            password: newUser.password,
            affiliation: newUser.affiliation,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        });
    } catch (err) {
        console.error("[userController-createUser] Failed to create User - Database Error", err);
        res.status(500).json({
            message: "Failed to create User - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const getUserList = async (req: Request, res: Response) => {
    console.log("[userController] getUserList");
    const users = await User.find();
    res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    console.log("[userController] getUserById");
    const { userID } = req.params;
    try {
        //
        // find user based on id
        let user = await User.findOne({ where: { id: userID } });

        //
        // return user obj if found
        if (user) {
            res.status(200).json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                affiliation: user.affiliation,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } else {
            res.status(400).json({ message: "Could not find User" });
        }
    } catch (err) {
        console.error("[userController-getUserById] Failed to get User by Id - Database Error", err);
        res.status(500).json({
            message: "Failed to get User by Id - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    console.log("[userController] deleteUser");
    const { userID } = req.params;

    try {
        //
        // check if user exists
        let user = await User.findOne({ where: { id: userID } });

        if (user) {
            await user.remove();
            res.status(200).json({ message: "Successfully deleted user" });
        } else {
            res.status(400).json({ message: "User not found" });
        } 
    } catch (err) {
        console.error("[userController-deleteUser] Failed to delete User - Database Error", err);
        res.status(500).json({
            message: "Failed to delete User - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    console.log("[userController] updateUser");
    const { userID } = req.params;
    const { password, firstName, lastName, affiliation } = req.body;
    
    try {
        //
        // if user exists, update fields with args from request
        let user = await User.findOne({ where: { id: userID } });
        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.password = password || user.password;
            user.affiliation = affiliation || user.affiliation;
            await user.save();
            res.status(200).json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                affiliation: user.affiliation,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("[userController-updateUser] Failed to update User - Database Error", err);
        res.status(500).json({
            message: "Failed to update User - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};
