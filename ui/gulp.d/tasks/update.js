'use strict';
const https = require('https');
const fs = require('fs');

const headerPath = 'https://www.openzeppelin.com/api/header';
const headerFileName = 'header-shared.hbs';
const footerPath = 'https://www.openzeppelin.com/api/footer';
const footerFileName = 'footer-shared.hbs';
const dependencies = 'https://www.openzeppelin.com/api/dependencies';

function getHbs(url, fileName) {
  https.get(url, function(response) {
    let body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      const parsed = JSON.parse(body).data;
      fs.writeFileSync('partials/' + fileName, parsed);
    });
  });
}

function getDependencies(url, type) {
  https.get(url, function(response) {
    let body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      const parsed = JSON.parse(body).data;
      let styleLink = '';
      let scriptLink = '';
      for (let i = 0; i < parsed.styles.length; i++) {
        styleLink += `<link rel="stylesheet" href="${
          parsed.styles[i]
        }" type="text/css">`;
      }
      for (let i = 0; i < parsed.scripts.length; i++) {
        scriptLink += `<script src="${parsed.scripts[i]}"></script>`;
      }
      fs.writeFileSync('partials/head-shared.hbs', styleLink + scriptLink);
    });
  });
}

module.exports = () => {
  getHbs(headerPath, headerFileName);
  getHbs(footerPath, footerFileName);
  getDependencies(dependencies);
};
