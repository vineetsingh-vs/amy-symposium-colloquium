import styled from "@emotion/styled";
import { DocRenderer } from "react-doc-viewer";
import PDFPages from "react-doc-viewer/build/plugins/pdf/components/pages/PDFPages"
import { PDFProvider } from "react-doc-viewer/build/plugins/pdf/state/index"
import PDFCustomControls from "./PDFControls/PDFCustomControls";

const Container = styled.div({
    display: "flex",
    overflowY: "auto",
    flex: "1",
    flexDirection: "column",
});

const CustomPDFRenderer: DocRenderer = ({ mainState }) => {
    return (
        <PDFProvider mainState={mainState}>
            <Container id="pdf-renderer" data-testid="pdf-renderer">
                <PDFCustomControls />
                <PDFPages />
            </Container>
        </PDFProvider>
    );
};

export default CustomPDFRenderer;

CustomPDFRenderer.fileTypes = ["pdf", "application/pdf"];
CustomPDFRenderer.weight = 0;