import { Request, Response } from "express";
import { Comment } from "../entities/Comment";
import { Version } from "../entities/Version";

export const getCommentList = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentList");
    const comments = await Comment.find();
    res.status(200).send(comments);
};

export const createComment = async (req: Request, res: Response) => {
    console.log("[commentController] createComment");
    console.log(req.body);
    const { versionId, parentId, content, pageNum, userId } = req.body;

    // TODO: validate inputs

    const newComment = Comment.create({
        version: versionId,
        parent: parentId,
        user: userId,
        content: content,
        pageNum: pageNum,
    });

    await newComment.save();
    console.log("saved comment: ");
    console.log(newComment);

    res.status(200).json({
        id: newComment.id,
        version: newComment.version,
        content: newComment.content,
        parent: newComment.parent,
        replies: newComment.replies,
        pageNum: newComment.pageNum,
        user: newComment.user,
        createdAt: newComment.created_at,
        updatedAt: newComment.updated_at,
    });
};

export const getCommentById = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentById");
    const { commentID } = req.params;

    let comment = await Comment.findOne({ where: { id: commentID } });

    if (comment) {
        res.status(200).json({
            id: comment.id,
            version: comment.version,
            content: comment.content,
            parent: comment.parent,
            replies: comment.replies,
            pageNum: comment.pageNum,
            user: comment.user,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
        });
    } else {
        res.status(400).json({ message: "Could not find Comment" });
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
        await comment.save();
        res.status(200).json({
            id: comment.id,
            version: comment.version,
            parent: comment.parent,
            replies: comment.replies,
            pageNum: comment.pageNum,
            content: comment.content,
            user: comment.user,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
        });
    } else {
        res.status(400).json({ message: "Comment not found" });
    }
};
