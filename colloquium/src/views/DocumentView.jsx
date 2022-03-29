import React from "react";
import DocViewer from "react-doc-viewer";
import { withRouter } from "react-router-dom";

class DocumentView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            version: 1,
        };

        this.addComment = this.addComment.bind(this);
        this.addReplyComment = this.addReplyComment.bind(this);

        this.reupload = this.reupload.bind(this);

        this.handleShare = this.handleShare.bind(this);
        this.handleVersion = this.handleVersion.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
    }

    // Adds comment to specific paperId/pageId
    addComment(paperId, pageId, commentId) {}

    // Adds reply to a previous parent comment
    addReplyComment(paperId, pageId, parentCommentId, commentId) {}

    // Page to reupload document for the next version
    reupload(paperId, versionId) {}

    // Adding or Deleting people allowed to view paper
    handleShare(paperId) {}

    // Update version number and "clear" comments / reviews
    handleVersion(paperId) {}

    // Views: Review, Documents, Comments, or Document and Comments
    handleViewChange(paperId) {}

    render() {
        return <h1>THIS IS TESTING THE VIEW OF A DOCUMENT</h1>;
    }
}

export default withRouter(DocumentView);

