const { join } = require('node:path');

module.exports = function outputPath(name) {
  return join(__dirname, name);
};
