import { Request, Response } from "express";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { Paper } from "../entities/Paper";
import config from "../utils/config";

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
            creator: paper.creator,
            authors: paper.authors,
            sharedWith: paper.sharedWith,
            isPublished: paper.isPublished,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber,
            versions: paper.versions,
        });
    } else {
        res.status(400).json({ message: "Could not find Paper" });
    }
};

export const createPaper = async (req: Request, res: Response) => {
    console.log("[paperController] createPaper");

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
            console.log(files);
            try {
                var oldPath = file.filepath;
                // TODO: Where we would either save file to AWS or local storage
                var newPath = config.uploadFolder + "/" + file.originalFilename;
                fs.writeFileSync(newPath, fs.readFileSync(oldPath));
            } catch (e) {
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
        console.log(fields)
        const newPaper = Paper.create(fields);

        await newPaper.save();
        console.log("saved paper: ");
        console.log(newPaper);

        res.status(200).json({
            id: newPaper.id,
            title: newPaper.title,
            creator: newPaper.creator,
            authors: newPaper.authors,
            sharedWith: newPaper.sharedWith,
            isPublished: newPaper.isPublished,
            createdAt: newPaper.createdAt,
            updatedAt: newPaper.updatedAt,
            versionNumber: newPaper.versionNumber,
            versions: newPaper.versions,
        });
    });
};

export const getPaperMetaData = async (req: Request, res: Response) => {
    console.log("[paperController] getPaperMetaData");
    const { paperId } = req.params;

    let paper = await Paper.findOne({ where: { id: paperId } });

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
            versionNumber: paper.versionNumber,
        });
    } else {
        res.status(400).json({ message: "Could not find Paper" });
    }
};

export const updatePaperMetaData = async (req: Request, res: Response) => {
    console.log("[paperController] updatePaperMetaData");
    const { paperid } = req.params;
    const { title, creator, authors, isPublished } = req.body;

    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper) {
        paper.title = title || paper.title;
        paper.creator = creator || paper.creator;
        paper.authors = authors || paper.authors;
        paper.isPublished = isPublished || paper.isPublished;

        await paper.save();
        res.status(200).json({
            id: paper.id,
            title: paper.title,
            creator: paper.creator,
            authors: paper.authors,
            sharedWith: paper.sharedWith,
            isPublished: paper.isPublished,
            createdAt: paper.createdAt,
            updatedAt: paper.updatedAt,
            versionNumber: paper.versionNumber,
            versions: paper.versions,
        });
    } else {
        res.status(400).json({ message: "Paper not found" });
    }
};

// export const getPaperFileVersion = async (req: Request, res: Response) => {
// console.log("[paperController] getPaperFileVersion");
// const { paperId } = req.params;

// let paper = await Paper.findOne({ where: { id: paperId } });

// if (paper) {
// console.log(process.cwd() + "/" + paper.filepath);
// res.status(200).sendFile(process.cwd() + "/" + paper.filepath);
// } else {
// res.status(400).json({ message: "Paper not found" });
// }
// };

export const deletePaper = async (req: Request, res: Response) => {
    console.log("[paperController] deletePaper");
    const { paperId } = req.params;

    let paper = await Paper.findOne({ where: { id: paperId } });

    if (paper) {
        await paper.remove();
        res.status(200).json({ message: "Successfully deleted paper" });
    } else {
        res.status(400).json({ message: "Paper not found" });
    }
};

//
// ======== TODO >>>>

// delete a version of a paper (file and version metadata)
export const deletePaperVersion = async (req: Request, res: Response) => {};
// update a version of a paper (file and version metadata)
export const updatePaperFileVersion = async (req: Request, res: Response) => {};
// share a paper with another user
export const sharePaper = async (req: Request, res: Response) => {};
// stop sharing a paper with another user
export const stopSharingPaper = async (req: Request, res: Response) => {};
