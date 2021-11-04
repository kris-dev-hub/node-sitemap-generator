/**
 * Store sitemap.xml
 * @param links - links to store in sitemap
 * @param fileName - name of sitemap file
 */
async function storeSitemap(links,fileName){

    var data='';
    data += '<?xml version="1.0" encoding="UTF-8"?>'+"\n";
    data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+"\n";


    for(var i=0; i<links.length; i++) {
        data += ' <url>'+"\n";
        data += '  <loc>'+links[i].link+'</loc>'+"\n";
        data += '  <changefreq>monthly</changefreq>'+"\n";
        data += ' </url>'+"\n";
    }

    data += '</urlset>'+"\n";
    data += ''+"\n";

    fs = require('fs');
    fs.writeFile(fileName, data, function (err) {
        if (err) return console.log(err);
    });

}

module.exports = {
    storeSitemap,
}
