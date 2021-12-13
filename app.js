var express = require('express')
var path = require('path');
var bodyParser = require("body-parser");
var session = require('express-session');
var app = express();
const myges = require("myges").default;
const PORT = 3000;
let api = undefined;

var checkLoggedIn = async function(req, res, next) {
    if (req.session.connected) {
        next();
    } else {
        req.session.connected = false;
        res.redirect("/login");
    }
}

var logout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
}

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var absencesRouter = require('./routes/absences');
var loginRouter = require('./routes/login');
var agendaRouter = require('./routes/agenda');
var notesRouter = require('./routes/notes');
const req = require('express/lib/request');


// app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/logout', logout, loginRouter);
app.use('/', checkLoggedIn, agendaRouter);
app.use('/index', checkLoggedIn, agendaRouter);
app.use('/agenda', checkLoggedIn, agendaRouter);
app.use('/absences', checkLoggedIn, absencesRouter);
app.use('/notes', checkLoggedIn, notesRouter);


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));