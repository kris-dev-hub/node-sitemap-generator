/**
 * Get Internal links to other pages
 * @param pageInstance - page instance
 * @returns - boolean - true if its a page, false if it's not
 */
async function getInternalLinks(pageInstance){
    let page = await pageInstance;
    let url = await page.url();

    let internalLinks = await page.evaluate((url) => {
        var internalLinks = [];
        var element = document.createElement ('a');
        element.href = url;

        //check if the link don't point files instead of page
        function getLinkType(link) {
            var element = document.createElement ('a');
            element.href = link;
            var fileType = ['.ai', '.png', '.jpg', '.gif', '.bmp', '.gif', '.ico', '.jpeg', '.ps', '.psd', '.svg', '.tif', '.tiff','.3g2', '.3gp', '.avi', '.flv', '.h264', '.m4v', '.mkv', '.mov', '.mp4', '.mpg', '.mpeg', '.rm', '.swf', '.vob', '.wmv','.aif', '.cda', '.mid', '.midi', '.mp3', '.mpa', '.ogg', '.wav', '.wma', '.wpl','.doc', '.docx', '.odt', '.pdf', '.rtf', '.tex', '.txt', '.wks', '.wps', '.wpd', 'xml','.ods', '.xlr', '.xls', '.xlsx','.7z', '.arj', '.deb', '.pkg', '.rar', '.rpm', '.gz', '.z', '.zip'];
            for(var i=0; i<fileType.length; i++) {
                if(element.pathname.substr(element.pathname.length-fileType[i].length).toLocaleLowerCase()===fileType[i]) {
                    return false;
                }
            }
            return true
        }

        //add link if it's internal link
        let allLinks = document.links;
        for(var i=0; i<allLinks.length; i++) {
            //check if link is not nofollow
            if(allLinks[i].rel.includes("nofollow")===false) {
                if (allLinks[i].hostname == element.hostname) {
                    if (getLinkType(allLinks[i].href) == true) {
                        internalLinks.push(allLinks[i].href);
                    }
                }
            }
        }
        return internalLinks;
    },url);

    return internalLinks;
}

/**
 *
 * @param pageInstance - page instance
 * @returns - boolean - true if noindex, false if it's not noindex
 */
async function checkForNoindex(pageInstance) {
    let page = await pageInstance;
    let noindex = await page.evaluate((url) => {
        function checkMetaNoindex() {
            var metaTags = document.getElementsByTagName("meta");
            for (var i = 0; i < metaTags.length; i++) {
                console.log(metaTags[i].getAttribute("name"));
                if (metaTags[i].getAttribute("name") == "robots") {
                    var metaContent = metaTags[i].getAttribute("content");
                    if (metaContent.toLowerCase().indexOf('noindex') > -1) {
                        return true;
                    }
                }
            }
            return false;
        }
        return checkMetaNoindex();
    });
    return noindex;
}

module.exports = {
    getInternalLinks,
    checkForNoindex
}
