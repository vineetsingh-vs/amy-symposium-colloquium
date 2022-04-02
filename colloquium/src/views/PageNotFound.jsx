import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";

const PageNotFound = () => {
    const history = useHistory();
    useEffect(() => {
        document.title = "404 | Page not Found ";
    });
    return (
        <div className="pageNotFound">
            <h1>404</h1>
            <p>{"Page not found :("}</p>
            <Button onClick={() => history.push("/")} className="primary-btn mt-3">
                Take Me Back!
            </Button>
        </div>
    );
};

export default PageNotFound;
