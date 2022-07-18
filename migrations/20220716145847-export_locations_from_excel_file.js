const fs = require('fs');
module.exports = {
    async up(db, _) {
        const readable = fs.createReadStream("./cities_canada-usa.tsv");
        let isHeaders = true;
        let headers = [];
        readable.on('data', (chunk) => {
            readable.pause();
            const data = createTwoDimensionalDataFromBuffer(chunk.toString().split("\n"), isHeaders);
            if (isHeaders) {
                headers = data.headers;
            }
            isHeaders = false;
            const collection = getJSONCollection(headers, data.twoDimensionalArr);
            db.collection("location").insertMany(collection).then(() => readable.resume())
        });

        return new Promise((resolve, __) => {
            readable.on('end', () => {
                resolve();
            });
        });
    },
    async down(_, __) {
        return true;
    }
};

function createTwoDimensionalDataFromBuffer(arr, isHeaders) {
    let headers = [];
    const twoDimensionalArr = [];
    for (let element of arr) {
        element = element.split("\t");
        if (isHeaders && !headers.length) {
            headers = element;
        } else {
            twoDimensionalArr.push(element);
        }
    }
    return {
        ...(isHeaders && {headers}),
        twoDimensionalArr
    }
}

function getJSONCollection(headers, twoDimensionalArr) {
    const collection = []
    for (let row of twoDimensionalArr) {
        const doc = {};
        let itr = 0;
        for (let column of row) {
            doc[headers[itr]] = column;
            itr++;
        }
        collection.push({...doc});
    }
    return collection;
}
