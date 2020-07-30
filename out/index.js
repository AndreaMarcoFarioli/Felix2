"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var accounts_1 = require("./utils/accounts");
var structure_1 = __importStar(require("./configuration/structure"));
var worker_threads_1 = require("worker_threads");
var anticaptcha_1 = require("anticaptcha");
var path_1 = require("path");
var mongodb_1 = require("mongodb");
var database_1 = require("./data/database");
var worker;
var driver;
var db;
var country = "us";
function start() {
    return __awaiter(this, void 0, void 0, function () {
        // start_vpn();
        function start_vpn() {
            worker = new worker_threads_1.Worker(path_1.join(__dirname, "thread/vpn_thread.js"), { workerData: {
                    country: country
                } });
            worker.once("message", function (message) {
                if (message === "start")
                    executor(account, accountDB);
                else if (message === "refresh")
                    start_vpn();
            });
        }
        var mongo, dbo, accountDB, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.connect()];
                case 1:
                    _a.sent();
                    mongo = new mongodb_1.MongoClient("mongodb+srv://admin:admin@cluster0.vlznh.mongodb.net/userlist?retryWrites=true&w=majority");
                    return [4 /*yield*/, mongo.connect()];
                case 2:
                    dbo = _a.sent();
                    db = dbo.db("kebotdb");
                    return [4 /*yield*/, database_1.findNotRegisterAccount()];
                case 3:
                    accountDB = _a.sent();
                    console.log(accountDB);
                    account = accounts_1.createAccount();
                    executor(account, accountDB);
                    return [2 /*return*/];
            }
        });
    });
}
function executor(account, accountDB) {
    return __awaiter(this, void 0, void 0, function () {
        var tmpElem, res, notDid_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!accountDB) return [3 /*break*/, 37];
                    if (!account.username) return [3 /*break*/, 37];
                    return [4 /*yield*/, new selenium_webdriver_1.Builder().forBrowser("chrome").build()];
                case 1:
                    driver = _a.sent();
                    return [4 /*yield*/, driver.get("https://www.spotify.com/it/signup/")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(structure_1.default.privacy))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.email)];
                case 4:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(accountDB.email)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.cemail)];
                case 6:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(accountDB.email)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.password)];
                case 8:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.password)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.profile_name)];
                case 10:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.username)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.year)];
                case 12:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.birthday.year)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.month)];
                case 14:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.birthday.month)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.day)];
                case 16:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.birthday.day)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.genders[account.gender])];
                case 18:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.newsletter)];
                case 20:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.share_data)];
                case 22:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.privacy)];
                case 24:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 25:
                    _a.sent();
                    sleep(4000);
                    return [4 /*yield*/, captchaSolver()];
                case 26:
                    res = _a.sent();
                    //await driver.executeScript(`document.querySelector("iframe").remove()`);
                    sleep(4000);
                    return [4 /*yield*/, driver.findElement(structure_1.default.captcha.recaptcha_response)];
                case 27:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, driver.executeScript("arguments[0].innerHTML = arguments[1]", tmpElem, res.solution.gRecaptchaResponse)];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('[name=\'recaptchaV2\']'))];
                case 29:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, driver.executeScript("arguments[0].removeAttribute(\"hidden\")", tmpElem)];
                case 30:
                    _a.sent();
                    sleep(3000);
                    return [4 /*yield*/, tmpElem.sendKeys(res.solution.gRecaptchaResponse)];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.submit)];
                case 32:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 33:
                    _a.sent();
                    notDid_1 = false;
                    return [4 /*yield*/, new Promise(function (res) {
                            driver.wait(selenium_webdriver_1.until.elementLocated(structure_1.default.error), 10000);
                            driver.wait(selenium_webdriver_1.until.elementIsVisible(driver.findElement(structure_1.default.error)), 10000)
                                .then(res)
                                .catch(function () {
                                notDid_1 = true;
                                res();
                            });
                        })];
                case 34:
                    _a.sent();
                    if (!notDid_1)
                        console.log(account);
                    account.country = country;
                    return [4 /*yield*/, database_1.addAccount(account, new mongodb_1.ObjectID(accountDB._id))];
                case 35:
                    _a.sent();
                    sleep(7000);
                    return [4 /*yield*/, driver.close()];
                case 36:
                    _a.sent();
                    _a.label = 37;
                case 37: return [2 /*return*/];
            }
        });
    });
}
start();
function captchaSolver() {
    return __awaiter(this, void 0, void 0, function () {
        var a, notSolved, res;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("start");
                    a = new anticaptcha_1.AntiCaptcha("fbc97aead89db25f4bee466c65e951fe");
                    notSolved = false;
                    return [4 /*yield*/, new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var taskID;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, a.createTask(structure_1.captchaObjectSpotify)];
                                    case 1:
                                        taskID = _a.sent();
                                        a.getTaskResult(taskID).then(res).catch(function () {
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    res = _a.sent();
                    console.log(res);
                    return [2 /*return*/, res];
            }
        });
    });
}
function sleep(time) {
    var cur = Date.now();
    while (Date.now() - cur < time) { }
}
process.once("beforeExit", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (res) {
                    driver.close()
                        .then(res)
                        .catch(res);
                })];
            case 1:
                _a.sent();
                worker.postMessage("exit");
                return [2 /*return*/];
        }
    });
}); });
