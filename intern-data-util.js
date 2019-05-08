var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('interns.json'));
}

function saveData(data) {

    var obj = {
        interns: data
    };

    fs.writeFileSync('interns.json', JSON.stringify(obj));
}

module.exports = {
    loadData: loadData,
    saveData: saveData
}
