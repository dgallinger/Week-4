const { Router } = require("express");
const router = Router();

const loginDAO = require('../daos/login');

// - Logout: `POST /login/logout`
router.post("/logout", async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing auth token');
    }
    try {
        const success = await loginDAO.logout(req.headers.authorization);
        if (success) {
            res.status(200).send('logout successful')
        } else {
            res.status(401).send('Invalid Token')
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// - Change Password `POST /login/password`
router.post("/password", async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send('Missing auth token');
    } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('Password required');
    } else {
        try {
            const token = req.headers.authorization;
            const password = req.body.password;
            const success = await loginDAO.changePassword(token, password);
            if (success) {
                res.status(200).send('Password changed');
            } else {
                res.status(401).send('Password not changed');
            }
        } catch (error) {
            res.status(500).send(error.message);    
        }
    }
});

router.use(async (req, res, next) => {
    if (!req.body.email || JSON.stringify(req.body.email) === '{}') {
        res.status(400).send('User ID Required');
    } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('Password Required');
    } else {
        next();
    }
});

router.post("/signup", async (req, res, next) => {
    try {
        const person = await loginDAO.signUp(req.body);
        if (person) {
            res.status(200).send('Account Created');
        } else {
            res.status(409).send('User ID already exists');
        }
        
    } catch (error) {
        res.status(500).send(error.message);
       }
});

// - Login: `POST /login`
router.post("/", async (req, res, next) => {
    try {
        const success = await loginDAO.login(req.body);
        if (success) {
            res.body = success;
            res.status(200).json(res.body);  
        } else {
            res.status(401).send('Invalid login credentials');
        }           
    } catch (error)  {
        res.status(500).send(error.message);
        }
});

module.exports = router;