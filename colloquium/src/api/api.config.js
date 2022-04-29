import axios from "axios";

export const apiUrl = "http://localhost:4000/v1/";



export const api = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return axios.create({
        baseURL: apiUrl,
        headers: { Authorization: `Bearer ${userInfo.token}`}
    });
};

export const authApi = () => {
    return axios.create({
        baseURL: apiUrl,
    });
};

export const setApiToken = (token) => {
    api().defaults.headers.common["Authorization"] = `Bearer ${token}`;
};