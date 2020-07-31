const { Router } = require("express");
const router = Router();

const notesDAO = require('../daos/notes');

router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing auth token');
    }
    const token  = req.headers.authorization;
    const user = await notesDAO.validateToken(token);
    if (!user) {
        return res.status(401).send('invalid token');
    } else {
        req.userId = user;
        next();
    }
});

// - Create: `POST /notes`
router.post("/", async (req, res, next) => {
    try {
        const note = await notesDAO.createNote(req.body.text, req.userId);
        res.status(200);
        res.json(note);
    } catch (err) {
        res.status(500).send(err.message);
    }
    

});

// - Get all of my notes: `GET /notes`
router.get("/", async (req, res, next) => {
    try {
        const notes = await notesDAO.getNotesByUserId(req.userId);
        res.json(notes);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// - Get a single note: `GET /notes/:id`
router.get("/:id", async (req, res, next) => {
    try {
        const note = await notesDAO.getById(req.params.id, req.userId);
        if (note) {
            res.json(note);
        } else {
            res.status(404).send('note not found');
        }
    } catch (err) {
        if (err instanceof notesDAO.BadDataError) {
            res.status(400).send('Not valid book id');
        } else {
            res.status(500).send(err.message);
        }
    }

});


module.exports = router;