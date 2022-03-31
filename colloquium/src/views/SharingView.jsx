import React from "react";
import {
    TextField,
    Button,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    List,
    ListItem,

} from '@material-ui/core'

const SharingView = () => {
    return (
        <div className="sharingView">
            <h1>Enter New Person to Share With</h1>
            <TextField id="outlined-basic" label="Share With" variant="outlined" />
            <br></br>
            <Button variant="contained">Submit</Button>
            <br></br>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Currently Shared With</TableCell>
                        <TableCell>Delete?</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Anakin</TableCell>
                        <TableCell><Button variant="contained">Delete</Button></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Obi-Wan</TableCell>
                        <TableCell><Button variant="contained">Delete</Button></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <br></br>
        </div>
       
    );
};


export default SharingView;
