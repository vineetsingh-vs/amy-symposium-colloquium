import { api } from "./api.config";

const resource = "extra";

const extraApi = {
    addLike: async (commentId, userId) => {
        return api()
            .put(`${resource}/${commentId}/like`, {
                userId: userId
            })
            .then((response) => response.data);
    },
    addDislike: async (commentId, userId) => {
        return api()
            .put(`${resource}/${commentId}/dislike`, {
                userId: userId
            })
            .then((response) => response.data);
    }
};

export default extraApi;