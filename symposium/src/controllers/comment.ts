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

    const version = await Version.findOne({ where: { id: versionId } });
    const parent = await Comment.findOne({ where: { id: parentId } });

    const newComment = Comment.create({
        version: version,
        parent: parent,
        content: content,
        pageNum: pageNum,
        user: userId,
    });

    await newComment.save();
    console.log("saved comment: ");
    console.log(newComment);

    res.status(200).json({
        id: newComment.id,
        version: newComment.version,
        content: newComment.content,
        parent: newComment.parent,
        user: newComment.user,
        pageNum: newComment.pageNum,
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
            user: comment.user,
            pageNum: comment.pageNum,
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

// TODO: refactor
export const updateComment = async (req: Request, res: Response) => {
    // console.log("[commentController] updateComment");
    // const { commentID } = req.params;
    // const { paperID, paperVersion, review, content, parent } = req.body;
    // let comment = await Comment.findOne({ where: { id: commentID } });
    // if (comment) {
    // comment.paper_id = paperID || comment.paper_id;
    // comment.paper_version = paperVersion || comment.paper_version;
    // comment.review = review || comment.review;
    // comment.content = content || comment.content;
    // comment.parent = parent || comment.parent;
    // await comment.save();
    // res.status(200).json({
    // id: comment.id,
    // paperID: comment.paper_id,
    // paperVersion: comment.paper_version,
    // review: comment.review,
    // content: comment.content,
    // parent: comment.parent,
    // user: comment.user,
    // createdAt: comment.created_at,
    // updatedAt: comment.updated_at,
    // });
    // } else {
    // res.status(400).json({ message: "Comment not found" });
    // }
};
