#!/usr/bin/node
/**
 * This program goes through a folder given and creates a list of
 * json objects for use in Mongodb.
 * 
 * Depending on -t options input:
 * 
 * movie:
 *  This is meant to be used in a plex media directory such as
 *   Movies
 *     - Movie (2019) => used for the name of the movie
 *       - Movie.mkv  => used for the fullpath of the media file (/Movies/Movie(2019)/Movie.mkv)
 * 
 * rom:
 *   This is meant to be used a directory with roms. Seperate from movie so we can be more specific for roms and disregard any checks movie does
 */
const args = require('yargs');
const fs = require('fs');
const path = require('path');

//set up arguments
const options = args.usage("Usage: -f <starting folder>")
  .option("t",
    { alias: "type", describe: "Select type 'movie' or 'roms'", type: "string", demandOption: true })
  .option("f",
    { alias: "folder", describe: "Starting folder", type: "string", demandOption: true })
  .argv;

  /**
   * Gets a human readable formatted file size
   * @param {*} file file path
   * @returns {string} file size
   */
function getFileSize(file) {
  var fileSize = fs.statSync(file).size;
  var i = Math.floor(Math.log(fileSize) / Math.log(1024));
  return ((fileSize / Math.pow(1024, i).toFixed(2) * 1).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]);
}

/**
 * Walks through all files in a given directory, and files in subdirectories of the directory
 * @param {string} dir starting directory
 */
function walkRom(dir) {
  const array = [];
  fs.readdirSync(dir).forEach(file => {
    let fullpath = path.join(dir, file);
    if (fs.lstatSync(fullpath).isDirectory()) {
      walkRom(fullpath);
    } else {
      const obj = { 
        "category": path.basename(path.dirname(fullpath)),
        "name": (fullpath.substring(fullpath.lastIndexOf('/')+1).replace(/\.[^/.]+$/, "")).replaceAll('_', ' '),
        "path": fullpath, 
        "fileSize": getFileSize(fullpath)
      };
      array.push(obj);
    }
  });
  array.forEach(n => console.log(JSON.stringify(n)));
}

/**
 * Walks through all files in a given directory, and files in subdirectories of the directory/
 * @param {*} dir starting directory
 */
function walkMovie(dir) {
  const array = [];
  fs.readdirSync(dir).forEach(file => {
    let fullpath = path.join(dir, file);
    if (fs.lstatSync(fullpath).isDirectory() && !fullpath.match(/(Featurettes)/ig) && !fullpath.match(/(Subs)/ig)) {
      //If file is a directory, check that directory (and ignore Featurettes/Subs folders)
      walkMovie(fullpath);
    } else {
      if (!fullpath.endsWith(".srt") && !fullpath.endsWith(".sfv") && !fullpath.match(/(Featurettes)/g) && !fullpath.match(/(Subs)/g)) {
        //Ignore .srt/.sfv/Featurettes/Subs
        const template = { 
          "name": path.basename(path.dirname(fullpath)), 
          "path": fullpath,
          "fileSize": getFileSize(fullpath)
        };
        array.push(template);
      }
    }
  });
  //stdout print the results.
  array.forEach(n => console.log(JSON.stringify(n)));
}

if (options.type === 'movie') {
  walkMovie(options.folder);
} else if (options.type === 'rom') {
  walkRom(options.folder);
}
