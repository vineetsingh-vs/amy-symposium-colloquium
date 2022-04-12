import { Request, Response } from "express";
import { Paper } from "../entities/Paper";
import { Comment } from "../entities/Comment";
import { Version } from "../entities/Version";
import { getManager } from "typeorm";

export const getCommentList = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentList");
    const comments = await Comment.find({ relations: ['parent', 'replies'] });
    res.status(200).send(comments);
};

export const createComment = async (req: Request, res: Response) => {
    console.log("[commentController] createComment");
    console.log(req.body);
    const { paperId, versionId, parentId, userId, content, pageNum } = req.body;

    // TODO: validate inputs
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
                    pageNum: pageNum,
                });
                await newComment.save();

                parent.replies.push(newComment);
                await parent.save();

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
            } else {
                res.status(400).json({ message: "Could not find parent comment" });
            }
        } else {
            console.log("Top level Comment");
            const newComment = Comment.create({
                version: version,
                user: userId,
                content: content,
                replies: [],
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
        }
    } else {
        res.status(400).json({ message: "Could not find paper" });
    }
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


/**Get list of comments for a specific version, given the versionID */
export const getCommentsByVersionId = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionId");
    const { paperID, versionID } = req.params;
    let paper = await Paper.findOne({ where: { id: paperID } });
    if (paper) {
        let version = paper.versions[Number(versionID) - 1];
        let comments = await Comment.find({ where: { version: version }})
        console.log(comments);
        //let comments = await Comment.find({ where: { version: version } });
        if (comments) {
            res.status(200).send(comments);
        } else {
            res.status(400).json({ message: "Could not find comments" });
        }
    } else {
        res.status(400).json({ message: "Could not find paper" });
    }
};

/**Get list of comments for a specific version and pageNumber, given the versionID and pageNum*/
export const getCommentsByVersionAndPage = async (req: Request, res: Response) => {
    console.log("[commentController] getCommentsByVersionAndPage");
    const { paperID, versionID, page } = req.params;

    let paper = await Paper.findOne({ where: { id: paperID } });
    if (paper) {
        let version = paper.versions[Number(versionID) - 1];
        let comments = await Comment.find({ relations: ['parent', 'replies'], where: { version: version, parent: null, pageNum: page } });
        console.log(comments);
        //let comments = await Comment.find({ where: { version: version, pageNum: pageNumber } });

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
