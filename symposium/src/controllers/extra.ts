import { Request, Response } from "express";
import { Paper } from "../entities/Paper";
import { Comment } from "../entities/Comment";
import config from "../utils/config";
import { User } from "../entities/User";


export const getExtraComment = async (req: Request, res: Response) => {
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

    let user = await User.findOne({ where: { id : req.userId }})
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

    let user = await User.findOne({ where: { id : req.userId }})
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