import React, {useContext} from "react";
import styled from "@emotion/styled";
import { PDFContext } from "react-doc-viewer/build/plugins/pdf/state/index"
import PDFPagination from "react-doc-viewer/build/plugins/pdf/components/PDFPagination"

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
    // Can get current page number from here!!!!
    const context = useContext(PDFContext)

    return (
        <Container id="pdf-controls">
            {context?.state?.numPages > 1 && <PDFPagination />}
        </Container>
    )
}

export default PDFCustomControls