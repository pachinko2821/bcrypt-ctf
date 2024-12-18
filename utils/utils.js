const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");

// database
const db = new Database(":memory:");

// salt
const salt = bcrypt.genSaltSync();

// create database
createDatabase = () => {
    // create users table
    console.log("[!] Creating Database");
    let query = db.exec(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
    )`);
    // add admin user
    let adminUser = "admin@short.com"
    query = db.prepare(`INSERT INTO users (username, password) VALUES (?,?)`);
    query.run(adminUser, createPassword(adminUser)[0]);
}

// password creation
createPassword = (username) => {
    let random = crypto.randomBytes(16).toString("hex");
    let plaintext = username + random;
    let password = bcrypt.hashSync(plaintext, salt);
    console.log(`Created Password: ${username + random}`);
    return [password, plaintext];
}

// check if user exists
isUserExists = (username) => {
    console.log(`[!] Checking if ${username} exists`);
    let query = db.prepare("SELECT * FROM users WHERE username=?");
    let user = query.get(username);
    return user;
}

// validate password
isPasswordCorrect = (actualPassword, suppliedPassword) => {
    console.log("[!] Checking if supplied password is correct");
    suppliedHash = bcrypt.hashSync(suppliedPassword, salt);
    return suppliedHash == actualPassword ? true : false;
}

// request method check: only allow get and post methods
checkMethod = (req, res, next) => {
    if (req.method === "POST" || req.method === "GET") {
        return next();
    }
    return res.status(401).send("Method not allowed");
}

module.exports = {
    db,
    createDatabase,
    createPassword,
    checkMethod,
    isUserExists,
}