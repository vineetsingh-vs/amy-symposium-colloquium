import { Request, Response } from "express";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { Paper } from "../entities/Paper";
import { Version } from "../entities/Version";
import { User } from "../entities/User";
import config from "../utils/config";
import { downloadFile, uploadFile } from "../utils/aws";
import { emitter } from "../emitter";

export const getPaperList = async (req: Request, res: Response) => {
    const { filter, userId } = req.query;
    console.log("[paperController] getPaperList");

    let user = await User.findOne({ where: { id: userId } });
    if (user) {
        if (filter === "shared") {
            let sharedPapers: Paper[] = [];
            let paperList = await Paper.find();
            paperList.forEach((paper) => {
                for (let i = 0; i < paper.sharedWith.length; i++) {
                    if (paper.sharedWith[i].id === user!.id) {
                        sharedPapers.push(paper);
                    }
                }
            });
            res.status(200).send(sharedPapers);
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
        emitter.emit("paperRequested", { req, paper });
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

    let form = new IncomingForm({ uploadDir: config.tmpFolder });
    form.parse(req, async (err, fields: Fields, files: Files) => {
        if (err) {
            console.error("[paperController-createPaper] Error parsing file", err);
            res.status(400).json({
                message: "Error parsing file",
                error: err,
                stack: config.nodeEnv === "production" ? null : err.stack,
            });
            return;
        }

        let path = "";
        if (!Array.isArray(files.files)) {
            let file = files.files;
            try {
                var oldPath = file.filepath;
                if (config.usingAWS) {
                    path = file.originalFilename!;
                    uploadFile(oldPath, path);
                } else if (config.usingFS) {
                    path =
                        process.cwd() +
                        "/" +
                        config.uploadFolder +
                        "/" +
                        file.originalFilename;
                    fs.writeFileSync(path, fs.readFileSync(oldPath));
                }
            } catch (err) {
                console.error("[paperController] Error saving file", err);
                res.status(500).json({
                    message: "File couldn't be saved",
                    stack: config.nodeEnv === "production" ? null : err.stack,
                });
                return;
            }
            console.log("[paperController] File uploaded");
        } else {
            res.status(500).json({ message: "Backend currently can't handle multiple files" });
            console.error("[paperController] Can't handle multiple files");
            return;
        }

        console.debug(fields);

        fields["versions"] = [];
        try {
            const newPaper = Paper.create(fields);
            const newVersion = Version.create({
                filePath: path,
                paper: newPaper,
            });
            await newVersion.save();

            newPaper.versions.push(newVersion);
            console.debug(newPaper);
            await newPaper.save();

            res.status(200).json(newPaper);
            emitter.emit("paperCreated", { paper: newPaper });
        } catch (err) {
            console.error(
                "[paperController-createPaper] Failed to create Paper - Database Error",
                err
            );
            res.status(500).json({
                message: "Failed to create Paper - Database Error",
                stack: config.nodeEnv === "production" ? null : err.stack,
            });
        }
    });
};

export const updatePaperMetaData = async (req: Request, res: Response) => {
    console.log("[paperController] updatePaperMetaData");
    const { paperId } = req.params;
    const { title, creator, authors, isPublished } = req.body;
    console.debug(req.body);
    console.debug(isPublished);

    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper) {
        paper.title = title || paper.title;
        paper.creator = creator || paper.creator;
        paper.authors = authors || paper.authors;
        if (isPublished !== undefined && isPublished !== null) paper.isPublished = isPublished;
        const updatedPaper = await paper.save();
        console.debug(updatedPaper.isPublished);
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
        console.debug(paper);
        let version = paper.versions[Number(versionId) - 1];
        if (version) {
            try {
                if (config.usingFS) {
                    res.status(200).sendFile(version.filePath);
                } else if (config.usingAWS) {
                    const path =
                        process.cwd() + "/" + config.tmpFolder + "/" + version.filePath;
                    const content = await downloadFile(version.filePath);
                    fs.writeFileSync(path, content, "binary");
                    res.status(200).sendFile(path, (err) => {
                        if (err) {
                            console.error(
                                "[paperController] Error sending file from temp",
                                err
                            );
                            res.status(500).json({
                                message: "Failed to download file",
                                stack: config.nodeEnv === "production" ? null : err.stack,
                            });
                        } else {
                            fs.unlinkSync(path);
                        }
                    });
                }
            } catch (err) {
                console.error("[paperController] Failed to send file", err);
                res.status(500).json({
                    message: "Failed to send paper",
                    stack: config.nodeEnv === "production" ? null : err.stack,
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
    console.log("[paperController] updatePaperFileVersion");
    const { paperId, userId } = req.params;

    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper && paper.creator.id === userId) {
        let form = new IncomingForm({ uploadDir: config.tmpFolder });
        form.parse(req, async (err, fields: Fields, files: Files) => {
            if (err) {
                console.error("[paperController] Error parsing file", err);
                res.status(400).json({
                    message: "Error parsing file",
                    error: err,
                    stack: config.nodeEnv === "production" ? null : err.stack,
                });
            }

            let path = "";
            if (!Array.isArray(files.files)) {
                let file = files.files;
                console.debug(files);
                try {
                    var oldPath = file.filepath;
                    try {
                        var oldPath = file.filepath;
                        if (config.usingAWS) {
                            path = file.originalFilename!;
                            uploadFile(oldPath, path);
                        } else if (config.usingFS) {
                            path =
                                process.cwd() +
                                "/" +
                                config.uploadFolder +
                                "/" +
                                file.originalFilename;
                            fs.writeFileSync(path, fs.readFileSync(oldPath));
                        }
                    } catch (err) {
                        console.error("[paperController] Error saving file", err);
                        res.status(500).json({
                            message: "File couldn't be saved",
                            stack: config.nodeEnv === "production" ? null : err.stack,
                        });
                    }
                    console.log("[paperController] File uploaded");
                } catch (err) {
                    console.error("[paperController] Error writing file", err);
                    res.status(500).json({
                        message: "File couldn't be saved",
                        stack: config.nodeEnv === "production" ? null : err.stack,
                    });
                }
                console.log("[paperController] File uploaded");
            } else {
                console.warn("[paperController] Can't handle multiple files");
                res.status(500).json({
                    message: "Backend currently can't handle multiple files",
                });
            }
            try {
                let paper = await Paper.findOne({ where: { id: paperId } });

                if (paper) {
                    paper.versionNumber += 1;
                    const newVersion = Version.create({
                        filePath: path,
                        paper: paper,
                    });
                    await newVersion.save();

                    paper.versions.push(newVersion);
                    console.debug(paper);
                    await paper.save();
                    res.status(200).json({ message: "Successfully Reuploaded Paper" });
                } else {
                    res.status(400).json({ message: "Paper not found" });
                }
            } catch (err) {
                console.error(
                    "[paperController-updatePaperFileVersion] Failed to update Paper - Database Error",
                    err
                );
                res.status(500).json({
                    message: "Failed to update Paper - Database Error",
                    stack: config.nodeEnv === "production" ? null : err.stack,
                });
            }
        });
    } else {
        if (!paper) res.status(400).json({ message: "Paper not found" });
        else if (paper.creator.id !== userId) {
            res.status(400).json({ message: "User is not the owner of the paper" });
        }
    }
};

export const sharePaper = async (req: Request, res: Response) => {
    const { userId, sharedUserEmail } = req.body;
    const { paperId } = req.params;
    console.log("[paperController] sharePaper");

    const user = await User.findOne({ where: { id: userId } });
    const shareUser = await User.findOne({ where: { email: sharedUserEmail } });
    if (user && shareUser) {
        const paper = await Paper.findOne({ where: { id: paperId } });
        if (paper && paper.creator.id === user.id) {
            // @ts-ignore
            if (user.id !== shareUser.id) {
                paper.sharedWith.push(shareUser);
                const updatedPaper = await paper.save();
                res.status(200).json(updatedPaper);
            } else {
                res.status(200).json({ message: "you own paper" });
            }
        } else {
            res.status(404).json({ message: "paper not found" });
        }
    } else {
        if (!user) res.status(404).json({ message: "user not found" });
        else if (!shareUser) res.status(404).json({ message: "shared with user not found" });
    }
};

export const stopSharingPaper = async (req: Request, res: Response) => {
    const { userId, sharedUserEmail } = req.body;
    const { paperId } = req.params;
    console.log("[paperController] stopSharingPaper");

    const user = await User.findOne({ where: { id: userId } });
    const shareUser = await User.findOne({ where: { email: sharedUserEmail } });
    if (user && shareUser) {
        const paper = await Paper.findOne({ where: { id: paperId } });
        if (paper && paper.creator.id === user.id) {
            if (user.id !== shareUser.id) {
                let tmp: User[] = [];
                for (let i = 0; i < paper.sharedWith.length; i++) {
                    if (paper.sharedWith[i].id !== shareUser.id) {
                        tmp.push(paper.sharedWith[i]);
                    }
                }
                paper.sharedWith = tmp;
                const updatedPaper = await paper.save();
                res.status(200).json(updatedPaper);
            } else {
                res.status(200).json({ message: "you own paper" });
            }
        } else {
            res.status(404).json({ message: "paper not found" });
        }
    } else {
        if (!user) res.status(404).json({ message: "user not found" });
        else if (!shareUser) res.status(404).json({ message: "shared with user not found" });
    }
};

//
// ======== TODO >>>>

// delete a version of a paper (file and version metadata)
export const deletePaperVersion = async (req: Request, res: Response) => {};
