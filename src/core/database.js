const fs = require('fs');
const path = require('path');

const DATABASE_FILE_PATH = path.join(__dirname, "..", "..", 'database.json');

if (fs.existsSync(DATABASE_FILE_PATH) == false) {
    fs.writeFileSync(DATABASE_FILE_PATH, JSON.stringify({}, null, 2));
}

module.exports = {
    save(data = []) {
        fs.writeFileSync(DATABASE_FILE_PATH, JSON.stringify(data, null, 2));
    },
    load() {
        try {
            const data = fs.readFileSync(DATABASE_FILE_PATH);

            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }
}