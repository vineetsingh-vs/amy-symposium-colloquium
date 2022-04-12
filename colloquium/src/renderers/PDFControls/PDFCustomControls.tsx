import React, {useState, useContext} from "react";
import styled from "@emotion/styled";
import { PDFContext } from "react-doc-viewer/build/plugins/pdf/state/index"
import PDFPagination from "react-doc-viewer/build/plugins/pdf/components/PDFPagination"
import { PageStore } from "../../views/DocumentView";

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

    return (
        <Container id="pdf-controls" >
            {context?.state?.numPages > 1 && <PDFPagination />}
            {
                PageStore.dispatch({ type: "Page_Change", newPage: context.state.currentPage }) != null &&
                console.log("Page Change")
                //ChangeCurrentPage(context.state.currentPage) != null
            }
        </Container>
    )
}

export default PDFCustomControls
