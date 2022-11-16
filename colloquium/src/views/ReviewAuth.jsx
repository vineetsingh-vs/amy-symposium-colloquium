import {useEffect, useState} from "react";
import paperApi from "../api/paper";

const ReviewAuth = ({match, history}) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        paperApi.validatePaperReview(match.params.token).then((data) => {
            if(!!data) {
                history.push(data.tokenObject.redirect_url);
            } else {
                setLoading(false);
            }
        });

    }, []);
    return (
        <div >
            {!!loading ? 'Loading ...' : 'UnAuthorised Access!!' }
        </div>
    );
};

export default ReviewAuth;
