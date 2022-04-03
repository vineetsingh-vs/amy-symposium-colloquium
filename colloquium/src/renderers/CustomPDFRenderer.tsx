import styled from "@emotion/styled";
import { DocRenderer } from "react-doc-viewer";
import PDFPages from "react-doc-viewer/build/plugins/pdf/components/pages/PDFPages"
import PDFControls from "react-doc-viewer/build/plugins/pdf/components/PDFControls"
import { PDFProvider } from "react-doc-viewer/build/plugins/pdf/state/index"

const Container = styled.div({
    display: "flex",
    overflowY: "auto",
    flexDirection: "column",
});

const CustomPDFRenderer: DocRenderer = ({ mainState }) => {
    return (
        <PDFProvider mainState={mainState}>
            <Container id="pdf-renderer" data-testid="pdf-renderer">
                <PDFControls />
                <PDFPages />
            </Container>
        </PDFProvider>
    );
};

export default CustomPDFRenderer;

CustomPDFRenderer.fileTypes = ["pdf", "application/pdf"];
CustomPDFRenderer.weight = 0;