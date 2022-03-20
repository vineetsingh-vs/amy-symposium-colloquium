import { Request, Response } from "express";

export const getTags = async (req: Request, res: Response) => {
    res.status(200).send({
        id: "1234",
        name: "tag",
    });
};
