import React from 'react';
import Link from "@mui/material/Link";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import Person from '@mui/icons-material/Person';
import Assignment from '@mui/icons-material/Assignment';
import List from '@mui/material/List';
import {useParams} from "react-router-dom";

const DocumentItems = (versionId) => {
  let {paperId} = useParams()
  return (
  <List>
    <ListItem>
      <ListItemIcon>
        <Dashboard />
      </ListItemIcon>
      <Link href="/published" underline="hover">
        Dashboard
      </Link>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <Assignment />
      </ListItemIcon>
      <Link href={"/" + paperId + "/" + versionId.versionId} underline="hover">
        Document
      </Link>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <Link href={"/" + paperId + "/" + versionId.versionId + "/reviews"} underline="hover">
        Reviews
      </Link>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <Link href={"/" + paperId + "/" + versionId.versionId + "/share"} underline="hover">
        Share With
      </Link>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <Assignment />
      </ListItemIcon>
      <Link href={"/" + paperId + "/" + versionId.versionId + "/reupload"} underline="hover">
        ReUpload
      </Link>
    </ListItem>
  </List>
)};

const SecondaryListItems = () => {
  return(
  <List>
    <ListItem>
      <ListItemIcon>
                  <Dashboard />
              </ListItemIcon>
      <Link href="/papers" underline="hover">
        Dashboard
      </Link>
    </ListItem>
  </List>
)};

const DashboardItems = () => {
  return (
  <List>
      <ListItem>
          <ListItemIcon>
              <Assignment />
          </ListItemIcon>
          <Link href="/published" underline="hover">
              Published
          </Link>
      </ListItem>
      <ListItem>
          <ListItemIcon>
              <People />
          </ListItemIcon>
          <Link href="/shared" underline="hover">
              Shared With Me
          </Link>
      </ListItem>
      <ListItem>
          <ListItemIcon>
              <Person />
          </ListItemIcon>
          <Link href="/mypapers" underline="hover">
              My Papers
          </Link>
      </ListItem>
  </List>
)};

export {
  DocumentItems,
  SecondaryListItems,
  DashboardItems
};
