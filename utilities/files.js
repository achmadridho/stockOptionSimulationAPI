const fs=require("fs");

readFileJSON = (filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            fs.readFile(filePath, (err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            });
        } catch (error) {
            reject(error)
        }
    })
};
writeFileJSON = (JArray,filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            fs.writeFile(filePath,JSON.stringify(JArray), (err) => {
                if (err) reject(false);
                else resolve(true);
            });
        } catch (error) {
            reject(error)
        }
    })
};


module.exports = { readFileJSON,writeFileJSON };