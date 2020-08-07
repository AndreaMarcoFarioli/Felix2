import { Builder, until, By, WebDriver } from "selenium-webdriver";
import { createAccount, randomDate } from "./utils/accounts";
import structure, { captchaObjectSpotify } from "./configuration/structure";
import { Worker, workerData } from "worker_threads";
import { AntiCaptcha, INoCaptchaTaskProxyless, INoCaptchaTaskProxylessResult, IGetTaskResultResponse } from "anticaptcha";
import { exec, execSync, spawn } from "child_process";
import { join } from "path";
import { MongoClient, Db, ObjectID } from "mongodb";
import { findNotRegisterAccount, connect, addAccount, account, accountSpotify, setReal } from "./data/database";
import { count } from "console";

let worker: Worker;
let driver: WebDriver;
let db: Db;
let country = "uk";
let real = "it";
async function start() {
    let continue_ = false;

    await start_vpn();
    await connect();
    // let mongo = new MongoClient("mongodb+srv://admin:admin@cluster0.vlznh.mongodb.net/kebotdb?retryWrites=true&w=majority", {useUnifiedTopology: true})
    // let dbo = await mongo.connect();
    // db = dbo.db("kebotdb");
    let accountDB = await findNotRegisterAccount();
    console.log(accountDB);
    let account = createAccount();
    async function start_vpn() {
        worker = new Worker(join(__dirname, "thread/vpn_thread.js"), {
            workerData: {
                country: country
            }
        });
        await new Promise(res => {
            worker.once("message", (message) => {
                if (message === "start") {
                    continue_ = true;
                }
                else if (message === "refresh")
                    continue_ = false;
                res();
            })
        });
        console.log(continue_);
    }
    if (continue_) {
        console.log("here");
        await executor(account, accountDB);
    } else await start_vpn();
    process.exit()
    //await executor(account, accountDB);
}


async function executor(account: accountSpotify, accountDB: account | undefined) {
    let continue_: boolean = false;
    if (accountDB)
        if (account.username) {
            console.log("here")
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
            await tmpElem.click();
            tmpElem = await driver.findElement(structure.newsletter);
            await tmpElem.click();
            tmpElem = await driver.findElement(structure.share_data);
            await tmpElem.click();
            tmpElem = await driver.findElement(structure.privacy);
            await tmpElem.click();
            sleep(4000)
            let out = setTimeout(async () => {
                await driver.close();
                process.exit();
            }, 120000);
            let res = await captchaSolver();
            clearTimeout(out);
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
            account.country = country;
            let errore = false, count = 200;
            while (true) {
                if ((await driver.getCurrentUrl()).includes("download"))
                    break;
                else
                    count--;
                if (count === 0) {
                    errore = true;
                    break;
                }
                sleep(100);
            }
            if (!errore) {
                await addAccount(account, new ObjectID(accountDB._id));
                sleep(3500);
                if (real !== country) {
                    await new Promise(res => {
                        worker.on("exit", async () => {
                            execSync(join(__dirname, "../killvpn.sh"));
                            await start_vpn();
                            console.log("VPN CHANGED")
                            res();
                        });
                        worker.emit("exit");
                    })
                    sleep(10000);
                    await driver.get("https://www.spotify.com/it/account/profile/");
                    await driver.wait(until.elementLocated(By.id("country")), 50000);
                    let elem = await driver.findElement(By.id("country"));
                    await elem.sendKeys(real);
                    elem = await driver.findElement(By.xpath('//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/article/section/form/div/button'));
                    await elem.click();
                    await driver.wait(until.elementLocated(By.xpath('//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/section/div')), 10000);
                    await setReal(new ObjectID(accountDB._id), real);
                }
            }
            await driver.close();
            if (worker)
                worker.postMessage("exit");
        }

    async function start_vpn() {
        worker = new Worker(join(__dirname, "thread/vpn_thread.js"), {
            workerData: {
                country: real
            }
        });
        await new Promise(res => {
            worker.once("message", (message) => {
                if (message === "start") {
                    continue_ = true;
                }
                else if (message === "refresh")
                    continue_ = false;
                res();
            })
        });
        console.log(continue_);
    }
}

start();


async function captchaSolver() {
    console.log("start")
    let a = new AntiCaptcha("fbc97aead89db25f4bee466c65e951fe");
    let notSolved = false;
    let res = await new Promise<IGetTaskResultResponse<INoCaptchaTaskProxylessResult>>(async res => {
        let taskID = await a.createTask<INoCaptchaTaskProxyless>(captchaObjectSpotify);
        a.getTaskResult<INoCaptchaTaskProxylessResult>(taskID).then(res).catch(() => {

        });
    });

    console.log(res);
    return res;
}

function sleep(time: number) {
    let cur = Date.now();
    while (Date.now() - cur < time) { }
}

process.once("beforeExit", async () => {
    await new Promise(res => {
        driver.close()
            .then(res)
            .catch(res);
    })
    worker.postMessage("exit");
})