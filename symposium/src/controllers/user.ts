import { Request, Response } from "express";
import asynchHandler from "express-async-handler";
import { User } from "../entities/User";

// NOTE:
// these are all admin routes, users shouldn't have access to these
// users are also created when a user signs up

export const createUser = asynchHandler(async (req: Request, res: Response) => {
    console.log("[userController] createUser");
    console.log(req.body);
    const { name, username, email, affiliation, password } = req.body;
    const [firstName, lastName] = name.split(" ");

    //
    // create user from schema and save to db
    const newUser = User.create({
        username: username,
        firstName: firstName,
        lastName: lastName,
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
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        password: newUser.password,
        affiliation: newUser.affiliation,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    });
});

export const getUserList = async (req: Request, res: Response) => {
    console.log("[userController] getUserList");
    const users = await User.find();
    res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    console.log("[userController] getUserById");
    const { userID } = req.params;

    //
    // find user based on id, email or username
    let user = await User.findOne({ where: { id: userID } });

    //
    // return user obj if found
    if (user) {
        res.status(200).json({
            id: user.id,
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
        User.delete(user);
        res.status(200).json({ message: "Successfully deleted user" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    console.log("[userController] updateUser");
    const { userID, password, name, affiliation, username } = req.body;

    //
    // if user exists, update fields with args from request
    let user = await User.findOne({ where: { id: userID } });
    if (user) {
        if (name) {
            let [firstName, lastName] = name.split(" ");
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
        }
        user.username = username || user.username;
        if (password) {
            user.password = password;
        }
        user.affiliation = affiliation || user.affiliation;
        res.status(200).json({
            id: user.id,
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
