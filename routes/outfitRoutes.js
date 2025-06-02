import express  from "express";
import { createOutfit } from "../controllers/outfitController.js";

const router = express.Router();

router.post('/outfits', createOutfit
    // create an outfit
);


router.get('/', (req, res) => {
    // get all outfit
});


router.get('/', (req, res) => {
    // get an outfit
});

router.put('/', (req, res) => {
    // update an outfit
});


router.delete('/', (req, res) => {
    // delete an outfit
});


export default router;