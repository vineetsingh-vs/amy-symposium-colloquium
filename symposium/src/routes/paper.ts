import express from "express";
import { jwt } from "../loaders/jwt";
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

router.route("/").get(jwt, getPaperList).post(jwt, createPaper);
router.route("/:paperId").get(jwt, getPaperMetaData).put(jwt, updatePaperMetaData).delete(jwt, deletePaper);
router.route("/:paperId/share").post(jwt, sharePaper).put(jwt, stopSharingPaper);
router.route("/:paperId/reupload").put(jwt, updatePaperFileVersion);
router.route("/:paperId/:versionId").get(getPaperFileVersion).delete(jwt, deletePaperVersion);

export default router;
