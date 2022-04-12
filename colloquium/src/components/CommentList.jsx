import { Fragment, useState, useEffect } from "react";

import ReplyList from "../components/ReplyList";
import {PageStore} from "../views/DocumentView";
import commentApi from "../api/comment";
import { useCommentListStyles } from "../styles/commentListStyles";

import {
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Button,
    TextField,
} from "@mui/material";

const Comment = ({ comment }) => {
    const classes = useCommentListStyles();
    const [hidden, setHidden] = useState(false);
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState("Default Username");
    const [replies, setReplies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [value, setValue] = useState("");

    const handleType = (text) => {
        setValue(text.target.value);
    };

    const handleClick = () => {
        replies.push(createReply(comments.length, username, value));
        listReplies();
        console.log(replies);
        setValue("");
    };

    const createReply = (id, name, body) => {
        commentApi.createComment(comment.paperId, comment.versionId, comment.id, name, body, pageNum);
        return { id, pageNum: 0, parentId: comment.id, content: body, user: name };
    }

    const listReplies = () => {
        let replyList = comment.replies;

        setReplies(replyList ? replyList : []);
        console.log("[ReplyList] got replies");
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
    };
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
            <Button color="secondary" variant="contained" onClick={addReply}>
                Reply
            </Button>
            {hidden && (<TextField multiline variant="outlined" fullWidth={true} value={value} onChange={handleType}></TextField>)}
            
            {hidden && (<Button color="secondary" variant="contained" disabled={value == ""} onClick={handleClick}>Add Reply</Button>)}
            
            { replies ? <ReplyList reply={replies}/> : <div></div>}

            {hidden && (
                <Button
                    color="secondary"
                    variant="contained"
                    disabled={value == ""}
                    onClick={handleClick}
                >
                    Add Reply
                </Button>
            )}
            <ReplyList reply={replies} />

            <Divider />
        </div>
    );
};

const CommentList = ({ paperId, versionId }) => {
    const [comments, setComments] = useState([]);
    const classes = useCommentListStyles();

    useEffect(() => {
        PageStore.subscribe(() => {
            commentApi.getCommentsByPage(paperId, versionId, PageStore.getState().currentPage).then((comments) => setComments(comments));
        });
    }, [PageStore.getState().currentPage]);

    return (
        <List className={classes.root}>
            {comments.map((comment) => (
                <Comment comment={comment} pageNum={PageStore.getState().currentPage} />
            ))}
        </List>
    );
};

const ReviewList = ({ reviews }) => {
    const classes = useStyles();

    console.log(reviews);

    return (
        <List className={classes.root}>
            {reviews.map((review) => (
                <Comment comment={review} pageNum={0} />
            ))}
        </List>
    );
};

export { CommentList, ReviewList };
