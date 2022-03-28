import React, { useEffect, useState } from "react";
import { Admin, Resource } from "react-admin";
import { UserList } from "../admin/UserList";
import jsonServerProvider from "ra-data-json-server";

// test data from json place holder site
const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const AdminDashboard = () => {
    return (
        <div className="adminDashboard">
            <Admin dataProvider={dataProvider} title={"Symposium"}>
                <Resource name="users" list={UserList} />
            </Admin>
        </div>
    );
};

export default AdminDashboard;
