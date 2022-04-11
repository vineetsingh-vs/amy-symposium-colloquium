import axios from "axios";
import { apiUrl } from "./api.config";

const resource = "auth";

export const setConfig = (token) => {
    return {
        headers: { "x-auth-token": token },
    };
};

const authApi = {
    login: async (email, password) => {
        const response = await axios.post(`${apiUrl}/${resource}/login`, {
            email,
            password,
        });
        return response.data;
    },

    signup: async (email, password) => {
        const response = await axios.post(`${apiUrl}/${resource}/signup`, {
            email,
            password,
        });
        return response.data;
    },
};

export default authApi;
