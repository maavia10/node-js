const {mongoConnection} = require("../db/index");

afterEach(() => {
    return mongoConnection.dropDatabase();
});


