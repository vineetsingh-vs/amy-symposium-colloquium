import { Request, Response } from "express";
import { Paper } from "../models/Paper"

export const getAllPapers = async (req: Request, res: Response) => {
    console.log("[paperController] getAllPapers");
    const papers = await Paper.find();
    res.status(200).send(papers);
};

export const getPaperById = async(req: Request, res: Response) => {};

export const getPaperVersionById = async(req: Request, res: Response) => {};

export const addPaper = async(req: Request, res: Response) => {

    console.log("[paperController] addPaper");
    console.log(req.body);

    const { title, creator_id, filepath, authors, tags, revisions } = req.body;

    const newPaper = Paper.create({
        title: title,
        creator_id: creator_id,
        filepath: filepath,
        authors: authors,
        tags: tags,
        revisions: revisions,
    });

    await newPaper.save();
    console.log("saved paper: ");
    console.log(newPaper);

    res.status(200).json({
        id: newPaper.id,
        title: newPaper.title,
        creator_id: newPaper.creator_id,
        filepath: newPaper.filepath,
        authors: newPaper.authors,
        tags: newPaper.tags,
        revisions: newPaper.revisions,
        isPublished: newPaper.isPublished,
        createdAt: newPaper.createdAt,
        updatedAt: newPaper.updatedAt,
        versionNumber: newPaper.versionNumber
    });



};

export const updatePaper = async(req: Request, res: Response) => {};

export const deletePaper = async(req: Request, res: Response) => {};

export const deletePaperVersion = async(req: Request, res: Response) => {};