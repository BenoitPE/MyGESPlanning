const express = require('express')
var router = express.Router();
const myges = require("myges").default;

router.get('/', async function(req, res) {

    res.render('login', {
        error: ""
    });
})

router.post('/', async function(req, res) {
    try {
        await login(req.body.username, req.body.password)
            .then(apiPromessResolved => {
                req.app.set('api', apiPromessResolved);
            });

        req.session.connected = true;
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        req.session.profile = await (req.app.get('api').getProfile());

        res.redirect('/agenda');
    } catch (error) {
        res.render('login', {
            error: error
        });
    }
    req.session.username = "test";
})

async function login(username, password) {
    let mygesApi = await myges.login(username, password)
    return mygesApi;
}

module.exports = router;