const express = require('express')
var router = express.Router();
let api = undefined;

router.get('/', async function(req, res) {
    api = req.app.get('api');

    let grades = await getGrades();

    res.render('notes', {
        profile: req.session.profile,
        notes: grades,
        semesters : getSemesters(grades)
    });
})

router.get('/json', async function(req, res) {
    api = req.app.get('api');

    let grades = await getGrades();

    res.json(getSemesters(grades));
})

function getSemesters(grades) {
    var semesters = [];
    for(var course of grades) {

        let s = {"semester_name": course.trimester_name, "semester_id": course.trimester};
        if(semesters.filter(e => e.semester_name == s.semester_name && e.semester_id == s.semester_id).length == 0) {
            semesters.push(s);
        }
    }
    return semesters;
}

async function getGrades() {
    let notes = await api.getGrades("2021");
    notes.sort((a,b) => (a.course > b.course) ? 1 : ((b.course > a.course) ? -1 : 0))
    notes.sort(function(a,b) {
        return a.trimester - b.trimester;
    });
    return notes;
}


module.exports = router;