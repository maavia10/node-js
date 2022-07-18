const {mongoConnection} = require("../db/index");

const teardown = async () => {
    process.exit(-1);
    return mongoConnection.close();
}

module.exports = teardown;