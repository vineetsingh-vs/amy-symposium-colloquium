import { Request, Response } from "express";
import { PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "../entities/Comment"

export const createComment = async (req: Request, res: Response) => {
    console.log("[commentController] createComment");
    console.log(req.body);
    const { paper_id, version, parent, pageNum, content, user } = req.body;

    const newComment = Comment.create({
        paper_id: paper_id,
        version: version,
        parent: parent,
        pageNum: pageNum,
        content: content,
        user: user,
    });
    await newComment.save();
    console.log("saved comment: ");
    console.log(newComment);

    res.status(200).json({
        id: newComment.id,
        paperID: newComment.paper_id,
        version: newComment.version,
        parent: newComment.parent,
        replies: newComment.replies,
        pageNum: newComment.pageNum,
        content: newComment.content,
        user: newComment.user,
        created_at: newComment.created_at,
        updated_at: newComment.updated_at
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
            version: comment.version,
            parent: comment.parent,
            replies: comment.replies,
            pageNum: comment.pageNum,
            content: comment.content,
            user: comment.user,
            created_at: comment.created_at,
            updated_at: comment.updated_at
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
    const { paper_id, version, parent, pageNum, content } = req.body;

    let comment = await Comment.findOne({ where: { id: commentID } });
    if (comment) {
        comment.paper_id = paper_id || comment.paper_id;
        comment.version = version || comment.version;
        comment.parent = parent || comment.parent;
        comment.pageNum = pageNum || comment.pageNum;
        comment.content = content || comment.content;
        comment.user = content || comment.content;
        await comment.save();
        res.status(200).json({
            id: comment.id,
            paperID: comment.paper_id,
            version: comment.version,
            parent: comment.parent,
            replies: comment.replies,
            pageNum: comment.pageNum,
            content: comment.content,
            user: comment.user,
            created_at: comment.created_at,
            updated_at: comment.updated_at
        });
    } else {
        res.status(400).json({ message: "Comment not found" });
    }
}