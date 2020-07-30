import { Builder, until, By, WebDriver } from "selenium-webdriver";
import { createAccount, randomDate } from "./utils/accounts";
import structure, { captchaObjectSpotify } from "./configuration/structure";
import { Worker, workerData } from "worker_threads";
import { AntiCaptcha, INoCaptchaTaskProxyless, INoCaptchaTaskProxylessResult, IGetTaskResultResponse } from "anticaptcha";
import { exec, execSync, spawn } from "child_process";
import { join } from "path";
import { MongoClient, Db, ObjectID } from "mongodb";
import { create } from "domain";
let worker: Worker;
let driver: WebDriver;
let db : Db;
let country = "us";
async function start() {
    let mongo = new MongoClient("mongodb+srv://admin:admin@cluster0.vlznh.mongodb.net/userlist?retryWrites=true&w=majority")
    let dbo = await mongo.connect();
    db = dbo.db("accounts_list");
    let accountDB = await db.collection("userlist").findOne({spotify: {$exists: false}});
    console.log(accountDB);
    let account = createAccount();
    start_vpn();
    function start_vpn() {
        worker = new Worker(join(__dirname, "thread/vpn_thread.js"), {workerData: {
            country: country
        }});
        worker.once("message", (message) => {
            if (message === "start")
                executor(account, accountDB);
            else if (message === "refresh")
                start_vpn();
        })
    }

}


async function executor(account: any, accountDB : any) {
    if (account.mail && account.username) {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.get("https://www.spotify.com/it/signup/");
        await driver.wait(until.elementLocated(structure.privacy));
        let tmpElem = await driver.findElement(structure.email);
        await tmpElem.sendKeys(accountDB.email);
        tmpElem = await driver.findElement(structure.cemail);
        await tmpElem.sendKeys(accountDB.email);
        tmpElem = await driver.findElement(structure.password);
        await tmpElem.sendKeys(account.password);
        tmpElem = await driver.findElement(structure.profile_name);
        await tmpElem.sendKeys(account.username);
        tmpElem = await driver.findElement(structure.year);
        await tmpElem.sendKeys(account.birthday.year);
        tmpElem = await driver.findElement(structure.month);
        await tmpElem.sendKeys(account.birthday.month);
        tmpElem = await driver.findElement(structure.day);
        await tmpElem.sendKeys(account.birthday.day);
        tmpElem = await driver.findElement(structure.genders[(<"m" | "f" | "x">account.gender)]);
        tmpElem.click();
        tmpElem = await driver.findElement(structure.newsletter);
        tmpElem.click();
        tmpElem = await driver.findElement(structure.share_data);
        tmpElem.click();
        tmpElem = await driver.findElement(structure.privacy);
        tmpElem.click();
        sleep(4000)
        let res = await captchaSolver();
        //await driver.executeScript(`document.querySelector("iframe").remove()`);
        sleep(4000)

        tmpElem = await driver.findElement(structure.captcha.recaptcha_response);
        await driver.executeScript(`arguments[0].innerHTML = arguments[1]`, tmpElem, res.solution.gRecaptchaResponse);
        tmpElem = await driver.findElement(By.css('[name=\'recaptchaV2\']'));
        await driver.executeScript(`arguments[0].removeAttribute("hidden")`, tmpElem);
        sleep(3000);
        await tmpElem.sendKeys(res.solution.gRecaptchaResponse);
        tmpElem = await driver.findElement(structure.submit);
        await tmpElem.click()
        let notDid = false;
        await new Promise(res => {
            driver.wait(until.elementLocated(structure.error), 10000);
            driver.wait(until.elementIsVisible(driver.findElement(structure.error)), 10000)
                .then(res)
                .catch(() => {
                    notDid = true;
                    res();
                });
        })
        if (!notDid)
            console.log(account);
        delete account.mail;
        account.country = country;
        await db.collection("userlist").updateOne({_id: new ObjectID(accountDB._id)}, {$set: {spotify: account}})
        sleep(7000);
        await driver.close();
    }
}

start();

async function captchaSolver() {
    console.log("start")
    let a = new AntiCaptcha("fbc97aead89db25f4bee466c65e951fe");
    let notSolved = false;
    let res = await new Promise<IGetTaskResultResponse<INoCaptchaTaskProxylessResult>>(async res=>{
        let taskID = await a.createTask<INoCaptchaTaskProxyless>(captchaObjectSpotify);
        a.getTaskResult<INoCaptchaTaskProxylessResult>(taskID, 20, 20).then(res).catch(()=>{

        });
    });

    console.log(res);
    return res;
}

function sleep(time: number) {
    let cur = Date.now();
    while (Date.now() - cur < time) { }
}

process.once("beforeExit", async ()=>{
    await new Promise(res=>{
        driver.close()
            .then(res)
            .catch(res);
    }) 
    worker.postMessage("exit");
})