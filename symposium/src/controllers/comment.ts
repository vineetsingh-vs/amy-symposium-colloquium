import { Request, Response } from "express";

export const getComments = async (req: Request, res: Response) => {
    res.status(200).send({
        id: "1234",
        content: "content",
    });
};
