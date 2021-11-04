/**
 * Store collected links in sqlite3 table
 * @param linkInstance - links list
 * @param dbInstance - db instance
 */
async function storeLinks(linkInstance,dbInstance){
    let links = await linkInstance;
    const db = await dbInstance;

    for(var i=0; i<links.length; i++) {
        if(links[i].includes("#")===false) {
            let insertInstance = await linkRecordExist(dbInstance,links[i]);
            let insert = await insertInstance;
            if(insert===undefined) {
                await db.run("INSERT INTO links (link) VALUES (?)", links[i]);
            }
        }
    }

    return db;
}

/**
 * save info about visited link
 * @param dbInstance - db instance
 * @param link - link
 */
async function linkChecked(dbInstance,link){
    const db = await dbInstance;

    return new Promise(function (resolve) {
        db.get("UPDATE links set visited=1 WHERE link = ? ",link, function (err, row) {
            resolve(row);
        });
    });
}

/**
 * save http status of visited link
 * @param dbInstance - db instance
 * @param link - link
 */
async function properStatus(dbInstance,link){
    const db = await dbInstance;

    return new Promise(function (resolve) {
        db.get("UPDATE links set status=1 WHERE link = ? ",link, function (err, row) {
            resolve(row);
        });
    });
}

/**
 * check if record with link already exist
 * @param dbInstance - db instance
 * @param link - link
 */
async function linkRecordExist(dbInstance,link) {
    const db = await dbInstance;
    return new Promise(function (resolve) {
        db.get("SELECT rowid AS id, link FROM links WHERE link = ? ",link, function (err, row) {
            resolve(row);
        });
    });
}

/**
 * get random link to visit
 * @param dbInstance - db instance
 * @returns - link
 */
async function getRandomLink(dbInstance) {
    const db = await dbInstance;
    return new Promise(function (resolve) {
        db.all("SELECT rowid AS id, link FROM links WHERE visited = 0 ORDER BY RANDOM() limit 1", function (err, rows) {
//            console.log(row.link);
            if(rows[0]!==undefined) {
                resolve(rows[0].link);
            } else {
                resolve(false);
            }
        });
    });
}

/**
 * get all links
 * @param dbInstance - db instance
 * @returns - arrau of links
 */
async function getAllLinks(dbInstance) {
    const db = await dbInstance;

    return new Promise(function(resolve, reject) {
        let params=[]

        db.all("SELECT rowid AS id, link,visited FROM links WHERE status=1 ORDER BY link", params, function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    })

}

/**
 * count all links
 * @param dbInstance - db instance
 * @returns - qty of links
 */
async function countAllLinks(dbInstance) {
    const db = await dbInstance;

    return new Promise(function(resolve, reject) {

        db.get("SELECT count(rowid) AS qty FROM links ", function (err, row) {
            if(err) reject("Read error: " + err.message)
            resolve(row['qty']);
        });

    })

}


module.exports = {
    storeLinks,
    linkChecked,
    getRandomLink,
    getAllLinks,
    properStatus,
    countAllLinks
}
