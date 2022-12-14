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
    const { paperId, versionId, parentId, content, pageNum, name } = req.body;
    
    try {
        let paper = await Paper.findOne({ where: { id: paperId } });
        if (paper) {
            let version = paper.versions[Number(versionId) - 1];
                const newComment = Comment.create({
                    version: version,
                    parent: parentId || null,
                    user: name,
                    content: content,
                    replies: [],
                    likes: [],
                    dislikes: [],
                    pageNum: pageNum,
                });
                await newComment.save();

                // add new comment to parent replies if provided
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
                }
                res.status(200).json(newComment);
                emitter.emit("commentCreated", { comment: newComment });
        }
    } catch (err) {
        console.error("[commentController-createComment] Failed to save Comment - Database Error", err);
        res.status(500).json({
            message: "Failed to save Comment",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack,
        });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentById");
    const { commentID } = req.params;
    try {
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
        }
    } catch (err) {
        console.error("[commentController-getCommentById] Failed to get Comment - Database Error", err);
        res.status(500).json({
            message: "Failed to get Comment",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack,
        });
    }
};

export const getCommentsByVersionId = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionId");
    const { paperID, versionID } = req.params;
    try {
        let paper = await Paper.findOne({ where: { id: paperID } });
        if (paper) {
            let version = paper.versions[Number(versionID) - 1];
            let comments = await Comment.find({ where: { version: version } });
            if (comments) {
                res.status(200).send(comments);
            } else {
                res.status(400).json({ message: "Could not find paper" });
            }
        }
    } catch (err) {
        console.error("[commentController-getCommentsByVersionId] Failed to get Comments by Version - Database Error", err);
        res.status(500).json({
            message: "Failed to get Comments by Version - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const getCommentsByVersionAndPage = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionAndPage");
    const { paperID, versionID, page } = req.params;
    try {
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
                res.status(400).json({ message: "Could not find paper" });
            }
        }
    } catch (err) {
        console.error("[commentController-getCommentsByVersionAndPage] Failed to get Comments by Page - Database Error", err);
        res.status(500).json({
            message: "Failed to get Comments by Page - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    console.log("commentController] deleteComment");
    const { commentID } = req.params;

    try {
        let comment = await Comment.findOne({ where: { id: commentID } });

        if (comment) {
            await comment.remove();
            res.status(200).json({ message: "Successfully deleted comment" });
        } else {
            res.status(400).json({ message: "Comment not found" });
        }
    } catch (err) {
        console.error("[commentController-deleteComment] Failed to delete Comment - Database Error", err);
        res.status(500).json({
            message: "Failed to delete Comment - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    console.log("[commentController] updateComment");
    const { commentID } = req.params;
    const { pageNum, content } = req.body;

    try {
        let comment = await Comment.findOne({ where: { id: commentID } });
        if (comment) {
            comment.pageNum = pageNum || comment.pageNum;
            comment.content = content || comment.content;
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
        } 
    } catch (err) {
        console.error("[commentController-updateComment] Failed to update Comment - Database Error", err);
        res.status(500).json({
            message: "Failed to update Comment - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};
