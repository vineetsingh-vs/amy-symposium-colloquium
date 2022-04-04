import React from 'react';
import Link from "@mui/material/Link";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import Person from '@mui/icons-material/Person';
import Assignment from '@mui/icons-material/Assignment';
import List from '@mui/material/List';

export const documentItems = (
  <List>
    <ListItem button >
      <ListItemIcon>
        <Dashboard />
      </ListItemIcon>
      <Link href="/published" underline="hover">
        Dashboard
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Assignment />
      </ListItemIcon>
      <Link href="/1" underline="hover">
        Document
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <Link href="/1/reviews" underline="hover">
        Reviews
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <Link href="/1/share" underline="hover">
        Share With
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Assignment />
      </ListItemIcon>
      <Link href="/1/reupload" underline="hover">
        ReUpload
      </Link>
    </ListItem>
  </List>
);

export const secondaryListItems = (
  <List>
    <ListItem button >
      <ListItemIcon>
        <Dashboard />
      </ListItemIcon>
      <Link href="/published" underline="hover">
        Dashboard
      </Link>
    </ListItem>
  </List>
);

export const dashboardItems = (
  <List>
      <ListItem button>
          <ListItemIcon>
              <Assignment />
          </ListItemIcon>
          <Link href="./published" underline="hover">
              Published
          </Link>
      </ListItem>
      <ListItem button>
          <ListItemIcon>
              <People />
          </ListItemIcon>
          <Link href="./shared" underline="hover">
              Shared With Me
          </Link>
      </ListItem>
      <ListItem button>
          <ListItemIcon>
              <Person />
          </ListItemIcon>
          <Link href="./mypapers" underline="hover">
              My Papers
          </Link>
      </ListItem>
  </List>
);