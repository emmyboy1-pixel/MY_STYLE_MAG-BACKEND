import express  from "express";
import { createUser } from "../controllers/userControler.js";

const router = express.Router();

router.post('/signup', createUser, (req, res) => {
    // create a user
});

router.post('/', (req, res) => {
    // login user
})

/*
router.get('/', (req, res) => {
    // get all users
});


router.get('/:id', (req, res) => {
    // get a sigle user
});

router.put('/:id', (req, res) => {
    // update a user
});


router.delete('/', (req, res) => {
    // delete a user
});
*/

export default router;