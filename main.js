'use strict';

const config = require('./config.json');
const express = require('express');
const bodyParser = require('body-parser');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();

//start express server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('static'));
const server = app.listen(config.port, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/', (req, res) => {
  res.json({
    "Hello": "world"
  });
});

app.post('/report', (req, res) => {
  res.send(JSON.stringify(getReportFolderList()));
});

function getReportFolderList() {
  var results = [];
  const reportPath = './static/' + config.reportFolder;

  var list = fs.readdirSync(reportPath);
  list.forEach(item => {
    let stat = fs.statSync(reportPath + '/' + item);
    if (stat.isDirectory()) {
      if (fs.existsSync(reportPath + '/' + item + '/' + config.reportFile)) {
       results.push(item);
      }
    }
  });

  if (results.length > 0) {
    results.push(config.reportFolder);
    results.push(config.reportFile);
  }
  return results;
}
