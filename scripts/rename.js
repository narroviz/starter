const rimraf = require('rimraf');
const replace = require('replace-in-file');
const fs = require('fs');

let underscoreReference = ''
let dashedReference = ''


const jsonFiles = fs.readdirSync('./data').filter(d => d.endsWith('.json'));
jsonFiles.reduce((prev, file) => {
	if (file === "meta.json") {
		const content = fs.readFileSync(`./data/${file}`, 'utf-8');
	    const json = JSON.parse(content);
		underscoreReference = json.underscoreReference
		dashedReference = json.dashedReference
	}
})

replace.sync({
  files: './dist/index.html',
  from: "<link inline rel='stylesheet' href='bundle.css' />",
  to: `<link rel='stylesheet' href='./../css/${dashedReference}.css' />`,
});


replace.sync({
  files: './dist/index.html',
  from: "<script src='main.js' async></script></body>",
  to: `<script src='./../js/${dashedReference}.js' async></script>`,
});


fs.rename('./dist/bundle.css', `./dist/${dashedReference}.css`, function(err) {
    if ( err ) console.log('ERROR: ' + err);
});
fs.rename('./dist/index.html', `./dist/${dashedReference}.html`, function(err) {
    if ( err ) console.log('ERROR: ' + err);
});
fs.rename('./dist/main.js', `./dist/${dashedReference}.js`, function(err) {
    if ( err ) console.log('ERROR: ' + err);
});
