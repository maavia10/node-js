const router = require('express').Router();
const {getSuggestions} = require("../services/location");


router.get('/suggestions', (req, res) => {
    return getSuggestions(req.query)
        .then((data) => res.status(200).json({suggestions: data}))
        .catch((error) => res.status(error.status || 500).json(error))
});

module.exports = router;
