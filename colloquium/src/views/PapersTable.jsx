import React, {useState} from "react";
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
    TextField,
    Switch,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem
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
    const [searchInput, setSearchInput] = useState("");
    const [SearchParam, setSearchParam] = useState("Title");

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchInput(lowerCase);
    };

    const searchParamChange = (event) => {
        setSearchParam(event.target.value);
    };

    const handleChangePublish = async (paperID, published) => {
        await paperApi.updateMetadata(paperID, {isPublished: published})
        window.location.replace("/papers");
    };

    const containsAuthor = (authorsList, searchInput) => {
        for(let i = 0; i < authorsList.length; i++){
            if(authorsList[i].toLowerCase().includes(searchInput.toLowerCase())){
                return true;
            }
        }
        return false;
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

                    <Grid item xs={10} md={10} lg={10}>
                    <InputLabel>Search</InputLabel>
                    <TextField
                        id="outlined-basic"
                        onChange={inputHandler}
                        variant="outlined"
                        fullWidth
                        />
                    
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    <InputLabel>Search By</InputLabel>
                    <Select
                        value={SearchParam}
                        label="Search By"
                        onChange={searchParamChange}
                    >
                        <MenuItem value={"Title"}>Document Title</MenuItem>
                        <MenuItem value={"Owner"}>Document Author</MenuItem>
                    </Select>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Document Title</TableCell>
                                    <TableCell>Document Author</TableCell>
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
                                        {searchInput === "" || (SearchParam === "Title" && paper.title.toLowerCase().includes(searchInput.toLowerCase())) || (SearchParam === "Owner" && containsAuthor(paper.authors, searchInput)) ? (
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
                                        ) : (
                                            <></>
                                        )}

                                        {searchInput === "" || (SearchParam === "Title" && paper.title.toLowerCase().includes(searchInput.toLowerCase())) || (SearchParam === "Owner" && containsAuthor(paper.authors, searchInput)) ? (
                                            <TableCell>
                                                <React.Fragment>{paper.authors}</React.Fragment>
                                            </TableCell>
                                        ) : (
                                            <></>
                                        )}

                                        {searchInput === "" || (SearchParam === "Title" && paper.title.toLowerCase().includes(searchInput.toLowerCase())) || (SearchParam === "Owner" && containsAuthor(paper.authors, searchInput)) ? (
                                            <TableCell>
                                                {convertNiceDate(paper.updatedAt)}
                                            </TableCell>
                                        ) : (
                                            <></>
                                        )}
                                        
                                        {(filter === "uploaded" && paper.creator.id === user.id) && (searchInput === "" || (SearchParam === "Title" && paper.title.toLowerCase().includes(searchInput.toLowerCase())) || (SearchParam === "Owner" && containsAuthor(paper.authors, searchInput))) ? (
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
