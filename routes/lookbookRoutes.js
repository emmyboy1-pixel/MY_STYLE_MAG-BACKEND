import express  from "express";
import { renamelookbook } from "../controllers/lookbookController.js";
import { deleteLookbook } from "../controllers/lookbookController.js";
import { createLookbook } from "../controllers/lookbookController.js";


const router = express.Router();

router.post('/users/:userId/lookbooks', createLookbook
    // create a lookbook
);


router.get('/users/:userId/lookbooks', (req, res) => {
    // get all lookbook
});


router.get('/users/:userId/:lookbookId', (req, res) => {
    // get a sigle lookbook
});

// UPDATE lookbook (rename)
router.put('/users/:userId/lookbooks/:lookbookId', renamelookbook);

// DELETE lookbook
router.delete('/users/:userId/lookbooks/:lookbookId', deleteLookbook);


export default router;

router.get('/users/:userId/lookbooks', getAllLookBooks);
