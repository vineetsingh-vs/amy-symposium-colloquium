import React, { Fragment, useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import ReplyList from "../components/ReplyList";

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

const Comment = ({ comment }) => {
    const classes = useStyles();
    const [hidden, setHidden] = useState(false);const [comments, setComments] = useState([]);
    const [username, setUsername] = useState("Default Username");
    const [replies, setReplies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [value, setValue] = useState("");

    const handleType = (text) => {
        setValue(text.target.value);
    }

    const handleClick = () => {
        replies.push(createReply(comments.length, username, value));
        listReplies();
        console.log(replies);

    }
    
    const createReply = (id, name, body) => {
        return { id, name,  body};
    }

    const listReplies = () => {
        // const url = "https://jsonplaceholder.typicode.com/posts/1/comments";
        // fetch(url)
        //     .then((response) => response.json())
        //     .then((comments) => {
                let replyList = replies.slice();
                setReplies(replyList);
                console.log("[ReplyList] got replies");
        //     });
    };

    useEffect(() => {
        console.log("[ReplyList] mount");
        setIsFetching(true);
        listReplies();
        setIsFetching(false);
    }, []);  

    const addReply = () => {
        setHidden(!hidden);
        console.log(hidden);
    }
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
                            </Typography>
                            {`${comment.body}`}
                        </>
                    }
                />
            </ListItem>
            <Button color="secondary" variant="contained" onClick={addReply}>
                Reply
            </Button>
            {hidden && (<TextField multiline variant="outlined" fullWidth={true} value={value} onChange={handleType}></TextField>)}
            
            {hidden && (<Button color="secondary" variant="contained" onClick={handleClick}>Add Reply</Button>)}
            <ReplyList reply={replies}/>

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
