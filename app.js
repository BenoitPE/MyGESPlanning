var express = require('express')
var path = require('path');
var session = require('express-session');
var app = express();
var  cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = 3000;

var checkLoggedIn = async function(req, res, next) {
    if (req.session.connected && req.session.username !== "" && req.session.password !== "") {
        next();
    } else {
        res.redirect("/login");
    }
}

var logout = function(req, res, next) {
    req.session.destroy();
    res.clearCookie("connect.sid")
    res.clearCookie("MygesBearerToken")
    res.redirect('/login');
    res.end();
}

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
var absencesRouter = require('./routes/absences');
var loginRouter = require('./routes/login');
var agendaRouter = require('./routes/agenda');
var notesRouter = require('./routes/notes');

app.use('/login', loginRouter);
app.use('/logout', logout, loginRouter);
app.use('/', checkLoggedIn, agendaRouter);
app.use('/index', checkLoggedIn, agendaRouter);
app.use('/agenda', checkLoggedIn, agendaRouter);
app.use('/absences', checkLoggedIn, absencesRouter);
app.use('/notes', checkLoggedIn, notesRouter);


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));