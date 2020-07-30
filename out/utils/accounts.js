"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDate = exports.randomBoolean = exports.randomString = exports.getRandomUsername = exports.createAccount = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var charlist = "abcdefghijklmnopqrstuvwxyz1234567890";
var gender = ['m', 'f', 'x'];
var mails = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../data/mails.txt")).toString('ascii');
var usernames = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../data/usernames.txt")).toString('ascii');
var mailsArray = mails.split(/\r?\n\r?/g), usernamesArray = usernames.split(/\r?\n\r?/g);
function createAccount() {
    var gen = gender[Math.floor(Math.random() * gender.length)];
    var m = {
        gender: gen,
        //mail: mailsArray.pop(),
        username: usernamesArray[Math.floor(Math.random() * usernamesArray.length)],
        password: randomString(),
        birthday: randomDate(new Date(1950, 1, 1), new Date(2005, 12, 31)),
        verified: false
    };
    return m;
}
exports.createAccount = createAccount;
function getRandomUsername() {
    return usernamesArray[Math.floor(Math.random() * usernamesArray.length)];
}
exports.getRandomUsername = getRandomUsername;
function randomString(len) {
    if (len === void 0) { len = 10; }
    var string = "";
    for (var i = 0; i < len; i++) {
        var c = charlist.charAt(Math.floor(Math.random() * charlist.length));
        if (randomBoolean())
            c = c.toUpperCase();
        string += c;
    }
    return string;
}
exports.randomString = randomString;
function randomBoolean() {
    return Math.random() > 0.5;
}
exports.randomBoolean = randomBoolean;
var month = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
function randomDate(start, end) {
    var m = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return {
        year: m.getFullYear(),
        month: month[m.getMonth()],
        day: m.getDay() + 1
    };
}
exports.randomDate = randomDate;
