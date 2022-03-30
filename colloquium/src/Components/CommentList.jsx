import React, { useState, useEffect } from "react";
import Comment from "../Components/Comment";

const CommentList = () => {
    const [comments, setComments] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const fetchData = async (url) => {
        const response = await fetch(url);
        let data = await response.json();
        return data;
    };

    useEffect(() => {
        const url = "https://jsonplaceholder.typicode.com/posts/1/comments";
        let data = fetchData(url);
        data.then((comments) => {
            let commentList = comments.slice(0, 10);
            this.setState(
                {
                    comments: commentList,
                    isFetching: false,
                },
                () => console.log("New State", this.state.comments)
            );
        });
    });

    return isFetching ? "Loading..." : <Comment comments={comments} />;
};

export default CommentList;
