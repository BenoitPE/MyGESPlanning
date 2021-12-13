const express = require('express')
var router = express.Router();
let api = undefined;

router.get('/', async function(req, res) {
    api = req.app.get('api');

    res.render('notes', {
        profile: req.session.profile,
        notes: await api.getGrades("2021")
    });
})

module.exports = router;