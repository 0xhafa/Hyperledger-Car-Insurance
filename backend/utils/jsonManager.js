const fs = require('fs')

exports.addToJson = (fileName, newData) => {
  let data = fs.readFileSync(fileName);
  let json = JSON.parse(data);
  json.push(newData);
  fs.writeFile(fileName, JSON.stringify(json, null, 2), 'utf8', (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Data recorded");
    }
  })
  return newData;
}
//
exports.getJson = (fileName) => {
  return fs.readFileSync(fileName);
}