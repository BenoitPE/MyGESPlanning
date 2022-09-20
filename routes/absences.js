const express = require('express')
const APIConnection = require('../models/APIConnection.js');
var router = express.Router();

router.get('/', async function (req, res) {
   let api = new APIConnection(req.session.username, req.session.password);
   await api.login(req, res);
   let absences = await api.getAbsences();
   if (absences == null || absences == NaN || absences == undefined) {
      res.redirect('/agenda');
   } else {
      res.render('absences', {
         profile: req.session.profile,
         absences: absences,
         yearAbsence: getYearAbsence(absences)
      });
   }
})

function getYearAbsence(absences) {
   var yearAbsence = [];
      for (const absence of absences) {
         let s = { "year_name": absence.year + " - " + (absence.year+1), "year_id": absence.year*absence.year};
         if (yearAbsence.filter(e => e.year_name == s.year_name && e.year_id == s.year_id).length == 0) {
            yearAbsence.push(s);
         }
      }
   return yearAbsence;
}

module.exports = router;