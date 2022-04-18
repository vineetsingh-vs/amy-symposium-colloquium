import React from "react";
import {
    Button,
    Container,
    Grid,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { usePaperTableStyles } from "../styles/paperViewStyles";
import paperApi from "../api/paper.js";

const convertNiceDate = (badDate) => {
    let date = new Date(badDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = "0" + dt;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return year + "-" + month + "-" + dt;
};

const PapersTable = ({ papers, filter, user }) => {
    const classes = usePaperTableStyles();

    const handleChangePublish = async (paperID, published) => {
        await paperApi.updateMetadata(paperID, {isPublished: published})
        window.location.replace("/papers");
    };

    return (
        <div className={classes.appBarSpacer}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Button variant="contained" color="primary" href="/upload">
                            UPLOAD
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>My Papers</TableCell>
                                    <TableCell>Paper Owner</TableCell>
                                    <TableCell>Most Recent Edit</TableCell>
                                    {filter === "uploaded" ? (
                                        <TableCell>Publish</TableCell>
                                    ) : (
                                        <></>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {papers.map((paper) => (
                                    <TableRow key={paper.id}>
                                        <TableCell>
                                            <Link
                                                href={
                                                    "/" + paper.id + "/" + paper.versionNumber
                                                }
                                                underline="hover"
                                            >
                                                {paper.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <React.Fragment>{paper.authors}</React.Fragment>
                                        </TableCell>
                                        <TableCell>
                                            {convertNiceDate(paper.updatedAt)}
                                        </TableCell>
                                        {filter === "uploaded" && paper.creator.id === user.id ? (
                                            <TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={paper.isPublished}
                                                            color="primary"
                                                            onChange={(e) => {
                                                                e.preventDefault()
                                                                handleChangePublish(
                                                                    paper.id,
                                                                    !paper.isPublished
                                                                )
                                                            }}
                                                        />
                                                    }
                                                />
                                            </TableCell>
                                        ) : (
                                            <></>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default PapersTable;
