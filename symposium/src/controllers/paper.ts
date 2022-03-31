import { Request, Response } from "express";
import { Paper } from "../entities/Paper"

export const getAllPapers = async (req: Request, res: Response) => {
    console.log("[paperController] getAllPapers");
    const papers = await Paper.find();
    res.status(200).send(papers);
};

export const getPaperById = async(req: Request, res: Response) => {
    console.log("[paperController] getPaperById");
    const { paperid } = req.params;
    console.log("Our id is: ")
    console.log(paperid);

    let paper = await Paper.findOne({ where: { id: paperid } });

    if (paper) {
        res.status(200).json({
            id: paper.id,
            title: paper.title,
            creator_id: paper.creator_id,
            filepath: paper.filepath,
            authors: paper.authors,
            tags: paper.tags,
            revisions: paper.revisions,
            isPublished: paper.isPublished,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber
        });
    } else {
        res.status(400).json({ message: "Could not find Paper" });
    }
};

export const getPaperVersionById = async(req: Request, res: Response) => {};

export const addPaper = async(req: Request, res: Response) => {

    console.log("[paperController] addPaper");
    console.log(req.body);

    const { title, creator_id, filepath, authors, tags } = req.body;

    const newPaper = Paper.create({
        title: title,
        creator_id: creator_id,
        filepath: filepath,
        authors: authors,
        tags: tags,
        revisions: [filepath],
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

export const updatePaper = async(req: Request, res: Response) => {
    console.log("[paperController] updatePaper");
    const { paperid } = req.params;
    const { title, creator_id, filepath, authors, tags, revisions, isPublished } = req.body;

    let paper = await Paper.findOne({ where: { id: paperid } });
    if (paper) {
        
        paper.title = title || paper.title;
        paper.creator_id = creator_id || paper.creator_id;
        paper.filepath = filepath || paper.filepath;
        paper.authors = authors || paper.authors;
        paper.tags = tags || paper.tags;
        paper.revisions = revisions || paper.revisions;
        paper.isPublished = isPublished || paper.isPublished;


        await paper.save();
        res.status(200).json({
            id: paper.id,
            title: paper.title,
            creator_id: paper.creator_id,
            filepath: paper.filepath,
            authors: paper.authors,
            tags: paper.tags,
            revisions: paper.revisions,
            isPublished: paper.isPublished,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber
        });
    } else {
        res.status(400).json({ message: "Paper not found" });
    }




};

export const deletePaper = async(req: Request, res: Response) => {
    console.log("[paperController] deletePaper");
    const { paperid } = req.params;

    let paper = await Paper.findOne({ where: { id: paperid } });

    if (paper) {
        await paper.remove();
        res.status(200).json({ message: "Successfully deleted paper" });
    } else {
        res.status(400).json({ message: "Paper not found" });
    }
};

export const deletePaperVersion = async(req: Request, res: Response) => {};