const router = require("express").Router();
const LocationRoutes = require('./location');

const setupRoutes = (app) => {
    router.use("/location", LocationRoutes);
    app.use("/v1", router);
};

module.exports = {
    setupRoutes,
};
