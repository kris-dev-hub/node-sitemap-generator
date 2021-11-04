/**
 * open new page
 * @param browserInstance - instance of web browser
 * @returns browser page instance
 */
async function startPage(browserInstance){
    let browser = await browserInstance;
    let page = await browser.newPage();
    await page.setViewport({width: 0, height: 0});
    return page;
}

/**
 * open page nr i , default 0 (first one)
 * @param browserInstance - instance of web browser
 * @returns browser page instance
 */
async function openPage(browserInstance,i=0){
    let browser = await browserInstance;
    let pages = await browser.pages();
    let page = pages[i];
    await page.setViewport({width: 0, height: 0});
    return page;
}

module.exports = {
    startPage,
    openPage
}
