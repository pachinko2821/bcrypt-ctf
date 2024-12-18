const { db, createPassword, isUserExists } = require("../utils/utils");

userLogin = (req, res) => {
    if (req.method === "GET") {
        res.render("login", {message: ""});
    }

    if (req.method === "POST") {
        try {
            let username = req.body.username;
            const user = isUserExists(username);
            if (user) {
                let password = req.body.password;
                const pass = isPasswordCorrect(user.password, password);
                if (pass) {
                    req.session.user = { username: user.username, id: user.id };
                    res.redirect("/dashboard");
                } else {
                    res.render("login", { message: "You entered an incorrect password" });
                }
            } else {
                res.render("login", { message: "This user does not exist. Head over to /user/register" });
            }
        } catch (error) {
            res.render("login", { message: "What did you do bud?" });
        }
    }
}

userRegister = (req, res) => {
    if (req.method === "GET") {
        res.render("register", { message: "" });
    }

    if (req.method === "POST") {
        try {
            // check if user already exists
            let username = req.body.username;
            console.log(`[!] Creating user ${username}`);
            const user = isUserExists(username);
            if (user) {
                // end since user already exists
                res.render("register", { message: "That username is taken :(" });
            } else {
                // create new user
                const query = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                let data = createPassword(username);
                query.run(username, data[0]);
                res.render("register", { message: `Successfully registered. Your password is ${data[1]}. Write that down, you won't see it again!` });
            }
        } catch (error) {
            console.log(error);
            res.render("register", { message: "What did you do bud?" });
        }
    }
}

getAllUsers = (req, res) => {
    try {
        const query = db.prepare("SELECT id,username FROM users");
        let users = query.all();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(users));
    } catch (error) {
        res.send("What did you do bud?");
    }
}

updateUsername = (req, res) => {
    if (req.method === "GET") {
        res.send("Method not allowed");
    }
    if (req.method === "POST") {
        try {
            let user = req.session.user;
            if (user) {
                let username = req.body.username;
                let id = req.body.id;
                let password = createPassword(username)[0];
        
                const query = db.prepare(`UPDATE users SET username=?, password=? WHERE id=?`);
                query.run(username, password, id);
                req.session.destroy();
                res.render("login", { message: "Your username and password have been updated. Check your registered email for the new password" } );
                // todo: send email
            } else {
                res.send("You need to be logged in to update your username");
            }   
        } catch (error) {
            res.send("What did you do bud?");
        }
    }
}

module.exports = {
    userLogin,
    userRegister,
    getAllUsers,
    updateUsername,
}