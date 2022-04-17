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
    let paper = await Paper.findOne({ where: { id: paperId } });
    if (paper) {
        let version = paper.versions[Number(versionId) - 1]
        if (parentId) {
            let parent = await Comment.findOne({ relations: ['parent', 'replies'], where: { id: parentId } });
            if (parent) {
                try {
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
                } catch (err) {
                    console.error("[commentController] Failed to save Reply - Database Error", err);
                    res.status(500).json({
                        message: "Failed to save Reply",
                        stack: config.nodeEnv === "production" ? null : err.stack
                    });
                }
            } else {
                res.status(400).json({ message: "Could not find parent comment" });
            }
        } else {
            try {
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
            } catch (err) {
                console.error("[commentController] Failed to save Comment - Database Error", err);
                res.status(500).json({
                    message: "Failed to save Comment",
                    stack: config.nodeEnv === "production" ? null : err.stack
                });
            }
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

export const addLike = async (req: Request, res: Response) => {
    console.log("[commentController] add Like");
    const { commentID } = req.params;
    const { userId } = req.body;

    let user = await User.findOne({ where: { id : userId }})
    let comment = await Comment.findOne({ where: { id: commentID } });

    if (comment && user) {

        // Checking if in dislikes column
        let tempD : User[] = [];
        for(let i = 0; i < comment.dislikes.length; i++){
            if(comment.dislikes[i].id !== user.id){
                tempD.push(comment.dislikes[i]);
            }
        }
        comment.dislikes = tempD;

        // Checking if already in likes column
        let check : Boolean = false;
        for(let i = 0; i < comment.likes.length; i++){
            if(comment.likes[i].id === user.id){
                check = true;
            }
        }

        if(!check){
            comment.likes.push(user);
        }

        await comment.save();

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
        if(!user) res.status(400).json({ message: "Could not find User" });
        else if(!comment) res.status(400).json({ message: "Could not find Comment" });
    }
};

export const addDislike = async (req: Request, res: Response) => {
    console.log("[commentController] add Dislike");
    const { commentID } = req.params;
    const { userId } = req.body;

    let user = await User.findOne({ where: { id : userId }})
    let comment = await Comment.findOne({ where: { id: commentID } });

    if (comment && user) {

        // Checking if in likes column
        let tempD : User[] = [];
        for(let i = 0; i < comment.likes.length; i++){
            if(comment.likes[i].id !== user.id){
                tempD.push(comment.likes[i]);
            }
        }
        comment.likes = tempD;

        // Checking if already in dislikes column
        let check : Boolean = false;
        for(let i = 0; i < comment.dislikes.length; i++){
            if(comment.dislikes[i].id === user.id){
                check = true;
            }
        }

        if(!check){
            comment.dislikes.push(user);
        }

        await comment.save();

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
        if(!user) res.status(400).json({ message: "Could not find User" });
        else if(!comment) res.status(400).json({ message: "Could not find Comment" });
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
        console.debug(comments);
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
        console.debug(comments);
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
        } catch (err) {
            console.error("[commentController] Failed to update Comment - Database Error", err);
            res.status(500).json({
                message: "Failed to update Comment",
                stack: config.nodeEnv === "production" ? null : err.stack
            });
        }
    } else {
        res.status(400).json({ message: "Comment not found" });
    }
};
