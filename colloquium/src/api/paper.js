import axios from "axios";
import { apiUrl } from "./api.config";

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
    getMetaDataById: async (paperId) => {
        return await axios
            .get(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
    getFileVersionById: async (paperId, versionId) => {
        return await axios
            .get(`${apiUrl}/${resource}/${paperId}/${versionId}`)
            .then((response) => response.data);
    },
    // update a paper metadata with paperInfo => {[authors], isPublished, creatorId, title}
    updateMetadata: async (paperId, paperInfo) => {
        return await axios
            .put(`${apiUrl}/${resource}/${paperId}`, paperInfo)
            .then((response) => response.data);
    },
    // update a paper's file version
    updateFileVersion: async (paperId, versionId, fileData) => {
        // TODO add file upload
        return await axios
            .get(`${apiUrl}/${resource}/${paperId}/${versionId}`)
            .then((response) => response.data);
    },
    // start sharing paper (paperId) with user (userId) and set permissions
    sharePaper: async (userId, paperId, permissions) => {},
    // stop sharing paper (paperId) with user (userId)
    stopSharingPaper: async (userId, paperId) => {},
    create: async (formData) => {
        return await axios
            .post(`${apiUrl}/${resource}`, formData)
            .then((response) => response.data);
    },
    delete: async (paperId) => {
        return await axios
            .delete(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
};

export default paperApi;
