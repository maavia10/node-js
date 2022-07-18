const {establishDatabaseConnection} = require("./db/index");


const startServer = () => {
    const PORT = process.env.APP_PORT || 3000;
    const http = require("http");
    const app = require("./app/app");

    return new Promise((resolve, __) => {
        http.createServer(app).listen(PORT, () => {
            resolve(true);
            console.log(`Server is listening on port ${PORT}`);
        });
    })
};


const runServer = () => {
    /*can access those values
    console.log("global.abc", global.abc);
    console.log("process.env.aa", process.env.aa);*/
    return establishDatabaseConnection()
        .then(() => {
            return startServer();
        }).catch((error) => {
            console.log("Couldn't start the application because of error ", error);
            process.exit(-1);
        });
}

module.exports = {runServer};
