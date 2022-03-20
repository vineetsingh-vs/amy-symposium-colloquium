import { Request, Response } from "express";

export const getReviews = async (req: Request, res: Response) => {
    res.status(200).send({
        id: "1234",
    });
};
