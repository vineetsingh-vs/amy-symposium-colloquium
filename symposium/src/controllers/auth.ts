import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import config from "../utils/config";

export const signUp = async (req: Request, res: Response) => {
    console.log("[authController] signUp");
    const { firstName, lastName, email, affiliation, password } = req.body;

    //
    // TODO: validate
    if (!firstName || !lastName || !email || !affiliation || !password) {
        res.status(400).json({ message: "invalid data" });
    }

    let user = await User.findOne({ where: { email: email } });

    if (user) {
        console.warn("User already exists");
        res.status(400).json({ message: "User with email already exists" });
    } else {
        //
        // encrypt password with salt
        const salt = await bcrypt.genSalt(10);
        const salted_password = await bcrypt.hash(password, salt);
        try {
            const newUser = User.create({
                firstName: firstName,
                lastName: lastName,
                roles: ["user"],
                email: email,
                password: salted_password,
                affiliation: affiliation,
            });

            // TODO: create empty many-many relations with papers and reviews before saving

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
            console.error("[authController] Failed to create User - Database Error", err);
            res.status(500).json({
                message: "Failed to create User - Database Error",
                stack: config.nodeEnv === "production" ? null : err.stack
            })
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
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
        res.status(401).json({ message: "Invalid email or password" });
    }
};

export const loginCas = async (req: Request, res: Response) => {
    res.status(200).send({ body: "Login CAS", access_token: "test" });
};

export const loginSocial = async (req: Request, res: Response) => {
    res.status(200).send({ body: "Login Social", access_token: "test" });
};
