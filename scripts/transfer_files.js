const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

const CURRENT_DIR = process.cwd()
const PARENT_DIR = path.dirname(CURRENT_DIR)
const ROOT_DIR = path.join(PARENT_DIR, 'narroviz.github.io')
const DIST_DIR = path.join(CURRENT_DIR, 'dist')
const ASSETS_DIR = path.join(DIST_DIR, 'assets')

const OUTPUT_HTML_DIR = path.join(ROOT_DIR, 'html')
const OUTPUT_CSS_DIR = path.join(ROOT_DIR, 'css')
const OUTPUT_JS_DIR = path.join(ROOT_DIR, 'js')
const OUTPUT_ASSETS_DIR = path.join(ROOT_DIR, 'assets')
const OUTPUT_DATA_DIR = path.join(OUTPUT_ASSETS_DIR, 'data')


function copyFileFromCurrDirToOutputDir(filename, inputDirectory, outputDirectory) {
	const inputFilepath = path.join(inputDirectory, filename)
	const outputFilepath = path.join(outputDirectory, filename)
	fs.copyFile(inputFilepath, outputFilepath, (err) => {
		if (err) throw err;
	  	console.log(`${filename} was copied to ${outputFilepath}`);
	});
}

const htmlFile = fs.readdirSync(DIST_DIR).filter(d => d.endsWith('.html'))[0];
const cssFile = fs.readdirSync(DIST_DIR).filter(d => d.endsWith('.css'))[0];
const jsFile = fs.readdirSync(DIST_DIR).filter(d => d.endsWith('.js'))[0];

// (1) Output .html, .css, and .js files
copyFileFromCurrDirToOutputDir(htmlFile, DIST_DIR, OUTPUT_HTML_DIR)
copyFileFromCurrDirToOutputDir(cssFile, DIST_DIR, OUTPUT_CSS_DIR)
copyFileFromCurrDirToOutputDir(jsFile, DIST_DIR, OUTPUT_JS_DIR)

// (2) Update the stories.json file with the most recent item
const storiesPath = path.join(OUTPUT_DATA_DIR, 'stories.json')
const storiesContent = fs.readFileSync(storiesPath, 'utf-8');
const stories = JSON.parse(storiesContent);
const storyMeta = JSON.parse(fs.readFileSync(`./data/meta.json`, 'utf-8'))
const storyItem = {
	"image": storyMeta.underscoreReference,
	"url": `html/${storyMeta.dashedReference}`,
	"hed": storyMeta.title
}
if(!stories.some(story => story.url === storyItem.url)) {
	const storiesOutput = [storyItem].concat(stories)
	fs.writeFile(storiesPath, JSON.stringify(storiesOutput), 'utf8', (err) => {
		if (err) throw err;
		console.log(`Added ${storyItem.url} to ${storiesPath}`);
	});
}

// (3) Transfer all the /dist/assets files into narrovi.github.io (DOES NOT OVERWRITE)
ncp.clobber = false
ncp(ASSETS_DIR, OUTPUT_ASSETS_DIR, function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('Transferred /dist/assets items to output directory (no overwrite)');
});
