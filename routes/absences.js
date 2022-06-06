const express = require('express')
const APIConnection = require('../models/APIConnection.js');
var router = express.Router();

router.get('/', async function(req, res) {
    let api = new APIConnection(req.session.username, req.session.password);
    await api.login(req, res);

    res.render('absences', {
        profile: req.session.profile,
        absences: await api.getAbsences()
    });
})


module.exports = router;