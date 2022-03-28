import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    Create,
    Edit,
    SimpleForm,
    TextInput,
} from "react-admin";

export const UserList = (props) => {
    return (
        <List {...props} bulkActionButtons={false} title={"Users"}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="username" />
                <EmailField source="email" />
                <TextField source="address.street" />
                <TextField source="phone" />
                <TextField source="website" />
                <TextField source="company.name" />
            </Datagrid>
        </List>
    );
};

export const UserCreate = (props) => {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="id" />
                <TextInput source="name" />
                <TextInput source="username" />
                <TextInput type="email" source="email" />
                <TextInput source="address.street" />
                <TextInput source="phone" />
                <TextInput source="website" />
                <TextInput source="company.name" />
            </SimpleForm>
        </Create>
    );
};

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
                <TextInput disabled source="id" />
                <TextInput source="name" />
                <TextInput source="username" />
                <TextInput type="email" source="email" />
                <TextInput source="address.street" />
                <TextInput source="phone" />
                <TextInput source="website" />
                <TextInput source="company.name" />
        </SimpleForm>
    </Edit>
);
