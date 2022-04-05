import { Request, Response } from "express";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { Extra } from "../entities/Extra";
import { Paper } from "../entities/Paper"
import config from "../utils/config"

export const getPaperList = async (req: Request, res: Response) => {
    const { filter, userId } = req.query;
    console.log("[paperController] getPaperList");

    let paperList;
    if (filter === "shared") {
    } else if (filter === "uploaded") {
    } else {
        // if user admin return all papers
        // else return papers shared with or associated with
        paperList = await Paper.find();
    }

    res.status(200).send(paperList);
};

export const getPaperMetaData = async (req: Request, res: Response) => {
    console.log("[paperController] getPaperMetaData");
    const { paperid } = req.params;

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
            extras: paper.extras,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber,
        });
    } else {
        res.status(400).json({ message: "Could not find Paper" });
    }
};

export const getPaperFileById = async(req: Request, res: Response) => {
    console.log("[paperController] getPaperFileById");
    const { paperid } = req.params;
    console.log("Our id is: ")
    console.log(paperid);

    let paper = await Paper.findOne({ where: { id: paperid } });

    if (paper) {
        res.status(200).download(paper.filepath);
    } else {
        res.status(400).json({ message: "Could not find Paper" });
    }
};

export const getPaperVersionById = async(req: Request, res: Response) => {};

export const createPaper = async(req: Request, res: Response) => {

    console.log("[paperController] addPaper");
    
    let form = new IncomingForm({ multiples: true, uploadDir: config.tmpFolder });
    form.parse(req, async (err, fields: Fields, files: Files) => {
        if (err) {
            console.log("Error parsing file");
            res.status(400).json({
                message: "Error parsing file",
                error: err,
            });
        }
        if (!Array.isArray(files.files)) {
            let file = files.files;
            console.log(files)
            try {
                var oldPath = file.filepath;
                // TODO: Where we would either save file to AWS or local storage
                var newPath = config.uploadFolder + "/" + file.originalFilename;
                fields.filepath = newPath;
                fs.writeFileSync(newPath, fs.readFileSync(oldPath));

            } catch(e) {
                console.log("Error writing file", e);
                res.status(400).json({
                    message: "File couldn't be saved",
                });
            }
            console.log("[paperController] File uploaded");
        } else {
            res.status(500).json({ message: "Backend currently can't handle multiple files" });
            console.log("[paperController] Can't handle multiple files");
        }

        const newPaper = Paper.create(fields);

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
    });
};

export const updatePaperMetaData = async (req: Request, res: Response) => {
    console.log("[paperController] updatePaperMetaData");
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
            extras: paper.extras,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber,
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

export const addExtra = async (req: Request, res: Response) => {
    console.log("[paperController] addExtra");
    const { paperid } = req.params;
    const { name, value } = req.body;

    let paper = await Paper.findOne({ where: { id: paperid } });

    if (paper) {
        const extra = new Extra();
        extra.name = name;
        extra.value = value;
        extra.paper = paper;
        await extra.save();
        res.status(200).json({
            id: paper.id,
            title: paper.title,
            creator_id: paper.creator_id,
            filepath: paper.filepath,
            authors: paper.authors,
            tags: paper.tags,
            revisions: paper.revisions,
            isPublished: paper.isPublished,
            extras: paper.extras,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber
        });
    } else {
        res.status(400).json({ message: "Paper not found" });
    }
};


//
// ======== TODO >>>>

// get a version of a paper (file and version metadata)
export const getPaperFileVersion = async (req: Request, res: Response) => {};
// delete a version of a paper (file and version metadata)
export const deletePaperVersion = async (req: Request, res: Response) => {};
// update a version of a paper (file and version metadata)
export const updatePaperFileVersion = async (req: Request, res: Response) => {};
// share a paper with another user
export const sharePaper = async (req: Request, res: Response) => {};
// stop sharing a paper with another user
export const stopSharingPaper = async (req: Request, res: Response) => {};
