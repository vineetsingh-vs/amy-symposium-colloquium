import { Request, Response } from "express";
import { User } from "../entities/User";

export const getUser = async (req: Request, res: Response) => {
    res.status(200).send({
        id: "1234",
        name: "name",
        isAdmin: true,
        emailId: "Test@email.com",
        bio: "Bio",
        tags: [],
    });
};
