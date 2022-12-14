import { fetchUtils } from "react-admin";
const apiUrl = "http://localhost:4000/v1";
const httpClient = fetchUtils.fetchJson;

// used by react-api to perform actions on backend
const dataProvider = {
    getList: async (resource) =>
        httpClient(`${apiUrl}/${resource}`).then(({ json }) => ({
            data: json,
            total: 20,
        })),

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "DELETE",
        }).then(({ json }) => ({ data: json })),
};

export default dataProvider;
