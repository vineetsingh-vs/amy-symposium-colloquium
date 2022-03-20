import { Request, Response } from "express";
import { User } from "../entities/User";

// NOTE:
// these are all admin routes, users shouldn't have access to these
// users are also created when a user signs up
export const createUser = async (req: Request, res: Response) => {
    console.log("[userController] get user");
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
};

export const getUser = async (req: Request, res: Response) => {
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
