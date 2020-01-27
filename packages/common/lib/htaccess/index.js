const path = require("path");
const fsp = require("fs").promises;
const hbs = require("handlebars");
const validate = require("../config/validate");

const templateString = `
Header set X-Spaship-Name "{{ name }}"

{{#if single }}
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule (.*) index.html
    Header set X-Spaship-Single "true"
</IfModule>
{{/if}}
`;
const template = hbs.compile(templateString);

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
