import * as React from "react";
import {
    List,
    Datagrid,
    PasswordInput,
    TextField,
    DateField,
    DateInput,
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
                <TextField label="Affiliation" source="affiliation" />
                <EmailField label="Email" source="email" />
                <DateField source="createdAt" label="Created At" />
                <TextField label="First Name" source="firstName" />
                <TextField label="ID" source="id" />
                <TextField label="Last Name" source="lastName" />
                <TextField label="Roles" source="roles" />
                <DateField source="updatedAt" label="Updated At" />
                <TextField label="Username" source="username" />
            </Datagrid>
        </List>
    );
};

export const UserCreate = (props) => {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput label="Affiliation" source="affiliation" />
                <TextInput label="Email" type="email" source="email" />
                <TextInput label="First Name" source="firstName" />
                <TextInput label="Last Name" source="lastName" />
                <TextInput label="Roles" source="roles" />
                <TextInput label="Username" source="username" />
                <PasswordInput label="Password" source="password" />
            </SimpleForm>
        </Create>
    );
};

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
                <TextInput label="Affiliation" source="affiliation" />
                <TextInput type="email" source="email" />
                <TextInput label="First Name" source="firstName" />
                <TextInput label="Last Name" source="lastName" />
                <TextInput label="Username" source="username" />
        </SimpleForm>
    </Edit>
);
