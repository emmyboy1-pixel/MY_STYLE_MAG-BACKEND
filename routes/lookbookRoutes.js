import express  from "express";
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

router.put('/users/:userId/:lookbookId', (req, res) => {
    // update a lookbook
});


router.delete('/users/:userId/:lookbookId', (req, res) => {
    // delete a lookbook
});


export default router;
