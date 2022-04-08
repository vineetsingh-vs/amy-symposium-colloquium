import axios from "axios";
import { apiUrl } from "./api.config";

const resource = "comments";

//
// get list of
//  shared with me
//  my uploaded papers
//  all papers
const commentApi = {
    createComment: async (id, name, body, replies, paperId, versionId, page) => {
        return axios
            .post(`${apiUrl}/${resource}`, {
                versionId: versionId,
                parentId: null,
                content: body,
                pageNum: page,
                userId: name,
            })
            .then((response) => response.data);
    },
    getCommentsByPage: async (paperId, versionId, page) => {
        return axios
            .get(`${apiUrl}/${resource}/${paperId}/${versionId}/${page}`)
            .then((response) => response.data);
    }
};

export default commentApi;