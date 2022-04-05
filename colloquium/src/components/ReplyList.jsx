import React, { Fragment, useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import {
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Button,
    TextField
} from "@mui/material";

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
    const [hidden, setHidden] = useState(false);

    const addReply = () => {
        setHidden(!hidden);
    }
    
    return (
        <div className={`reply ${reply.id}`}>
            <ListItem key={reply.id} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="avatar" />
                </ListItemAvatar>
                <ListItemText
                    primary={<Typography className={classes.fonts}>{reply.name}</Typography>}
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                            </Typography>
                            {`${reply.body}`}
                        </>
                    }
                />
            </ListItem>
            {/* <Button color="secondary" variant="contained" onClick={addReply}>
                Reply
            </Button> */}
            {hidden && (<TextField multiline variant="outlined" fullWidth={true}></TextField>)}

            {hidden && (<Button color="secondary" variant="contained">Add Reply</Button>)}
            <Divider />
        </div>
    );
};

const ReplyList = ({ reply }) => {
    const classes = useStyles();
    return (
        <List className={classes.root}>
            {reply.map((reply) => (
                <Reply reply={reply} />
            ))}
        </List>
    );
};

export default ReplyList;
