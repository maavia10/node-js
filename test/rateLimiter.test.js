const axios = require("axios");
describe("Rate limiter test suit", () => {
    test("Make more than threshold calls", () => {
        expect.assertions(1);
        const axiosCollection = [
            axios.get("http://localhost:3000/v1/location/suggestions?q=London&latitude=43.70011&longitude=-79.4163&radius=5798&sort=distance"),
            axios.get("http://localhost:3000/v1/location/suggestions?q=London&latitude=43.70011&longitude=-79.4163&radius=5798&sort=distance"),
            axios.get("http://localhost:3000/v1/location/suggestions?q=London&latitude=43.70011&longitude=-79.4163&radius=5798&sort=distance"),
            axios.get("http://localhost:3000/v1/location/suggestions?q=London&latitude=43.70011&longitude=-79.4163&radius=5798&sort=distance"),
            axios.get("http://localhost:3000/v1/location/suggestions?q=London&latitude=43.70011&longitude=-79.4163&radius=5798&sort=distance"),
            axios.get("http://localhost:3000/v1/location/suggestions?q=London&latitude=43.70011&longitude=-79.4163&radius=5798&sort=distance"),
        ];
        return Promise.all(axiosCollection)
            .catch((error) => {
                expect(error.response.status).toBe(403);
            })
    });
})