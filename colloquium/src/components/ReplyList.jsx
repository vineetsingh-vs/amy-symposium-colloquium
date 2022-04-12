import React, { Fragment, useState, useEffect } from "react";
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
    Button,
    TextField
} from "@mui/material";

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
    console.log(reply);
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
            replies.map((reply) => (
                <Reply reply={reply} />
            ))}
        </List>
    );
};

export default ReplyList;
