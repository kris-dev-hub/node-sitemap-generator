/**
 * go to url on selected page instance
 * @param pageInstance - page instance
 * @param url - url to visit
 * @returns {Promise<void>}
 */
async function goto(pageInstance,url){
    let page = await pageInstance;
     try {
        const response = await page.goto(url);
         return response.status();
    } catch (error) {
         return 0;
    }
}

async function getRobotstxt(pageInstance, robotstxtUrl) {
    let page = await pageInstance;
    await page.goto(robotstxtUrl);
    var content = await page.content();
    return content;
}

module.exports = {
    goto,
    getRobotstxt
}
