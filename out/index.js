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
var child_process_1 = require("child_process");
var path_1 = require("path");
var mongodb_1 = require("mongodb");
var database_1 = require("./data/database");
var worker;
var driver;
var db;
var country = "uk";
var real = "it";
var accountDB;
function start() {
    return __awaiter(this, void 0, void 0, function () {
        function start_vpn() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            worker = new worker_threads_1.Worker(path_1.join(__dirname, "thread/vpn_thread.js"), {
                                workerData: {
                                    country: country
                                }
                            });
                            return [4 /*yield*/, new Promise(function (res) {
                                    worker.once("message", function (message) {
                                        if (message === "start") {
                                            continue_ = true;
                                        }
                                        else if (message === "refresh")
                                            continue_ = false;
                                        res();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            console.log(continue_);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var continue_, _a, _b, account;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    continue_ = false;
                    return [4 /*yield*/, start_vpn()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, database_1.connect()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, database_1.findNotRegisterAccount()];
                case 3:
                    // let mongo = new MongoClient("mongodb+srv://admin:admin@cluster0.vlznh.mongodb.net/kebotdb?retryWrites=true&w=majority", {useUnifiedTopology: true})
                    // let dbo = await mongo.connect();
                    // db = dbo.db("kebotdb");
                    accountDB = _c.sent();
                    if (!accountDB) return [3 /*break*/, 5];
                    _b = (_a = console).log;
                    return [4 /*yield*/, database_1.inUseAccount(new mongodb_1.ObjectID(accountDB._id), true)];
                case 4:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 5;
                case 5:
                    console.log(accountDB);
                    account = accounts_1.createAccount();
                    if (!continue_) return [3 /*break*/, 7];
                    console.log("here");
                    return [4 /*yield*/, executor(account, accountDB)];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, start_vpn()];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
function executor(account, accountDB) {
    return __awaiter(this, void 0, void 0, function () {
        function start_vpn() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            worker = new worker_threads_1.Worker(path_1.join(__dirname, "thread/vpn_thread.js"), {
                                workerData: {
                                    country: real
                                }
                            });
                            return [4 /*yield*/, new Promise(function (res) {
                                    worker.once("message", function (message) {
                                        if (message === "start") {
                                            continue_ = true;
                                        }
                                        else if (message === "refresh")
                                            continue_ = false;
                                        res();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            console.log(continue_);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var continue_, b_1, tmpElem, out, res, notDid_1, errore, count_1, elem;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    continue_ = false;
                    if (!accountDB) return [3 /*break*/, 53];
                    if (!account.username) return [3 /*break*/, 53];
                    console.log("here");
                    return [4 /*yield*/, new selenium_webdriver_1.Builder().forBrowser("chrome").build()];
                case 1:
                    driver = _a.sent();
                    return [4 /*yield*/, driver.get("https://www.spotify.com/it/signup/")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(structure_1.default.privacy))];
                case 3:
                    _a.sent();
                    b_1 = selenium_webdriver_1.By.xpath('//*[@id="onetrust-accept-btn-handler"]');
                    return [4 /*yield*/, new Promise(function (res) {
                            driver.wait(selenium_webdriver_1.until.elementLocated(b_1), 3000).then(function (e) {
                                driver.wait(selenium_webdriver_1.until.elementIsVisible(e), 3000).then(function () {
                                    sleep(2000);
                                    e.click().then(res);
                                }).catch(res);
                            }).catch(res);
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.email)];
                case 5:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(accountDB.email)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.cemail)];
                case 7:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(accountDB.email)];
                case 8:
                    _a.sent();
                    b_1 = selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[1]/div[2]');
                    return [4 /*yield*/, new Promise(function (res) {
                            driver.wait(selenium_webdriver_1.until.elementLocated(b_1), 3000).then(function (e) {
                                driver.wait(selenium_webdriver_1.until.elementIsVisible(e), 3000).then(function () {
                                    database_1.alreadyExists(new mongodb_1.ObjectID(accountDB._id)).then(function () {
                                        console.log("Already Exists");
                                        3;
                                        driver.close().then(function () { return process.exit(); });
                                    });
                                }).catch(res);
                            }).catch(res);
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.password)];
                case 10:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.password)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.profile_name)];
                case 12:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.username)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.year)];
                case 14:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.birthday.year)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.month)];
                case 16:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.birthday.month)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.day)];
                case 18:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.sendKeys(account.birthday.day)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.genders[account.gender])];
                case 20:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.newsletter)];
                case 22:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.share_data)];
                case 24:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.privacy)];
                case 26:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 27:
                    _a.sent();
                    sleep(4000);
                    out = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, driver.close()];
                                case 1:
                                    _a.sent();
                                    process.exit();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 120000);
                    return [4 /*yield*/, captchaSolver()];
                case 28:
                    res = _a.sent();
                    clearTimeout(out);
                    // let res = {solution:{gRecaptchaResponse:"ciao"}}
                    //await driver.executeScript(`document.querySelector("iframe").remove()`);
                    sleep(4000);
                    return [4 /*yield*/, driver.findElement(structure_1.default.captcha.recaptcha_response)];
                case 29:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, driver.executeScript("arguments[0].innerHTML = arguments[1]", tmpElem, res.solution.gRecaptchaResponse)];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('[name=\'recaptchaV2\']'))];
                case 31:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, driver.executeScript("arguments[0].removeAttribute(\"hidden\")", tmpElem)];
                case 32:
                    _a.sent();
                    sleep(3000);
                    return [4 /*yield*/, tmpElem.sendKeys(res.solution.gRecaptchaResponse)];
                case 33:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(structure_1.default.submit)];
                case 34:
                    tmpElem = _a.sent();
                    return [4 /*yield*/, tmpElem.click()];
                case 35:
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
                case 36:
                    _a.sent();
                    if (!notDid_1)
                        console.log(account);
                    account.country = country;
                    errore = false, count_1 = 200;
                    _a.label = 37;
                case 37:
                    if (!true) return [3 /*break*/, 39];
                    return [4 /*yield*/, driver.getCurrentUrl()];
                case 38:
                    if ((_a.sent()).includes("download"))
                        return [3 /*break*/, 39];
                    else
                        count_1--;
                    if (count_1 === 0) {
                        errore = true;
                        return [3 /*break*/, 39];
                    }
                    sleep(100);
                    return [3 /*break*/, 37];
                case 39:
                    if (!!errore) return [3 /*break*/, 51];
                    return [4 /*yield*/, database_1.addAccount(account, new mongodb_1.ObjectID(accountDB._id))];
                case 40:
                    _a.sent();
                    sleep(3500);
                    if (!(real !== country)) return [3 /*break*/, 51];
                    return [4 /*yield*/, new Promise(function (res) {
                            worker.on("exit", function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            child_process_1.execSync(path_1.join(__dirname, "../killvpn.sh"));
                                            return [4 /*yield*/, start_vpn()];
                                        case 1:
                                            _a.sent();
                                            console.log("VPN CHANGED");
                                            res();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            worker.emit("exit");
                        })];
                case 41:
                    _a.sent();
                    sleep(10000);
                    return [4 /*yield*/, driver.get("https://www.spotify.com/it/account/profile/")];
                case 42:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id("country")), 50000)];
                case 43:
                    _a.sent();
                    b_1 = selenium_webdriver_1.By.xpath('//*[@id="onetrust-accept-btn-handler"]');
                    return [4 /*yield*/, new Promise(function (res) {
                            driver.wait(selenium_webdriver_1.until.elementLocated(b_1), 3000).then(function (e) {
                                driver.wait(selenium_webdriver_1.until.elementIsVisible(e), 3000).then(function () {
                                    sleep(2000);
                                    e.click().then(res);
                                }).catch(res);
                            }).catch(res);
                        })];
                case 44:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.id("country"))];
                case 45:
                    elem = _a.sent();
                    return [4 /*yield*/, elem.sendKeys(real)];
                case 46:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.xpath('//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/article/section/form/div/button'))];
                case 47:
                    elem = _a.sent();
                    return [4 /*yield*/, elem.click()];
                case 48:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/section/div')), 10000)];
                case 49:
                    _a.sent();
                    return [4 /*yield*/, database_1.setReal(new mongodb_1.ObjectID(accountDB._id), real)];
                case 50:
                    _a.sent();
                    _a.label = 51;
                case 51: return [4 /*yield*/, driver.close()];
                case 52:
                    _a.sent();
                    if (worker)
                        worker.postMessage("exit");
                    _a.label = 53;
                case 53: return [2 /*return*/];
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
                    a = new anticaptcha_1.AntiCaptcha("e8efed696ff4ba6d76dce1f442e777bd");
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
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!accountDB) return [3 /*break*/, 2];
                _b = (_a = console).log;
                return [4 /*yield*/, database_1.inUseAccount(new mongodb_1.ObjectID(accountDB._id), false)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                _c.label = 2;
            case 2: return [4 /*yield*/, new Promise(function (res) {
                    driver.close()
                        .then(res)
                        .catch(res);
                })];
            case 3:
                _c.sent();
                worker.postMessage("exit");
                return [2 /*return*/];
        }
    });
}); });
