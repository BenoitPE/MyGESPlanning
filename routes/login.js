const express = require('express')
var router = express.Router();
const myges = require("myges").default;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { encrypt, decrypt } = require('../crypto');
var pjson = require('../package.json');
let url = "https://raw.githubusercontent.com/BenoitPE/MyGESPlanning/main/package.json";
let settings = { method: "Get" };
var upToDate = true;
const APIConnection = require('../models/APIConnection.js');


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
        req.session.connected = true;
        req.session.username = req.body.username.split('@')[0];
        req.session.password = req.body.password;

        let api = new APIConnection(req.session.username, req.session.password);
        await api.login(req, res)
        
        if(api.api != undefined){
         req.session.profile = await api.getProfile();

         console.log("New user connected: " + req.session.username);
         res.redirect('/agenda');
        }
         else{
            req.session.destroy();
         }

    } catch (error) {
        req.session.destroy();
    }
})

module.exports = router;