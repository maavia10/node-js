process.env.DB_NAME = "testDb";
//global.DB_NAME = "testDb";

//const {exec} = require('child_process');
const {runServer} = require("../server");


const globalSetup = async () => {
    //exec("npm run start")
    await runServer();
}

module.exports = globalSetup;