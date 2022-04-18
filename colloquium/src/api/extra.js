import axios from "axios";
import { apiUrl } from "./api.config";

const resource = "extra";

const extraApi = {
    addLike: async (commentId, userId) => {
        return axios
            .put(`${apiUrl}/${resource}/${commentId}/like`, {
                userId: userId
            })
            .then((response) => response.data);
    },
    addDislike: async (commentId, userId) => {
        return axios
            .put(`${apiUrl}/${resource}/${commentId}/dislike`, {
                userId: userId
            })
            .then((response) => response.data);
    }
};

export default extraApi;