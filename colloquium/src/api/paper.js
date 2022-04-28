import axios from "axios";
import { apiUrl } from "./api.config";

const resource = "papers";

const paperApi = {
    getList: async (userId, filter) => {
        if (filter !== "shared" && filter !== "uploaded" && filter !== "published" && filter !== "search")
            return { message: "filter invalid" };

        return axios
            .get(`${apiUrl}/${resource}?userId=${userId}&filter=${filter}`)
            .then((response) => {
                return response.data;
            });
    },
    getMetaDataById: async (paperId) => {
        return await axios
            .get(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
    // Gets the document URI that is needed to display the document
    getDocumentURI: (paperId, versionId) => {
        return `${apiUrl}/${resource}/${paperId}/${versionId}`;
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
    updateFileVersion: async (paperId, userId, formData) => {
        // TODO add file upload
        return await axios
            .put(`${apiUrl}/${resource}/${paperId}/${userId}/reupload`, formData)
            .then((response) => response.data);
    },
    // start sharing paper (paperId) with user (userId) and set permissions
    sharePaper: async (userId, sharedUserEmail, paperId) => {
        return await axios.post(`${apiUrl}/${resource}/${paperId}/share`, {
            userId,
            sharedUserEmail,
        });
    },
    // stop sharing paper (paperId) with user (userId)
    stopSharingPaper: async (userId, sharedUserEmail, paperId) => {
        return await axios.put(`${apiUrl}/${resource}/${paperId}/share`, {
            userId,
            sharedUserEmail,
        });
    },
    create: async (formData) => {
        return axios
            .post(`${apiUrl}/${resource}`, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((response) => response.data);
    },
    delete: async (paperId) => {
        return await axios
            .delete(`${apiUrl}/${resource}/${paperId}`)
            .then((response) => response.data);
    },
};

export default paperApi;
