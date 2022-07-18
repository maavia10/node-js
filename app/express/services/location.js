const {mongoConnection} = require("../../../db");

const getSuggestions = ({q, latitude, longitude, radius, sort}) => {
    if (!q || !latitude || !longitude || !radius || !sort) {
        return Promise.reject({message: "Please provide all fields", status: 400});
    }
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    radius = parseFloat(radius);
    if (Number.isNaN(latitude) || Number.isNaN(longitude) || Number.isNaN(radius)) {
        return Promise.reject({message: "latitude,longitude and radius should be numbers", status: 400});
    }

    if (["name", "distance"].indexOf(sort) < 0) {
        return Promise.reject({message: "sort value should be name or distance", status: 400});
    }

    return mongoConnection.collection("location").aggregate([
        {
            $set: {
                coordinates: {
                    $let: {
                        vars: {
                            lat: latitude,
                            long: longitude
                        },
                        in: {lat: "$$lat", long: "$$long"}
                    }
                }
            }
        },
        {

            $set: {
                distance: {
                    $multiply: [
                        3963.0, //distance in miles
                        {
                            $acos: {
                                $add: [
                                    {$multiply: [{$sin: {$toDouble: "$lat"}}, {$sin: "$coordinates.lat"}]},
                                    {
                                        $multiply: [
                                            {$cos: {$toDouble: "$lat"}}, {$cos: "$coordinates.lat"},
                                            {$cos: {$subtract: ["$coordinates.long", {$toDouble: "$long"}]}}
                                        ]
                                    }
                                ]

                            }
                        }
                    ]

                }

            }
        },
        {
            $match: {
                distance: {
                    $lte: radius
                },
                name: {$regex: `^${q}`, $options: "i"}
            }
        },
        {
            $sort: {
                [sort]: 1,
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                latitude: "$lat",
                longitude: "$long",
                distance: 1
            }
        }
    ]).toArray();
}

module.exports = {
    getSuggestions
}