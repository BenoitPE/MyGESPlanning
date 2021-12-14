const express = require('express')
const moment = require('moment');
var router = express.Router();
let api = undefined;

router.get('/', async function(req, res) {
    api = req.app.get('api');

    res.render('absences', {
        profile: req.session.profile,
        absences: await getAbsences("2021")
    });
})


async function getAbsences(year) {
    let apiAbsences = await api.getAbsences(year);
    let absencesArray = [];

    for (var abs in apiAbsences) {
        let data = {
            date: moment(apiAbsences[abs].date).format('DD/MM/YYYY, HH:mm:ss'),
            course_name: apiAbsences[abs].course_name,
            trimester: apiAbsences[abs].trimester_name,
            year: apiAbsences[abs].year,
            justified: apiAbsences[abs].justified
        }
        absencesArray.push(data);
    }

    return absencesArray;
}

module.exports = router;