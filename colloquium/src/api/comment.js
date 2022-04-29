import { api, } from "./api.config";

const resource = "comments";

const commentApi = {
    createComment: async (paperId, versionId, parentId, name, body, page) => {
        return api()
            .post(`${resource}`, {
                paperId: paperId,
                versionId: versionId,
                parentId: parentId,
                name: name,
                content: body,
                pageNum: page,
            })
            .then((response) => response.data);
    },
    getCommentsByPage: async (paperId, versionId, page) => {
        return api()
            .get(`${resource}/${paperId}/${versionId}/${page}`)
            .then((response) => response.data);
    },
    getCommentsByPaperVersion: async (paperId, versionId) => {
        return api()
            .get(`${resource}/${paperId}/${versionId}`)
            .then((response) => response.data);
    },
};

export default commentApi;
