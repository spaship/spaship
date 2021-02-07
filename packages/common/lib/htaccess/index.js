const path = require("path");
const fsp = require("fs").promises;
const validate = require("../config/validate");

const template = ({ name, single }) => {
  let templateString = `Header set X-Spaship-Name "${name}"`;

  if (single) {
    templateString += `
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule (.*) index.html
    Header set X-Spaship-Single "true"
</IfModule>
`;
  }
  return templateString;
};

async function generate(data) {
  const validation = validate(data);
  if (!validation.valid) {
    throw new Error(`config not valid: ${JSON.stringify(validation.errors)}`);
  }
  return template(data);
}

async function write(destDir, data) {
  const htaccess = await generate(data);
  await fsp.writeFile(path.join(destDir, ".htaccess"), htaccess);
}

module.exports = { generate, write };
