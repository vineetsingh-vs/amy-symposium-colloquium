import { Request, Response } from "express";
import { Paper } from "../entities/Paper";
import { Comment } from "../entities/Comment";
import config from "../utils/config";
import { emitter } from "../emitter";

export const getCommentList = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentList");
    const comments = await Comment.find({ relations: ["parent", "replies"] });
    res.status(200).send(comments);
};

export const createComment = async (req: Request, res: Response) => {
    console.log("[commentController] createComment");
    const { paperId, versionId, parentId, userId, content, pageNum } = req.body;

    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper) {
        let version = paper.versions[Number(versionId) - 1];
        try {
            const newComment = Comment.create({
                version: version,
                parent: parentId || undefined,
                user: userId,
                content: content,
                replies: [],
                likes: [],
                dislikes: [],
                pageNum: pageNum,
            });
            // add new comment to parent if provided
            if (parentId) {
                let parent = await Comment.findOne({
                    relations: ["parent", "replies"],
                    where: { id: parentId },
                });
                if (parent) {
                    parent.replies.push(newComment);
                    await parent.save();
                } else {
                    res.status(400).json({ message: "Could not find parent comment" });
                }
                res.status(200).json(newComment);
            }
            emitter.emit("commentCreated", { comment: newComment });
        } catch (err) {
            console.error("[commentController] Failed to save Reply - Database Error", err);
            res.status(500).json({
                message: "Failed to save Reply",
                stack: config.nodeEnv === "production" ? null : err.stack,
            });
        }
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentById");
    const { commentID } = req.params;

    let comment = await Comment.findOne({ where: { id: commentID } });
    if (comment) {
        emitter.emit("commentRequested", { req, comment });
        res.status(200).json({
            id: comment.id,
            version: comment.version,
            content: comment.content,
            parent: comment.parent,
            replies: comment.replies,
            likes: comment.likes,
            dislikes: comment.dislikes,
            pageNum: comment.pageNum,
            user: comment.user,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
        });
    } else {
        res.status(400).json({ message: "Could not find Comment" });
    }
};

export const getCommentsByVersionId = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionId");
    const { paperID, versionID } = req.params;
    let paper = await Paper.findOne({ where: { id: paperID } });
    if (paper) {
        let version = paper.versions[Number(versionID) - 1];
        let comments = await Comment.find({ where: { version: version } });
        if (comments) {
            res.status(200).send(comments);
        } else {
            res.status(400).json({ message: "Could not find comments" });
        }
    } else {
        res.status(400).json({ message: "Could not find paper" });
    }
};

export const getCommentsByVersionAndPage = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionAndPage");
    const { paperID, versionID, page } = req.params;

    let paper = await Paper.findOne({ where: { id: paperID } });
    if (paper) {
        let version = paper.versions[Number(versionID) - 1];
        let comments = await Comment.find({
            relations: ["parent", "replies"],
            where: { version: version, parent: null, pageNum: page },
        });
        if (comments) {
            res.status(200).send(comments);
        } else {
            res.status(400).json({ message: "Could not find comments" });
        }
    } else {
        res.status(400).json({ message: "Could not find paper" });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    console.log("commentController] deleteComment");
    const { commentID } = req.params;

    let comment = await Comment.findOne({ where: { id: commentID } });

    if (comment) {
        await comment.remove();
        res.status(200).json({ message: "Successfully deleted comment" });
    } else {
        res.status(400).json({ message: "Comment not found" });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    console.log("[commentController] updateComment");
    const { commentID } = req.params;
    const { pageNum, content } = req.body;

    let comment = await Comment.findOne({ where: { id: commentID } });
    if (comment) {
        comment.pageNum = pageNum || comment.pageNum;
        comment.content = content || comment.content;
        try {
            await comment.save();
            res.status(200).json({
                id: comment.id,
                version: comment.version,
                parent: comment.parent,
                replies: comment.replies,
                likes: comment.likes,
                dislikes: comment.dislikes,
                pageNum: comment.pageNum,
                content: comment.content,
                user: comment.user,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
            });
            emitter.emit("commentUpdated", { comment });
        } catch (err) {
            console.error(
                "[commentController] Failed to update Comment - Database Error",
                err
            );
            res.status(500).json({
                message: "Failed to update Comment",
                stack: config.nodeEnv === "production" ? null : err.stack,
            });
        }
    } else {
        res.status(400).json({ message: "Comment not found" });
    }
};
