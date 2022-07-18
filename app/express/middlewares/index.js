const {rateLimiter} = require("./rate-limiter");

const applyMiddlewares = (app, express) => {
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use('/favicon.ico', (req, res) => res.status(204));
    app.use(cors());
    app.use(rateLimiter());
};


const applyErrorMiddlewares = (app) => {
    app.use(pathNotFound());
    app.use(serverErrorMiddleware());
};

const cors = () => (req, res, next) => {
    res.header("Access-control-allow-origin", (process.env.ALLOWED_ORIGIN || "*"));
    res.header("Access-control-allow-headers", "authorization, content-type, auth");

    if (req.method === "OPTIONS") {
        res.header("Access-control-allow-methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json();
    }

    next();
};


const pathNotFound = () => (req, res, next) => {
    next({
        status: 400,
        message: "Path doesn't exists"
    });
};

const serverErrorMiddleware = () => (error, req, res, _) => {
    console.log("error is", error);
    return res.status(error.status || 500).json(error);
};

module.exports = {
    applyMiddlewares,
    applyErrorMiddlewares
};
