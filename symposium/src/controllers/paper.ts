import { Request, Response } from "express";

export const getPapers = async (req: Request, res: Response) => {
    let ao = [];
    ao.push({
        id: "1",
        title: "Title",
        url: "www.google.com",
        creator: "Creator",
        authors: [{ name: "Author", id: "1" }],
        tags: [],
        reviews: [],
    });
    res.status(200).send(ao);
};
