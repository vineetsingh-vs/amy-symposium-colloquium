import axios from "axios";
import { apiUrl } from "./api.config";

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
    // update a user with userInfo => { firstName, lastName, affiliation, email, username, password }
    update: async (userId, userInfo) => {
        return await axios
            .put(`${apiUrl}/${resource}/${userId}`, userInfo)
            .then((response) => response.data);
    },
    // signup with userInfo => { firstName, lastName, affiliation, email, username, password }
    signUp: async (userInfo) => {
        return await axios
            .post(`${apiUrl}/${resource}`, userInfo)
            .then((response) => response.data);
    },
    // signin a user with email and password
    signIn: async (email, password) => {
        return await axios
            .post(`${apiUrl}/${resource}`, { email: email, password: password })
            .then((response) => response.data);
    },
    delete: async (userId) => {
        return await axios
            .delete(`${apiUrl}/${resource}/${userId}`)
            .then((response) => response.data);
    },
};

export default userApi;
