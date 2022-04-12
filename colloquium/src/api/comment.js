import axios from "axios";
import { apiUrl } from "./api.config";

const resource = "comments";

//
// get list of
//  shared with me
//  my uploaded papers
//  all papers
const commentApi = {
    createComment: async (paperId, versionId, parentId, name, body, page) => {
        return axios
            .post(`${apiUrl}/${resource}`, {
                paperId: paperId,
                versionId: versionId,
                parentId: parentId,
                userId: name,
                content: body,
                pageNum: page,
            })
            .then((response) => response.data);
    },
    getCommentsByPage: async (paperId, versionId, page) => {
        return axios
            .get(`${apiUrl}/${resource}/${paperId}/${versionId}/${page}`)
            .then((response) => response.data);
    },
    getCommentsByPaperVersion: async (paperId, versionId) => {
        return axios
            .get(`${apiUrl}/${resource}/${paperId}/${versionId}`)
            .then((response) => response.data);
    },
};

export default commentApi;