const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const environment = process.env.REACT_APP_ENVIRONMENT;
const tenant = process.env.REACT_APP_TENANT;

const moengageDir = path.resolve(__dirname, '../src/tenant', tenant, 'moengage');
const publicDir = path.resolve(__dirname, '../public');

function copyFiles(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Source directory ${sourceDir} does not exist. Skipping copy operation.`);
    return;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir);
  files.forEach((file) => {
    const srcFile = path.join(sourceDir, file);
    const destFile = path.join(targetDir, file);

    fs.copyFileSync(srcFile, destFile);
  });
}

if (!!environment && environment != 'localhost') {
  copyFiles(moengageDir, publicDir);
}
