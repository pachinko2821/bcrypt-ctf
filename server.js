const express = require("express");
const session = require("express-session");
const { getAllUsers, userLogin, userRegister, updateUsername } = require("./controllers/user-controller");
const { createDatabase, checkMethod, createPassword } = require("./utils/utils");
const { dashboardLanding } = require("./controllers/dashboard-controller");

const app = express();

// support urlencoded forms
app.use(express.urlencoded({
    extended: true
}));

// support ejs template
app.set('view engine', 'ejs');

// support sessions
// shamefully stolen from https://www.geeksforgeeks.org/how-to-handle-sessions-in-express/
app.use(session({
    secret: createPassword('harvester-of-sorrow-'), // used to sign the session ID cookie
    resave: false, // do not save the session if it's not modified
    saveUninitialized: false // do not save new sessions that have not been modified
}));

// setup database
createDatabase();

// landing routes
app.get("/", (req, res) => {
    res.redirect("/user/login");
});

// user routes
app.all("/user/login", checkMethod, userLogin);
app.all("/user/register", checkMethod, userRegister);
app.get("/user/list", checkMethod, getAllUsers);
app.all("/user/update-username", checkMethod, updateUsername);

// dashboard routes
app.get("/dashboard", checkMethod, dashboardLanding);

// listen
app.listen(3000, () => {
    console.log("Listening");
});