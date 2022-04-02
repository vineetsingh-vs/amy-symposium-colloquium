import axios from "axios";
import { apiUrl } from "api.config";

const resource = "/users";

const userApi = {
    getList: async () => {
        return await axios.get(`${apiUrl}/${resource}`).then((response) => response.data);
    },
    getOneById: async (userId) => {
        return await axios
            .get(`${apiUrl}/${resource}/${userId}`)
            .then((response) => response.data);
    },
    update: async (userId) => {
        return await axios
            .put(`${apiUrl}/${resource}/${userId}`)
            .then((response) => response.data);
    },
    create: async (userId) => {
        return await axios
            .post(`${apiUrl}/${resource}/${userId}`)
            .then((response) => response.data);
    },
    delete: async (userId) => {
        return await axios
            .delete(`${apiUrl}/${resource}/${userId}`)
            .then((response) => response.data);
    },
};

export default userApi;
