const {MongoClient} = require('mongodb');

let connection
function getMongo() { 
    if (connection) return connection 
    const dbUrl = "mongodb://cmurad0215:cQ40108TU@ds263590.mlab.com:63590/nodejsecom"
    connection = MongoClient.connect(dbUrl) 
    return connection 
}

module.exports = {getMongo}