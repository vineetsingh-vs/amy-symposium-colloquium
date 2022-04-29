import { api, apiUrl } from "./api.config";

const resource = "users";

const userApi = {
    getList: async () => {
        return await api.get(`${resource}`).then((response) => response.data);
    },
    getOneByEmail: async(userEmail) => {
        return await api
            .get(`${resource}/${userEmail}`)
            .then((response) => response.data);
    },
    getOneById: async (userId) => {
        return await api
            .get(`${resource}/${userId}`)
            .then((response) => response.data);
    },
    // update a user with userInfo => { firstName, lastName, affiliation, email, username, password }
    update: async (userId, userInfo) => {
        return await api
            .put(`${resource}/${userId}`, userInfo)
            .then((response) => response.data);
    },
    // signup with userInfo => { firstName, lastName, affiliation, email, username, password }
    signUp: async (userInfo) => {
        return await api
            .post(`${resource}`, userInfo)
            .then((response) => response.data);
    },
    // signin a user with email and password
    signIn: async (email, password) => {
        return await api
            .post(`${resource}`, { email: email, password: password })
            .then((response) => response.data);
    },
    delete: async (userId) => {
        return await api
            .delete(`${resource}/${userId}`)
            .then((response) => response.data);
    },
};

export default userApi;
