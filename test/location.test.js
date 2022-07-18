const {mongoConnection} = require("../db/index");
const {getSuggestions} = require("../app/express/services/location");

describe("Location testing suite", () => {

    test("When query params are missing", () => {
        expect.assertions(1);
        return getSuggestions({})
            .catch((error) => {
                expect(error.status).toBe(400);
            });
    });

    test("When lat and long value is string", () => {
        expect.assertions(1);
        return getSuggestions({q: "London", latitude: "a", longitude: "q", radius: 5798, sort: "distance"})
            .catch((error) => {
                expect(error.status).toBe(400);
            });
    });

    test("When radius is string", () => {
        expect.assertions(1);
        return getSuggestions({q: "London", latitude: 43.70011, longitude: -79.4163, radius: "q", sort: "distance"})
            .catch((error) => {
                expect(error.status).toBe(400);
            });
    });

    test("When sort is not distance or name", () => {
        expect.assertions(1);
        return getSuggestions({q: "London", latitude: 43.70011, longitude: -79.4163, radius: 5798, sort: "distance1"})
            .catch((error) => {
                expect(error.status).toBe(400);
            });
    });

    test("When query params are present", () => {
        expect.assertions(1);
        return mongoConnection.collection("location").insertMany([
            {
                "name": "London, ON, Canada",
                "lat": "42.98339",
                "long": "-81.23304"
            },
            {
                "name": "London, OH, USA",
                "lat": "39.88645",
                "long": "-83.44825"

            },
            {
                "name": "London, KY, USA",
                "lat": "37.12898",
                "long": "-84.08326"
            },
            {
                "name": "Londontowne, MD, USA",
                "lat": "38.93345",
                "long": "-76.54941"
            }
        ]).then(() => {
            return getSuggestions({
                q: "London",
                latitude: 43.70011,
                longitude: -79.4163,
                radius: 5798,
                sort: "distance"
            })
        }).then((data) => {
            expect(data).toEqual([
                    {
                        name: 'London, OH, USA',
                        distance: 5739.573162929405,
                        latitude: '39.88645',
                        longitude: '-83.44825'
                    },
                    {
                        name: 'London, KY, USA',
                        distance: 5773.987034619233,
                        latitude: '37.12898',
                        longitude: '-84.08326'
                    },
                    {
                        name: 'London, ON, Canada',
                        distance: 5797.865717205577,
                        latitude: '42.98339',
                        longitude: '-81.23304'
                    }
                ]
            );
        });

    });
});