import { Request, Response } from "express";
import { User } from "../entities/User";

// NOTE:
// these are all admin routes, users shouldn't have access to creating new users

export const createUser = async (req: Request, res: Response) => {
    console.log("[userController] createUser");
    const { firstName, lastName, username, email, affiliation, password } = req.body;

    //
    // create user from schema and save to db
    const newUser = User.create({
        username: username,
        firstName: firstName,
        lastName: lastName,
        roles: ["user"],
        email: email,
        password: password,
        affiliation: affiliation,
    });
    await newUser.save();
    console.log("saved user: ");
    console.log(newUser);

    //
    // return the new user as json obj
    res.status(200).json({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        password: newUser.password,
        affiliation: newUser.affiliation,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    });
};

export const getUserList = async (_req: Request, res: Response) => {
    console.log("[userController] getUserList");
    const users = await User.find();
    res.header("Access-Control-Expose-Headers", "Content-Range");
    res.header("Content-Range", "posts 0-20/20");
    res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    console.log("[userController] getUserById");
    const { userID } = req.params;

    //
    // find user based on id
    let user = await User.findOne({ where: { id: userID } });

    //
    // return user obj if found
    if (user) {
        res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
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
};

export const deleteUser = async (req: Request, res: Response) => {
    console.log("[userController] deleteUser");
    const { userID } = req.params;

    //
    // check if user exists
    let user = await User.findOne({ where: { id: userID } });

    if (user) {
        await user.remove();
        res.status(200).json({ message: "Successfully deleted user" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    console.log("[userController] updateUser");
    const { userID } = req.params;
    const { password, firstName, lastName, affiliation, username } = req.body;

    //
    // if user exists, update fields with args from request
    let user = await User.findOne({ where: { id: userID } });
    if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.username = username || user.username;
        user.password = password || user.password;
        user.affiliation = affiliation || user.affiliation;
        await user.save();
        res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
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
};
