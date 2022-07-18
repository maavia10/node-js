const {MongoClient} = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://mongodb:27017';
const client = new MongoClient(url);
const dbName = process.env.DB_NAME || 'myProject';

function establishDatabaseConnection() {
    return client.connect()
        .then(() => {
            console.log('DB connected successfully');
        });
}

module.exports = {
    establishDatabaseConnection,
    mongoConnection: client.db(dbName)
};