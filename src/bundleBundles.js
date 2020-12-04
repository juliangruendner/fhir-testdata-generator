var http = require('http');
const fs = require('fs');
const lReader = require('readline');
var path = require('path');
const lineByLine = require('n-readlines');


var files = fs.readdirSync('./output/');

var EXTENSION = '.json';
var jsonFiles = files.filter(function (file) {
  return path.extname(file).toLowerCase() === EXTENSION;
});




jsonFiles.forEach(curFile => {

  let outputFile = './largerFhirBundles/' + curFile

  let fileStream = fs.createWriteStream(outputFile, {
    flags: 'a+'
  })

  const liner = new lineByLine('./output/' + curFile);
  let line
  let nBundleSize = 100;
  let curBundle



  while (line = liner.next()) {
    line = line.toString('utf-8');
    let curJson = JSON.parse(line)

    if (curBundle == undefined) {
      curBundle = curJson
    } else {
      curBundle['entry'] = curBundle['entry'].concat(curJson['entry'])
    }


    if (curBundle['entry'].length > nBundleSize) {
      fileStream.write(JSON.stringify(curBundle) + "\n", function (err) {
        if (err) throw err;
      });

      curBundle = undefined
    }

  }

  if (curBundle != undefined) {
    fileStream.write(JSON.stringify(curBundle) + "\n", function (err) {
      if (err) throw err;
    });
  }

});