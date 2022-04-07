import React from "react";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import styled from "@emotion/styled";

const Container = styled.div({
    width:"100%"
});

const CustomXLSXRenderer = ({mainState: {currentDocument}}) => {
    if(!currentDocument) return null;
    let cols = []
    let rows = []

    ExcelRenderer(currentDocument.uri, (err, resp) => {
        if(err) console.log(err);
        else {
            cols = resp.cols;
            rows = resp.rows;
        }
    });

    return (
        <Container id="xlsx-renderer">
            <OutTable data={rows} columns={cols} />
        </Container>
    )
}

export default CustomXLSXRenderer;

const XLSXMaps = {
    xls: ["xls", "application/vnd.ms-excel"],
    xlsx: [
      "xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
}

CustomXLSXRenderer.fileTypes = [
    ...XLSXMaps.xls,
    ...XLSXMaps.xlsx
];
CustomXLSXRenderer.weight = 0;
CustomXLSXRenderer.fileLoader = ({fileLoaderComplete}) => fileLoaderComplete();