const jsonFile = require('jsonfile');
const path = require('path');

const file = path.join(__dirname, '__cache.json');

module.exports = {
  getKey: function () {
    return JSON.stringify(arguments);
  },

  get: function (key) {
    return jsonFile.readFileSync(file)[key];
  },

  set: function (key, data) {
    const cacheData = jsonFile.readFileSync(file);
    cacheData[key] = data;
    jsonFile.writeFileSync(file, cacheData);
  }
};