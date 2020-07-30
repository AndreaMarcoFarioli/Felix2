"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pw = exports.captchaObjectSpotify = void 0;
var selenium_webdriver_1 = require("selenium-webdriver");
var anticaptcha_1 = require("anticaptcha");
exports.default = {
    email: selenium_webdriver_1.By.xpath('//*[@id="email"]'),
    cemail: selenium_webdriver_1.By.xpath('//*[@id="confirm"]'),
    password: selenium_webdriver_1.By.xpath('//*[@id="password"]'),
    profile_name: selenium_webdriver_1.By.xpath('//*[@id="displayname"]'),
    year: selenium_webdriver_1.By.xpath('//*[@id="year"]'),
    month: selenium_webdriver_1.By.xpath('//*[@id="month"]'),
    day: selenium_webdriver_1.By.xpath('//*[@id="day"]'),
    genders: {
        m: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[6]/div[2]/label[1]'),
        f: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[6]/div[2]/label[2]'),
        x: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[6]/div[2]/label[3]'),
    },
    newsletter: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[7]'),
    share_data: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[8]'),
    privacy: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[9]'),
    captcha: {
        recaptcha_response: selenium_webdriver_1.By.id("g-recaptcha-response")
    },
    submit: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[11]/div/button'),
    error: selenium_webdriver_1.By.xpath('//*[@id="__next"]/main/div[2]/form/div[1]')
};
// https://www.google.com/recaptcha/api2/anchor?ar=2&k=6Lenb9oUAAAAAO1Rqrm4KsoNH14OvMm6SWkQcdRj&co=aHR0cHM6Ly93d3cuc3BvdGlmeS5jb206NDQz&hl=it&v=AFBwIe6h0oOL7MOVu88LHld-&size=normal&cb=hqefrtdz3p3m
exports.captchaObjectSpotify = {
    type: anticaptcha_1.TaskTypes.NOCAPTCHA_PROXYLESS,
    websiteKey: "6Lenb9oUAAAAAO1Rqrm4KsoNH14OvMm6SWkQcdRj",
    websiteURL: "https://www.spotify.com/it/signup/"
};
exports.pw = "Benzoni1930";
