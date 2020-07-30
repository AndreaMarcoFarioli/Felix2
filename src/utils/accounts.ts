import fs from "fs";
import path from "path";
import { accountSpotify, months } from "../data/database";
const charlist = "abcdefghijklmnopqrstuvwxyz1234567890"
const gender = ['m', 'f', 'x']
const mails = fs.readFileSync(path.join(__dirname, "../../data/mails.txt")).toString('ascii');
const usernames = fs.readFileSync(path.join(__dirname, "../../data/usernames.txt")).toString('ascii');
const 
    mailsArray = mails.split(/\r?\n\r?/g),
    usernamesArray = usernames.split(/\r?\n\r?/g);

export function createAccount(){
    let gen : "m"|"f"|"x" = < "m"|"f"|"x">gender[Math.floor(Math.random()*gender.length)]
    let m : accountSpotify ={
        gender: gen,
        //mail: mailsArray.pop(),
        username: usernamesArray[Math.floor(Math.random()*usernamesArray.length)],
        password: randomString(),
        birthday: randomDate(new Date(1950,1,1), new Date(2005, 12,31)),
        verified: false
    }
    return m;
}

export function getRandomUsername(){
    return usernamesArray[Math.floor(Math.random()*usernamesArray.length)];
}

export function randomString(len : number = 10){
    let string : string = "";
    for(let i = 0; i < len; i++){
        let c = charlist.charAt(Math.floor(Math.random()*charlist.length));
        if(randomBoolean())
            c = c.toUpperCase();
        string += c;
    }
    return string;
}

export function randomBoolean(){
    return Math.random() > 0.5;
}
const month = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]
export function randomDate(start : Date, end : Date) {
    let m = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return {
        year: m.getFullYear(),
        month: <months>month[m.getMonth()],
        day: m.getDay()+1
    };
}

