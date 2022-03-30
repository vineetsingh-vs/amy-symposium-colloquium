import express from "express";
import { getAllPapers, getPaperById, getPaperVersionById, addPaper, updatePaper, deletePaper, deletePaperVersion } from "../controllers/paper";

const router = express.Router();

/**Return all papers */
router.get('/', getAllPapers);
/**Return a paper of a specific id */
router.get('/:paperid', getPaperById);
/**Return a specific version of a paper */
router.get('/:paperid/:versionid', getPaperVersionById);

/**For creating an initial paper, creates all attributes of a paper, author, name, etc. 
 * Adds file to the list of revisions  */
router.post('/', addPaper); 

/**Upload a new version of an already existing paper */
router.put('/:paperid', updatePaper);

/**Delete a paper */
router.delete('/:paperid', deletePaper);
/**Delete a specific version of a paper */
router.delete('/:paperid/:versionid', deletePaperVersion);

export default router;