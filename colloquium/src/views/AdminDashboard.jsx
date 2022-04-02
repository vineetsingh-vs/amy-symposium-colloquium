import {Admin, Resource} from "react-admin";
import {UserList, UserCreate, UserEdit} from "./admin-ui/user";
import dataProvider from "./admin-ui/dataprovider"
// import jsonServerProvider from "ra-data-json-server";

// test data from json place holder site
// const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const AdminDashboard = () => {
    return (
        <div className="adminDashboard">
            <Admin dataProvider={dataProvider} title={"Symposium"}>
                <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
            </Admin>
        </div>
    );
};

export default AdminDashboard;
