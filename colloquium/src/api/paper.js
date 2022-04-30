import { api, apiUrl } from "./api.config";

const resource = "papers";

const paperApi = {
    getList: async (filter) => {
        if (filter !== "shared" && filter !== "uploaded" && filter !== "published" && filter !== "search")
            return { message: "filter invalid" };

        return api()
            .get(`${resource}?filter=${filter}`)
            .then((response) => {
                return response.data;
            });
    },
    getMetaDataById: async (paperId) => {
        return await api()
            .get(`${resource}/${paperId}`)
            .then((response) => response.data);
    },
    // Gets the document URI that is needed to display the document
    getDocumentURI: (paperId, versionId) => {
        return `${apiUrl}${resource}/${paperId}/${versionId}`;
    },
    getFileVersionById: async (paperId, versionId) => {
        return await api()
            .get(`${resource}/${paperId}/${versionId}`)
            .then((response) => response.data);
    },
    // update a paper metadata with paperInfo => {[authors], isPublished, creatorId, title}
    updateMetadata: async (paperId, paperInfo) => {
        return await api()
            .put(`${resource}/${paperId}`, paperInfo)
            .then((response) => response.data);
    },
    // update a paper's file version
    updateFileVersion: async (paperId, formData) => {
        // TODO add file upload
        return await api()
            .put(`${resource}/${paperId}/reupload`, formData)
            .then((response) => response.data);
    },
    // start sharing paper (paperId) with user (userId) and set permissions
    sharePaper: async (sharedUserEmail, paperId) => {
        return api().post(`${resource}/${paperId}/share`, {
            sharedUserEmail,
        });
    },
    // stop sharing paper (paperId) with user (userId)
    stopSharingPaper: async (sharedUserEmail, paperId) => {
        return api().put(`${resource}/${paperId}/share`, {
            sharedUserEmail,
        });
    },
    create: async (formData) => {
        return api()
            .post(`${resource}`, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((response) => response.data);
    },
    delete: async (paperId) => {
        return await api()
            .delete(`${resource}/${paperId}`)
            .then((response) => response.data);
    },
};

export default paperApi;
