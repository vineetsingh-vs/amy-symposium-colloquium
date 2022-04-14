import { Request, Response } from "express";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { Paper } from "../entities/Paper";
import { Version } from "../entities/Version";
import { User } from "../entities/User";
import config from "../utils/config";
import { downloadFile, uploadFile } from "../utils/aws";

export const getPaperList = async (req: Request, res: Response) => {
    const { filter, userId } = req.query;
    console.log("[paperController] getPaperList");

    let user = await User.findOne({ where: { id: userId } });
    if (user) {
        if (filter === "shared") {
            // TODO
            // paperList = await Paper.find({where: [ {sharedWith : includes this user}]});
            // res.status(200).send(user?.sharedWithMe);
        } else if (filter === "uploaded") {
            let paperList = await Paper.find({ where: { creator: userId } });
            res.status(200).send(paperList);
        } else if (filter == "published") {
            let paperList = await Paper.find({ where: { isPublished: true } });
            res.status(200).send(paperList);
        } else if (filter == "all") {
            let paperList = await Paper.find();
            res.status(200).send(paperList);
        } else {
            res.status(400).json({ message: "Invalid filter" });
        }
    } else {
        res.status(400).json({ message: "User not found" });
    }
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
        console.log(files.files);

        let path = "";
        if (!Array.isArray(files.files)) {
            let file = files.files;
            try {
                console.log("yuh");
                var oldPath = file.filepath;
                // TODO: Where we would either save file to AWS or local storage
                if (config.usingAWS) {
                    console.log("hu");
                    path = file.originalFilename!;
                    uploadFile(oldPath, path);
                } else if (config.usingFS) {
                    console.log("aa");
                    path = config.uploadFolder + "/" + file.originalFilename;
                    fs.writeFileSync(path, fs.readFileSync(oldPath));
                }
            } catch (e) {
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

        //
        // create a version and version array
        console.log(path);
        const newVersion = Version.create({
            filePath: path,
            paper: newPaper,
        });
        await newVersion.save();

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
    console.log(req.body);
    console.log(isPublished);

    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper) {
        paper.title = title || paper.title;
        paper.creator = creator || paper.creator;
        paper.authors = authors || paper.authors;
        if (isPublished !== undefined && isPublished !== null) paper.isPublished = isPublished;
        const updatedPaper = await paper.save();
        console.log(updatedPaper.isPublished);
        res.status(200).json(updatedPaper);
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
        let version = paper.versions[Number(versionId) - 1];
        if (version) {
            if (config.usingFS) {
                res.status(200).sendFile(process.cwd() + "/" + version.filePath);
            } else if (config.usingAWS) {
                const path = process.cwd() + "/" + config.tmpFolder + "/" + version.filePath;
                const content = await downloadFile(version.filePath);
                fs.writeFileSync(path, content, "binary");
                res.status(200).sendFile(path, (err) => {
                    if (err) {
                        console.log("Error sending file from temp", err);
                        res.status(400).json({ message: "Failed to download file" });
                    } else {
                        fs.unlinkSync(path);
                    }
                });
            }
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

// update a version of a paper (file and version metadata)
export const updatePaperFileVersion = async (req: Request, res: Response) => {
    console.log("[paperController] Uploading new Version");
    const { paperId } = req.params;

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

        let paper = await Paper.findOne({ where: { id: paperId } });

        if (paper) {
            paper.versionNumber += 1;
            const newVersion = Version.create({
                filePath: filePath,
                paper: paper,
            });
            await newVersion.save();
            paper.versions.push(newVersion);
            console.log(paper);
            await paper.save();
            res.status(200).json({ message: "Successfully Reuploaded Paper" });
        } else {
            res.status(400).json({ message: "Paper not found" });
        }
    });
};

export const sharePaper = async (req: Request, res: Response) => {
    const { userId, userShareId } = req.body;
    const { paperId } = req.params;
    console.log("[paperController] sharePaper");

    const user = await User.findOne({ where: { id: userId } });
    if (!user) res.status(404).json({ message: "user not found" });

    const shareUser = await User.findOne({ where: { id: userShareId } });
    if (!shareUser) res.status(404).json({ message: "shared with user not found" });

    const paper = await Paper.findOne({ where: { id: paperId } });
    console.log(paper);
    if (paper && paper.creator.id === user?.id) {
        // @ts-ignore
        paper.sharedWith.push(shareUser);
        paper.save();
        res.status(200).json(paper);
    } else {
        res.status(404).json({ message: "paper not found" });
    }
};

export const stopSharingPaper = async (req: Request, res: Response) => {
    const { userId, userShareId, paperId } = req.body;
    console.log("[paperController] stopSharingPaper");

    const user = await User.findOne({ where: { id: userId } });
    if (!user) res.status(404).json({ message: "user not found" });

    const shareUser = await User.findOne({ where: { id: userShareId } });
    if (!shareUser) res.status(404).json({ message: "shared with user not found" });

    const paper = await Paper.findOne({ where: { paperId: paperId } });
    if (paper && paper.creator.id === user?.id) {
        let tmp = paper.sharedWith.filter((obj) => {
            return obj.id != paperId;
        });
        paper.sharedWith = tmp;
        res.status(200).json(paper);
    } else {
        res.status(404).json({ message: "paper not found" });
    }
};

//
// ======== TODO >>>>

// delete a version of a paper (file and version metadata)
export const deletePaperVersion = async (req: Request, res: Response) => {};
