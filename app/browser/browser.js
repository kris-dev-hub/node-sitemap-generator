//const puppeteer = require('puppeteer');
const PCR = require("puppeteer-chromium-resolver");

/**
 * Start the browser
 * @returns browser instance
 */
async function startBrowser(headless=true,devtools=false){
    let browser;
    try {
        const stats = await PCR();
        browser = await stats.puppeteer.launch({
            headless: headless,
            devtools: devtools,
            args: ['--window-size=1920,1080'],
            executablePath: stats.executablePath,
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Browser instance creation failed: ", err);
    }
    return browser;
}

/**
 * Close browser
 * @param browserInstance - browser instance
 * @returns {Promise<void>}
 */
async function closeBrowser(browserInstance) {
    let browser = await browserInstance;
    browser.close();
}

module.exports = {
    startBrowser,
    closeBrowser
};

