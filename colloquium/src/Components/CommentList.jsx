import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Button,
} from "@material-ui/core";

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

const Comment = ({ comment }) => {
    const classes = useStyles();
    return (
        <div className={`comment ${comment.id}`}>
            <ListItem key={comment.id} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="avatar" />
                </ListItemAvatar>
                <ListItemText
                    primary={<Typography className={classes.fonts}>{comment.name}</Typography>}
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {comment.email}
                            </Typography>
                            {` - ${comment.body}`}
                        </>
                    }
                />
            </ListItem>
            <Button color="secondary" variant="contained">
                Reply
            </Button>
            <Divider />
        </div>
    );
};

const CommentList = ({ comments }) => {
    const classes = useStyles();
    return (
        <List className={classes.root}>
            {comments.map((comment) => (
                <Comment comment={comment} />
            ))}
        </List>
    );
};

export default CommentList;
