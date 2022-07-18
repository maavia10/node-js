const rateLimiter = () => {
    const ips = {};
    return (req, res, next) => {
        if (!ips[req.ip]) {
            ips[req.ip] = {
                counter: 1,
                lastHit: new Date()
            }
            next();
        } else {
            const thresholdInSec = (process.env.thresholdLimit || 60);
            const totalAllowedRequestsInThreshold = process.env.thresholdLimit || 5;
            const timeDiffInSec = ((new Date()).getTime() - ips[req.ip].lastHit.getTime()) / 1000;
            if (timeDiffInSec > thresholdInSec) {
                ips[req.ip] = {
                    counter: 1,
                    lastHit: new Date()
                }
                next();
            } else if (ips[req.ip].counter < totalAllowedRequestsInThreshold) {
                ips[req.ip].counter++;
                ips[req.ip].lastHit = new Date();
                next();
            } else {
                next({
                    status: 403,
                    message: `Can only hit ${totalAllowedRequestsInThreshold} request(s) in ${thresholdInSec / 60} minute(s)`
                });
            }

        }

    }
}

module.exports = {
    rateLimiter
};

/*
console.log("req.ip", req.headers['x-forwarded-for']);
console.log("req.ip", typeof req.socket.remoteAddress);
 */