const express = require('express')
var router = express.Router();
const APIConnection = require('../models/APIConnection.js');

router.get('/', async function (req, res) {
   let api = new APIConnection(req.session.username, req.session.password);
   await api.login(req, res);

   let grades = await api.getGrades();

   if (grades == null || grades == NaN || grades == undefined) {
      res.redirect('/agenda');
   } else {
      res.render('notes', {
         profile: req.session.profile,
         notes: grades,
         semesters: getSemesters(grades)
      });
   }
})

function getSemesters(grades) {
   var semesters = [];
   for (var grade of grades) {
      for (const course of grade) {
         let s = { "semester_name": course.year + " - " + course.trimester_name, "semester_id": course.year*course.trimester };
         if (semesters.filter(e => e.semester_name == s.semester_name && e.semester_id == s.semester_id).length == 0) {
            semesters.push(s);
         }
      }
   }
   return semesters;
}

module.exports = router;