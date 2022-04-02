import axios from "axios";
import { apiUrl } from "api.config";

const resource = "/papers";

//
// get list of
//  shared with me
//  my uploaded papers
//  all papers
const paperApi = {
    //
    // get all papers associated with a user
    //  filter user uploaded, shared with, or all associated papers
    getList: async (userId, filter) => {
        if (filter !== "shared" && filter !== "uploaded" && filter !== "all")
            return { message: "filter invalid" };

        const query = {
            userId: userId,
            filter: filter,
        };

        return await axios
            .get(`${apiUrl}/${resource}?${JSON.stringify(query)}`)
            .then((response) => response.data);
    },
    getOneById: async (paperId) => {
        return await axios
            .get(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
    update: async (paperId) => {
        return await axios
            .put(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
    create: async (paperId) => {
        return await axios
            .post(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
    delete: async (paperId) => {
        return await axios
            .delete(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
};

export default paperApi;
