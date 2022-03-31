import FileViewer from 'react-file-viewer';

const onError = e => {
    console.log(e, "error in file-viewer");
};

// Single Pdf: "https://s2.q4cdn.com/498544986/files/doc_downloads/test.pdf"
// Multi Pdf: "https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf"

const FileDisplay = () => {
    return (
        <FileViewer
            fileType={"pdf"}
            filePath={"https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf"}
            onError={onError}
        />
    );
};

export default FileDisplay