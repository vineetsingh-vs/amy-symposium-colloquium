import { DocRenderer } from "react-doc-viewer";
import PDFPages from "react-doc-viewer/build/plugins/pdf/components/pages/PDFPages"
import { PDFProvider } from "react-doc-viewer/build/plugins/pdf/state/index"

const CustomPDFRenderer: DocRenderer = ({ mainState }) => {
    return (
        <div>
        {/* <PDFProvider mainState={mainState}>
            <PDFPages />
        </PDFProvider> */}
        </div>
    );
};

export default CustomPDFRenderer;

CustomPDFRenderer.fileTypes = ["pdf", "application/pdf"];
CustomPDFRenderer.weight = 0;