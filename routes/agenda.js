const express = require('express')
const moment = require('moment');
var router = express.Router();
let api = undefined;

router.get('/', async function(req, res) {
    api = req.app.get('api');

    let week = getWeekDays(new Date(Date.now()));

    res.render('agenda', {
        datePicker: DateToString(new Date(Date.now())),
        agenda: await getAgenda(week),
        profile: req.session.profile,
        dateToday: YYYYMMDDToDDMMYYYY(DateToString(GetDateToday()))
    });
})

router.post('/', async function(req, res) {
    let selectedDate = new Date(Date.now())
    let selectedDateString = DateToString(selectedDate);
    if (req.body.dateTimePicker !== "") {
        selectedDate = StringToDate(YYYYMMDDToDDMMYYYY(req.body.dateTimePicker), 12, 0, 0);
        selectedDateString = req.body.dateTimePicker;
    }

    let week = getWeekDays(selectedDate);

    res.render('agenda', {
        datePicker: selectedDateString,
        agenda: await getAgenda(week),
        profile: req.session.profile,
        dateToday: YYYYMMDDToDDMMYYYY(DateToString(GetDateToday()))

    });
})

async function getAgenda(week) {

    let firstDayDate = StringToDate(getWeekFirstDay(week), 0, 0, 0);
    let lastDayDate = StringToDate(getWeekLastDay(week), 23, 59, 59);

    // Get all lessons between firstDay and lastDay
    let lessons = await api.getAgenda(firstDayDate, lastDayDate);

    let agenda = {};

    // Create an array for each day
    week.forEach(element => agenda[element] = []);

    for (var lesson in lessons) {
        var data = {
            start_date: moment(lessons[lesson].start_date).locale('fr').format('DD/MM/YYYY, HH:mm:ss'),
            end_date: moment(lessons[lesson].end_date).locale('fr').format('DD/MM/YYYY, HH:mm:ss'),
            name: lessons[lesson].name,
            teacher: lessons[lesson].teacher
        };

        if (lessons[lesson].rooms) {
            data.room = lessons[lesson].rooms[0].name;
            data.color = 'var(--cd-color-event-1)';
            data.floor = lessons[lesson].rooms[0].floor;
            data.campus = lessons[lesson].rooms[0].campus;
        } else {
            data.room = '';
            data.color = '';
            data.floor = '';
            data.campus = '';
        }

        if (lessons[lesson].hasOwnProperty('modality')) {
            data.modality = lessons[lesson].modality;
        } else {
            data.modality = '';
        }
        agenda[data.start_date.substring(0, 10)].push(data);
    }

    // Sort agenda
    for(date in agenda) {
        agenda[date] = agenda[date].sort(function(a, b){

            // If same hours, check minutes
            if(a.start_date.substring(12,14) == b.start_date.substring(12,14))
                return a.start_date.substring(15,17) - b.start_date.substring(15,17)
    
            return a.start_date.substring(12,14) - b.start_date.substring(12,14);
        });
    }

    return agenda;
}



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

function getWeekFirstDay(weekTextArray) {
    return weekTextArray[0];
}

function getWeekLastDay(weekTextArray) {
    return weekTextArray[weekTextArray.length - 1];
}

function StringToDate(text, hours, minutes, seconds) {
    // console.log("StringToDate, text: " + text)
    var date = new Date();
    date.setUTCFullYear(text.substring(6, 10))
    date.setMonth(text.substring(3, 5) - 1);
    date.setDate(text.substring(0, 2));
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(seconds);
    date.setUTCMilliseconds(0);
    return date;
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