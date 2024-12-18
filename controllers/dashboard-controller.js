const { db, createPassword, isUserExists } = require("../utils/utils");

dashboardLanding = (req, res) => {
    if (req.session.user) {
        console.log(req.session.user);
        let message = req.session.user.id == 1 ? process.env.FLAG : "not yet";
        res.render("dashboard", { username: req.session.user.username, id: req.session.user.id, message: message });
    } else {
        res.redirect("/user/login");
    }
}

module.exports = {
    dashboardLanding
}