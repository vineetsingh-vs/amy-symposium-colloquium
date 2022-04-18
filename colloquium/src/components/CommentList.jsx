import React, { Fragment, useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import ReplyList from "../components/ReplyList";
import {PageStore} from "../views/DocumentView";
import commentApi from "../api/comment";
import { useAuth } from "../useAuth";

import {
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Grid,
    Button,
    TextField,
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import extraApi from "../api/extra";

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

const Comment = ({ comment, paperId, versionId, pageNum }) => {
    const classes = useStyles();
    const [hidden, setHidden] = useState(false);
    const [comments, setComments] = useState([]);
    const { user } = useAuth();
    const [replies, setReplies] = useState([]);
    const [likes, setLikes] = useState(comment.likes ? comment.likes.length : 0);
    const [dislikes, setDislikes] = useState(comment.dislikes ? comment.dislikes.length : 0);
    const [value, setValue] = useState("");

    const handleType = (text) => {
        text.preventDefault();
        setValue(text.target.value);
    }

    const handleClick = () => {
        replies.push(createReply(comments.length, user.firstName, value));
        listReplies();
        console.log(replies);
        setValue("");
        setHidden(!hidden);
    }

    const addLike = async () => {
        await extraApi.addLike(comment.id, user.id).then((rep) => {
            setLikes(rep.likes ? rep.likes.length : likes);
            setDislikes(rep.dislikes ? rep.dislikes.length : dislikes);
        });
    }

    const addDislike = async () => {
        await extraApi.addDislike(comment.id, user.id).then((rep) => {
            setLikes(rep.likes ? rep.likes.length : likes);
            setDislikes(rep.dislikes ? rep.dislikes.length : dislikes);
        }); 
    }
    
    const createReply = (id, name, body) => {
        console.log(comment);
        commentApi.createComment(paperId, versionId, comment.id, name, body, pageNum);
        return { id, pageNum: pageNum, parentId: comment.id, content: body, user: name };
    }

    const listReplies = () => {
        let replyList = comment.replies;

        setReplies(replyList ? replyList : []);
        console.log("[ReplyList] got replies");
    };

    useEffect(() => {
        console.log("[ReplyList] mount");
        listReplies();
    }, [comment, replies]);  

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
                    primary={<Typography className={classes.fonts}>{comment.user}</Typography>}
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                            </Typography>
                            {`${comment.content}`}
                        </>
                    }
                />
            </ListItem>
            <ThumbUpIcon color="primary" variant="contained" onClick={addLike}>
                Like
            </ThumbUpIcon>
            <b>{likes}</b>
            <ThumbDownIcon color="primary" variant="contained" onClick={addDislike}>
                Dislike
            </ThumbDownIcon>
            <b>{dislikes}</b>
            <br />
            <Button color="secondary" variant="contained" onClick={addReply}>
                Reply
            </Button>
            {hidden && (<TextField multiline variant="outlined" fullWidth={true} onChange={handleType} value={value} ></TextField>)}
            
            {hidden && (<Button color="secondary" variant="contained" disabled={value == ""} onClick={handleClick}>Add Reply</Button>)}
            
            { replies ? <ReplyList replies={replies}/> : <div></div>}

            <Divider />
        </div>
    );
};

const CommentList = ({ paperId, versionId }) => {
    const [comments, setComments] = useState([]);
    const [currentComment, setCurrentComment] = useState("");
    const classes = useStyles();
    const { user } = useAuth();
    
    // Comment Handling
    const handleType = (text) => {
        setCurrentComment(text.target.value);
    };

    const handleClick = async() => {
        await createComment(comments.length, user.firstName, currentComment, []).then((data) => comments.push(data));
        listComments();
        console.log(comments);
        setCurrentComment("");
    };

    const createComment = async(id, user, content, replies) => {
        // Push a comment thing here to backend
        let data = await commentApi.createComment(paperId, versionId, null, user, content, PageStore.getState().currentPage).then((data) => {
            return data;
        });
        return data;
    };

    const listComments = () => {
        setComments(comments);
        console.log("[CommentList] got comments");
    };

    useEffect(() => {
        PageStore.subscribe(() => {
            commentApi.getCommentsByPage(paperId, versionId, PageStore.getState().currentPage).then((comments) => setComments(comments));
        });
    }, []);

    return (
        <Grid item xs={4}>
            <List className={classes.root}>
                {comments.map((comment) => (
                    <Comment comment={comment} paperId={paperId} versionId={versionId} pageNum={PageStore.getState().currentPage} />
                ))}
            </List>
            <TextField
                variant="outlined"
                multiline
                placeholder="Enter Comment Here"
                fullWidth={true}
                value={currentComment}
                onChange={handleType}
            ></TextField>
            <Button
                color="primary"
                variant="contained"
                fullWidth={true}
                disabled={currentComment === ""}
                onClick={handleClick}
            >
                Add Comment
            </Button>
        </Grid>
    );
};

const ReviewList = ({ paperId, versionId }) => {
    const [reviews, setReviews] = useState([]);
    const classes = useStyles();
    const [value, setValue] = useState("");
    const { user } = useAuth();
    
    // Reviews Handling
    const handleType = (text) => {
        setValue(text.target.value);
    }

    const handleClick = async() => {
        await createReviews(reviews.length, user.firstName, value, []).then((data) => reviews.push(data));
        listReviews();
        console.log(reviews);
        setValue("");
    }

    const createReviews = async(id, name, body, replies) => {
        let data = await commentApi.createComment(paperId, versionId, null, name, body, 0).then((data) => {
            return data;
        });
        return data;
    }

    const listReviews = () => {
        setReviews(reviews);
        console.log("[ReviewList] got reviews");
    };

    useEffect(() => {
        async function apiCalls() {
            await commentApi.getCommentsByPage(paperId, versionId, 0).then((reviews) => setReviews(reviews));
        }
        apiCalls();
        console.log("[ReviewList] mount");
        console.log(reviews)
    }, []);  

    return (
        <Grid item xs={12}>
            <List className={classes.root}>
                {reviews.map((review) => (
                    <Comment comment={review} paperId={paperId} versionId={versionId} pageNum={0} />
                ))}
            </List>
            <TextField variant="outlined" multiline placeholder="Enter Review Here" fullWidth={true} value={value} onChange={handleType}></TextField>
            <Button color="primary" variant="contained" fullWidth={true} disabled={value === ""} onClick={handleClick}>
                Add Review
            </Button>
        </Grid>
    );
};

export { CommentList, ReviewList };
