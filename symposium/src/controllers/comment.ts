import { Request, Response } from "express";
import { Comment } from "../entities/Comment"

export const createComment = async (req: Request, res: Response) => {
    console.log("[commentController] createComment");
    console.log(req.body);
    const { paper_id, paper_version, review, content, parent, user } = req.body;

    const newComment = Comment.create({
        paper_id: paper_id,
        paper_version: paper_version,
        review: review,
        content: content,
        parent: parent,
        user: user,
    });
    await newComment.save();
    console.log("saved comment: ");
    console.log(newComment);

    res.status(200).json({
        id: newComment.id,
        paperID: newComment.paper_id,
        paperVersion: newComment.paper_version,
        review: newComment.review,
        content: newComment.content,
        parent: newComment.parent,
        user: newComment.user,
        createdAt: newComment.created_at,
        updatedAt: newComment.updated_at,
    });
};

export const getComments = async (req: Request, res: Response) => {
    console.log("[commentController] getComments");
    const comments = await Comment.find();
    res.header("Access-Control-Expose-Headers", "Content-Range");
    res.header("Content-Range", "posts 0-20/20");
    res.status(200).send(comments);
};

export const getCommentById = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentById");
    const { commentID } = req.params;

    let comment = await Comment.findOne({ where: { id: commentID } });

    if (comment) {
        res.status(200).json({
            id: comment.id,
            paperID: comment.paper_id,
            paperVersion: comment.paper_version,
            review: comment.review,
            content: comment.content,
            parent: comment.parent,
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
    const { paperID, paperVersion, review, content, parent } = req.body;

    let comment = await Comment.findOne({ where: { id: commentID } });
    if (comment) {
        comment.paper_id = paperID || comment.paper_id;
        comment.paper_version = paperVersion || comment.paper_version;
        comment.review = review || comment.review;
        comment.content = content || comment.content;
        comment.parent = parent || comment.parent;
        await comment.save();
        res.status(200).json({
            id: comment.id,
            paperID: comment.paper_id,
            paperVersion: comment.paper_version,
            review: comment.review,
            content: comment.content,
            parent: comment.parent,
            user: comment.user,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
        });
    } else {
        res.status(400).json({ message: "Comment not found" });
    }
}