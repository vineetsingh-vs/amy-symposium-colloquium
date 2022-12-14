import React from 'react';
import Link from "@mui/material/Link";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import Assignment from '@mui/icons-material/Assignment';
import PostAddIcon from '@mui/icons-material/PostAdd';
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
      <Link href="/papers" underline="hover">
        Dashboard
      </Link>
    </ListItem>
  </List>
)};

const CreatorItems = (versionId) => {
  let {paperId} = useParams()
  return(
    <List>
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
        <PostAddIcon />
      </ListItemIcon>
      <Link href={"/" + paperId + "/" + versionId.versionId + "/reupload"} underline="hover">
        New Version
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
          <Link href="/papers" underline="hover">
              Dashboard
          </Link>
      </ListItem>
  </List>
)};

export {
  DocumentItems,
  CreatorItems,
  SecondaryListItems,
  DashboardItems
};
