import { Request, Response } from "express";

export const getAllPapers = async (req: Request, res: Response) => {
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

export const getPaperById = async(req: Request, res: Response) => {};

export const getPaperVersionById = async(req: Request, res: Response) => {};

export const addPaper = async(req: Request, res: Response) => {};

export const updatePaper = async(req: Request, res: Response) => {};

export const deletePaper = async(req: Request, res: Response) => {};

export const deletePaperVersion = async(req: Request, res: Response) => {};