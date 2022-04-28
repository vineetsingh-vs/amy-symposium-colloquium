import React from "react";
import styled from "@emotion/styled";

const Container = styled.div({
    width:"100%"
});

const CustomMSDocRenderer = ({mainState: {currentDocument}}) => {
    if(!currentDocument) return null;

    return (
        <Container id="msdoc-renderer">
            <h3>{currentDocument.fileType}</h3>-- Is not supported at this time.
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