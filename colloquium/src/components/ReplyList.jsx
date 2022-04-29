import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import {
    List,
    ListItem,
    ListItemIcon,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import extraApi from "../api/extra";
import { useAuth } from "../useAuth";

import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    fonts: {
        fontWeight: "bold",
    },
    inline: {
        display: "inline",
    },
}));

const Reply = ({ reply }) => {
    const classes = useStyles();
    const { user } = useAuth();
    const [likes, setLikes] = useState(reply.likes ? reply.likes.length : 0);
    const [dislikes, setDislikes] = useState(reply.dislikes ? reply.dislikes.length : 0);

    const addLike = async () => {
        await extraApi.addLike(reply.id, user.id).then((rep) => {
            setLikes(rep.likes ? rep.likes.length : likes);
            setDislikes(rep.dislikes ? rep.dislikes.length : dislikes);
        });
    }

    const addDislike = async () => {
        await extraApi.addDislike(reply.id, user.id).then((rep) => {
            setLikes(rep.likes ? rep.likes.length : likes);
            setDislikes(rep.dislikes ? rep.dislikes.length : dislikes);
        }); 
    }

    return (
        <div className={`reply ${reply.id}`}>
            <ListItem key={reply.id} alignItems="flex-start">
                <ListItemIcon>
                    <SubdirectoryArrowRightIcon />
                </ListItemIcon>
                <ListItemAvatar>
                    <Avatar alt="avatar" />
                </ListItemAvatar>
                <ListItemText
                    primary={<Typography className={classes.fonts}>{reply.user}</Typography>}
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                            </Typography>
                            {`${reply.content}`}
                        </>
                    }
                />
                <ThumbUpIcon color="primary" variant="contained" onClick={addLike}>
                    Like
                </ThumbUpIcon>
                <b>{likes}</b>
                <ThumbDownIcon color="primary" variant="contained" onClick={addDislike}>
                    Dislike
                </ThumbDownIcon>
                <b>{dislikes}</b>
                <br />
            </ListItem>
            <Divider />
        </div>
    );
};

const ReplyList = ({ replies }) => {
    const classes = useStyles();
    return (
        <List className={classes.root}>
            {
            replies.map((reply, index) => (
                <React.Fragment key={index}>
                    <Reply reply={reply} />
                </React.Fragment>
            ))}
        </List>
    );
};

export default ReplyList;
