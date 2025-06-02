import express  from "express";
import { createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post('/', createCategory );


router.get('/', (req, res) => {
    // get all category
});


router.get('/:id', (req, res) => {
    // get a single category
});

router.put('/', (req, res) => {
    // update a category
});


router.delete('/', (req, res) => {
    // delete a category
});


export default router;