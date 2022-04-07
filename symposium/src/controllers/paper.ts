import { Request, Response } from "express";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { Paper } from "../entities/Paper";
import { Version } from "../entities/Version";
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
    const { paperId } = req.params;

    let paper = await Paper.findOne({ where: { id: paperId } });

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

    //
    // create the paper with metadata fields first
    let form = new IncomingForm({ uploadDir: config.tmpFolder });
    form.parse(req, async (err, fields: Fields, files: Files) => {
        if (err) {
            console.log("Error parsing file");
            res.status(400).json({
                message: "Error parsing file",
                error: err,
            });
        }

        let filePath = "/";
        if (!Array.isArray(files.files)) {
            let file = files.files;
            console.log(files);
            try {
                var oldPath = file.filepath;
                // TODO: Where we would either save file to AWS or local storage
                filePath = config.uploadFolder + "/" + file.originalFilename;
                fs.writeFileSync(filePath, fs.readFileSync(oldPath));
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

        console.log(fields);

        fields["versions"] = [];
        const newPaper = Paper.create(fields);
        // await newPaper.save();
        // console.log("saved paper: ");

        //
        // create a version and version array
        const newVersion = Version.create({
            filePath: filePath,
            paper: newPaper,
        });
        await newVersion.save();
        // console.log(newVersion);

        newPaper.versions.push(newVersion);
        console.log(newPaper);
        await newPaper.save();

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

export const updatePaperMetaData = async (req: Request, res: Response) => {
    console.log("[paperController] updatePaperMetaData");
    const { paperId } = req.params;
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

export const getPaperFileVersion = async (req: Request, res: Response) => {
    console.log("[paperController] getPaperFileVersion");
    const { paperId, versionId } = req.params;

    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper) {
        console.log(paper);
        let version = await paper.versions[Number(versionId) - 1];
        if (version) {
            console.log(process.cwd() + "/" + version.filePath);
            res.status(200).sendFile(process.cwd() + "/" + version.filePath);
        }
    } else {
        res.status(400).json({ message: "Paper not found" });
    }
};

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
