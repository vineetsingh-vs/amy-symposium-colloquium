import express from "express";
import {
    getPaperList,
    getPaperMetaData,
    getPaperFileVersion,
    createPaper,
    updatePaperMetaData,
    updatePaperFileVersion,
    deletePaper,
    deletePaperVersion,
    sharePaper,
    stopSharingPaper,
} from "../controllers/paper";

const router = express.Router();

router.route("/").get(getPaperList).post(createPaper);
router.route("/:paperId").get(getPaperMetaData).put(updatePaperMetaData).delete(deletePaper);
router.route(":paperId/share").post(sharePaper).delete(stopSharingPaper);
router
    .route("/:paperId/:versionId")
    .get(getPaperFileVersion)
    .put(updatePaperFileVersion)
    .delete(deletePaperVersion);

export default router;
