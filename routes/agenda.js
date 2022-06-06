const express = require('express')
var router = express.Router();
const APIConnection = require('../models/APIConnection.js');
let api = undefined;

router.get('/', async function(req, res) {
    api = new APIConnection(req.session.username, req.session.password);
    await api.login(req, res);

    let week = getWeekDays(new Date(Date.now()));

    res.render('agenda', {
        datePicker: DateToString(new Date(Date.now())),
        agenda: await api.getAgenda(week),
        profile: req.session.profile,
        dateToday: YYYYMMDDToDDMMYYYY(DateToString(GetDateToday()))
    });
})

router.post('/', async function(req, res) {
    let selectedDate = new Date(Date.now())
    let selectedDateString = DateToString(selectedDate);
    if (req.body.dateTimePicker !== "") {
        selectedDate = APIConnection.stringToDate(YYYYMMDDToDDMMYYYY(req.body.dateTimePicker), 12, 0, 0);
        selectedDateString = req.body.dateTimePicker;
    }

    let week = getWeekDays(selectedDate);

    res.render('agenda', {
        datePicker: selectedDateString,
        agenda: await api.getAgenda(week),
        profile: req.session.profile,
        dateToday: YYYYMMDDToDDMMYYYY(DateToString(GetDateToday()))

    });
})

function getWeekDays(current) {
    var week = new Array();
    current.setDate((current.getDate() - current.getDay() + 1));
    for (var i = 0; i < 7; i++) {
        var newDate = new Date(current);

        let dd = "";
        if (newDate.getDate() < 10) dd += "0";
        dd += newDate.getDate();

        let mm = "";
        if ((newDate.getUTCMonth() + 1) < 10) mm += "0";
        mm += (newDate.getUTCMonth() + 1);

        let yyyy = newDate.getUTCFullYear();

        newDateTxt = dd + "/" + mm + "/" + yyyy
        week.push(newDateTxt);
        current.setDate(current.getDate() + 1);
    }
    return week;
}


function DateToString(date) {
    let dateString = date.getUTCFullYear() + "-";
    if ((date.getUTCMonth() + 1 < 10)) dateString += "0";
    dateString += (date.getUTCMonth() + 1) + "-";
    if (date.getDate() < 10) dateString += "0";
    dateString += date.getDate();

    return dateString;
}

function GetDateToday() {
    var date = new Date();
    return date;
}

function YYYYMMDDToDDMMYYYY(text) {
    return text.substring(8, 10) + "/" + text.substring(5, 7) + "/" + text.substring(0, 4);
}

module.exports = router;