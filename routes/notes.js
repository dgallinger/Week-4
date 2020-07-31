const { Router } = require("express");
const router = Router();

const notesDAO = require('../daos/notes');

router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing auth token');
    }
    const token  = req.headers.authorization;
    //console.log(token);
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
        const note = await notesDAO.getById(req.params.id);
        if (note) {
            res.json(note);
        } else {
            res.status(401).send('note not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }

});


module.exports = router;