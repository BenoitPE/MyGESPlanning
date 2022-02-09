const express = require('express')
var router = express.Router();
const myges = require("myges").default;
const fetch = require('node-fetch');
var pjson = require('../package.json');
let url = "https://raw.githubusercontent.com/BenoitPE/MyGESPlanning/main/package.json";
let settings = { method: "Get" };
var upToDate = true;

//Check if newest version
fetch(url, settings)
.then(res => res.json())
.then((json) => {
    if(json.version != pjson.version){
        upToDate = false;
    }
});

router.get('/', async function(req, res) {
    res.render('login', {
        upToDate: upToDate,
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