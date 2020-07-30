import { By } from "selenium-webdriver";
import {INoCaptchaTaskProxyless, TaskTypes} from "anticaptcha"
export default {
    email: By.xpath('//*[@id="email"]'),
    cemail: By.xpath('//*[@id="confirm"]'),
    password: By.xpath('//*[@id="password"]'),
    profile_name: By.xpath('//*[@id="displayname"]'),
    year: By.xpath('//*[@id="year"]'),
    month: By.xpath('//*[@id="month"]'),
    day: By.xpath('//*[@id="day"]'),
    genders:{
        m: By.xpath('//*[@id="__next"]/main/div[2]/form/div[6]/div[2]/label[1]'),
        f: By.xpath('//*[@id="__next"]/main/div[2]/form/div[6]/div[2]/label[2]'),
        x: By.xpath('//*[@id="__next"]/main/div[2]/form/div[6]/div[2]/label[3]'),
    },
    newsletter: By.xpath('//*[@id="__next"]/main/div[2]/form/div[7]'),
    share_data: By.xpath('//*[@id="__next"]/main/div[2]/form/div[8]'),
    privacy: By.xpath('//*[@id="__next"]/main/div[2]/form/div[9]'),
    captcha: {
        recaptcha_response: By.id("g-recaptcha-response")
    },
    submit: By.xpath('//*[@id="__next"]/main/div[2]/form/div[11]/div/button'),
    error: By.xpath('//*[@id="__next"]/main/div[2]/form/div[1]')
};
// https://www.google.com/recaptcha/api2/anchor?ar=2&k=6Lenb9oUAAAAAO1Rqrm4KsoNH14OvMm6SWkQcdRj&co=aHR0cHM6Ly93d3cuc3BvdGlmeS5jb206NDQz&hl=it&v=AFBwIe6h0oOL7MOVu88LHld-&size=normal&cb=hqefrtdz3p3m
export let captchaObjectSpotify : INoCaptchaTaskProxyless =  {
    type: TaskTypes.NOCAPTCHA_PROXYLESS,
    websiteKey: "6Lenb9oUAAAAAO1Rqrm4KsoNH14OvMm6SWkQcdRj",
    websiteURL: "https://www.spotify.com/it/signup/"
}

export const pw  = "Benzoni1930";