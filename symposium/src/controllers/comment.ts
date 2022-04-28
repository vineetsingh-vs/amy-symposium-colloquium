import { Request, Response } from "express";
import { Paper } from "../entities/Paper";
import { Comment } from "../entities/Comment";
import config from "../utils/config";
import { User } from "../entities/User";

export const getCommentList = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentList");
    const comments = await Comment.find({ relations: ['parent', 'replies'] });
    res.status(200).send(comments);
};

export const createComment = async (req: Request, res: Response) => {
    console.log("[commentController] createComment");
    const { paperId, versionId, parentId, userId, content, pageNum } = req.body;
    
    // TODO: validate inputs
    try {
        let paper = await Paper.findOne({ where: { id: paperId } });
        if (paper) {
            let version = paper.versions[Number(versionId) - 1]
            if (parentId) {
                let parent = await Comment.findOne({ relations: ['parent', 'replies'], where: { id: parentId } });
                if (parent) {
                    const newComment = Comment.create({
                        version: version,
                        parent: parent,
                        user: userId,
                        content: content,
                        replies: [],
                        likes: [],
                        dislikes: [],
                        pageNum: pageNum,
                    });

                    await newComment.save();
                    parent.replies.push(newComment);
                    await parent.save();
                    console.debug("saved comment: ");
                    console.debug(newComment);

                    res.status(200).json({
                        id: newComment.id,
                        version: newComment.version,
                        content: newComment.content,
                        parent: newComment.parent,
                        replies: newComment.replies,
                        likes: newComment.likes,
                        dislikes: newComment.dislikes,
                        pageNum: newComment.pageNum,
                        user: newComment.user,
                        createdAt: newComment.created_at,
                        updatedAt: newComment.updated_at,
                    });
                } else {
                    res.status(400).json({ message: "Could not find parent comment" });
                }
            } else {
                const newComment = Comment.create({
                    version: version,
                    user: userId,
                    content: content,
                    replies: [],
                    pageNum: pageNum,
                });

                await newComment.save();
                console.debug("saved comment: ");
                console.debug(newComment);

                res.status(200).json({
                    id: newComment.id,
                    version: newComment.version,
                    content: newComment.content,
                    parent: newComment.parent,
                    replies: newComment.replies,
                    likes: newComment.likes,
                    dislikes: newComment.dislikes,
                    pageNum: newComment.pageNum,
                    user: newComment.user,
                    createdAt: newComment.created_at,
                    updatedAt: newComment.updated_at,
                });
            }
        } else {
            res.status(400).json({ message: "Could not find paper" });
        }
    } catch (err) {
        console.error("[commentController-createComment] Failed to save Comment - Database Error", err);
        res.status(500).json({
            message: "Failed to save Comment - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentById");
    const { commentID } = req.params;

    try {
        let comment = await Comment.findOne({ where: { id: commentID } });

        if (comment) {
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
    } catch (err) {
        console.error("[commentController-getCommentById] Failed to get Comment by Id - Database Error", err);
        res.status(500).json({
            message: "Failed to get Comment by Id - Database Error",
            error: err,
            stack: config.nodeEnv === "production" ? null : err.stack
        });
    }
};

/**Get list of comments for a specific version, given the versionID */
export const getCommentsByVersionId = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionId");
    const { paperID, versionID } = req.params;
    try {
        let paper = await Paper.findOne({ where: { id: paperID } });
        if (paper) {
            let version = paper.versions[Number(versionID) - 1];
            let comments = await Comment.find({ where: { version: version }})
            console.debug(comments);
            if (comments) {
                res.status(200).send(comments);
            } else {
                res.status(400).json({ message: "Could not find comments" });
            }
        } else {
            res.status(400).json({ message: "Could not find paper" });
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

/**Get list of comments for a specific version and pageNumber, given the versionID and pageNum*/
export const getCommentsByVersionAndPage = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionAndPage");
    const { paperID, versionID, page } = req.params;

    try {
        let paper = await Paper.findOne({ where: { id: paperID } });
        if (paper) {
            let version = paper.versions[Number(versionID) - 1];
            let comments = await Comment.find({ relations: ['parent', 'replies'], where: { version: version, parent: null, pageNum: page } });
            console.debug(comments);

            if (comments) {
                res.status(200).send(comments);
            } else {
                res.status(400).json({ message: "Could not find comments" });
            }
        } else {
            res.status(400).json({ message: "Could not find paper" });
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
        } else {
            res.status(400).json({ message: "Comment not found" });
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
