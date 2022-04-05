import React, {useState, useContext} from "react";
import styled from "@emotion/styled";
import { PDFContext } from "react-doc-viewer/build/plugins/pdf/state/index"
import PDFPagination from "react-doc-viewer/build/plugins/pdf/components/PDFPagination"
import { ChangeCurrentPage, ChangeCurrentVersion } from "../../views/DocumentView";
import { MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Container = styled.div({
    display: "flex",
    position:"sticky",
    top:0,
    left:0,
    zIndex:1,
    justifyContent:"flex-end",
    padding:"8px",
    boxShadow:"0px 2px 3px #00000033",
});


const PDFCustomControls = () => {
    const context = useContext(PDFContext)
    const [version, setVersion] = useState("1")

    const handleChange = (event: SelectChangeEvent) => {
        setVersion(event.target.value as string);
        ChangeCurrentVersion(event.target.value);
      };
    

    return (
        <Container id="pdf-controls" >
            {context?.state?.numPages > 1 && <PDFPagination />}
            {
                ChangeCurrentPage(context.state.currentPage) != null
            }
            <h3>Version</h3>
            <Select
                labelId="Version Select Label"
                id="Version Select"
                label="Version"
                value={version}
                onChange={(event) => handleChange(event)}
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
            </Select>
        </Container>
    )
}

export default PDFCustomControls
