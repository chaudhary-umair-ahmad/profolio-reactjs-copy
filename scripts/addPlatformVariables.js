const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { dirname } = path;

const tenant = process.env.REACT_APP_TENANT;

const sourcePath = `src/tenant/${tenant}/variables/index.js`; // Change this to your actual source file
const destinationPath = `src/utility/variables.js`; // Change this to your desired destination

const destDir = dirname(destinationPath);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  fs.copyFileSync(sourcePath, destinationPath);
} catch (error) {
  console.error(`Error copying file:`, error);
  process.exit(1); // Exit with error code
}
