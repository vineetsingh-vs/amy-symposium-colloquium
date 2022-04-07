import React from "react";
import styled from "@emotion/styled";

const Container = styled.div({
    width:"100%"
});

const IFrame = styled.iframe({
    width:"100%",
    height:"100%",
    border:"0"
})

const CustomMSDocRenderer = ({mainState: {currentDocument}}) => {
    if(!currentDocument) return null;

    return (
        <Container id="msdoc-renderer">
            <IFrame
                id="msdoc-iframe"
                title="msdoc-iframe"
                frameBorder={0}
                src={`https://docs.google.com/gview?url=${encodeURIComponent(currentDocument.uri)}&embedded=true`}
            />
        </Container>
    )
}

export default CustomMSDocRenderer;


const MSDocFTMaps = {
    doc: ["doc", "application/msword"],
    docx: [
      "docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    xls: ["xls", "application/vnd.ms-excel"],
    xlsx: [
      "xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    ppt: ["ppt", "application/vnd.ms-powerpoint"],
    pptx: [
      "pptx",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  };

  CustomMSDocRenderer.fileTypes = [
    ...MSDocFTMaps.doc,
    ...MSDocFTMaps.docx,
    ...MSDocFTMaps.xls,
    ...MSDocFTMaps.xlsx,
    ...MSDocFTMaps.ppt,
    ...MSDocFTMaps.pptx,
  ];
  CustomMSDocRenderer.weight = 0;
  CustomMSDocRenderer.fileLoader = ({ fileLoaderComplete }) => fileLoaderComplete();