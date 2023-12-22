const browserObject = require('./browser');
const pageObject = require('./page');
const crawlObject = require('./crawl');
const linkObject = require('./link');
const storeLinkObject = require('./storeLink');
const storeSitemapObject = require('./storeSitemap');
const fs = require('fs');
const robotsParser = require('robots-parser');

const sqlite3 = require("sqlite3").verbose();

var defaultLimit = 50;
var defaultSleep = 0;
const dbDir = './db';
const sitemapDir = './sitemap';

/**
 * Delay in ms
 * @param time - time in ms
 */
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

/**
 * Generate sitemap
 * @param mainWindow - Puppeteer window
 * @param url - url of sitemap
 * @param page_limit - limit of pages checked in one scan
 * @param sleep_time - sleep between pages
 * @returns {Promise<void>}
 */
async function generateSitemap(mainWindow,url,page_limit,sleep_time) {
    //generate db dir
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir);
    }

    //generate sitemap dir
    if (!fs.existsSync(sitemapDir)) {
        fs.mkdirSync(sitemapDir);
    }

    //sleep between pages
    var sleep = defaultSleep;

    var origUrl = url;
    var limit = page_limit;
    sleep = sleep_time;

    //get analyzed Url object
    const analyzedUrl = new URL(origUrl);

    //connect to sqlite3 db in memory
    //    var db = new sqlite3.Database(':memory:');
    var db = new sqlite3.Database(dbDir + '/sitemap_' + analyzedUrl.hostname + '.db');
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS links (link TEXT,visited INTEGER DEFAULT 0,status INTEGER DEFAULT 0)");
    });

    //start the browser
    let browserInstance = browserObject.startBrowser(true,false);
    //build first opened tab page instance
    let pageInstance = pageObject.openPage(browserInstance, 0);

    //analyze robots.txt
    let robotstxtUrl = analyzedUrl.protocol + '//' + analyzedUrl.hostname + '/robots.txt';
    let robotstxtContent = await crawlObject.getRobotstxt(pageInstance, robotstxtUrl);
    var robots = robotsParser(robotstxtUrl, robotstxtContent.replace(/(<([^>]+)>)/gi, ""));

    //visit urls collected on websites in a loop
    for (var i = 0; i < limit; i++) {

        //check if the page is not blocked by robots.txt
        let isDisallowed = await robots.isDisallowed(url, 'Googlebot');
        if (isDisallowed === true) {
            await storeLinkObject.linkChecked(db, url);
            url = await storeLinkObject.getRandomLink(db);
            continue;
        }

        //visit url
        let status = await crawlObject.goto(pageInstance, url);

        //store info that page was checked
        await storeLinkObject.linkChecked(db, url);

        if (status == 200) {
            //get internal links
            let linkInstance = linkObject.getInternalLinks(pageInstance);

            //Page should not have noindex
            let noindex = await linkObject.checkForNoindex(pageInstance);
            if (noindex === false) {
                await storeLinkObject.properStatus(db, url);
            }

            //store links and information abount checked url
            await storeLinkObject.storeLinks(linkInstance, db);
        }

        //get another random link
        url = await storeLinkObject.getRandomLink(db);
        if (url === false) break;

        if (url !== false) {
            console.log(url);
            //sleep between pages
            await delay(sleep);
        }

        //update message info with number of pates to check
        let qtyLinks = await storeLinkObject.countAllLinks(db);
        await mainWindow.webContents.executeJavaScript('document.getElementById("h2message").innerHTML="checked: ' + (i + 1) + '/' + qtyLinks + '";');

    }

    //get all links from sqlite3 database
    let links = await storeLinkObject.getAllLinks(db)

    //store sitemap
    await storeSitemapObject.storeSitemap(links, sitemapDir + '/sitemap_' + analyzedUrl.hostname + '.xml');

    //update message info with sitemap link
    mainWindow.webContents.executeJavaScript('document.getElementById("h2message").innerHTML="sitemap generated: ' + sitemapDir + '/sitemap_' + analyzedUrl.hostname + '.xml' + '";');

    //close all resources
    db.close();
    browserObject.closeBrowser(browserInstance);

    console.log('sitemap generated: sitemap_' + analyzedUrl.hostname + '.xml');
}

module.exports = {
    generateSitemap
}
